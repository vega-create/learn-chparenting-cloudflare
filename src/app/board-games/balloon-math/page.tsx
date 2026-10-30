"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen, GamePage, BackToGames, GameIntro, GAME_UI } from "@/lib/game-utils";

/**
 * 心算氣球。
 *
 * 氣球帶著算式一顆一顆從上面掉下來，算出答案、輸入、按確認，氣球就會破掉。
 * 掉到底沒算出來就少一條命。三種程度（算式的範圍）× 三種速度可以分開選。
 *
 * 畫面更新用 requestAnimationFrame，氣球的位置放在 ref 裡，
 * 每一格才 setState 一次重畫，不會每個氣球各自觸發重畫。
 */

type Level = "easy" | "medium" | "hard";
type Speed = "slow" | "normal" | "fast";

interface Problem { text: string; answer: number }
interface Balloon { id: number; problem: Problem; x: number; y: number; color: string; spawnedAt: number }

const LEVELS: { id: Level; label: string; desc: string }[] = [
  { id: "easy", label: "初級", desc: "20 以內的加減" },
  { id: "medium", label: "中級", desc: "100 以內的加減、九九乘法" },
  { id: "hard", label: "高級", desc: "兩位數加減、乘到 12、除法" },
];
// fall：氣球從上面掉到底要幾秒；gap：每隔幾秒出一顆
const SPEEDS: { id: Speed; label: string; desc: string; fall: number; gap: number }[] = [
  { id: "slow", label: "慢", desc: "一顆 14 秒掉到底", fall: 14, gap: 4.5 },
  { id: "normal", label: "中", desc: "一顆 10 秒掉到底", fall: 10, gap: 3.2 },
  { id: "fast", label: "快", desc: "一顆 7 秒掉到底", fall: 7, gap: 2.3 },
];
const GAME_SECONDS = 60;
const LIVES = 3;
const MAX_BALLOONS = 4;
const COLORS = ["bg-rose-400", "bg-sky-400", "bg-emerald-400", "bg-amber-400", "bg-violet-400", "bg-pink-400"];
const MAX_SCORE = 200;

const randInt = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** 出一題；avoid 是畫面上已經有的答案，不要出到同一個答案 */
function makeProblem(level: Level, avoid: Set<number>): Problem {
  for (let tries = 0; tries < 30; tries++) {
    let p: Problem;
    if (level === "easy") {
      if (Math.random() < 0.5) { const a = randInt(1, 19); const b = randInt(1, 20 - a); p = { text: `${a} + ${b}`, answer: a + b }; }
      else { const a = randInt(2, 20); const b = randInt(1, a); p = { text: `${a} − ${b}`, answer: a - b }; }
    } else if (level === "medium") {
      const kind = pick(["add", "sub", "mul"]);
      if (kind === "add") { const a = randInt(10, 89); const b = randInt(1, 99 - a); p = { text: `${a} + ${b}`, answer: a + b }; }
      else if (kind === "sub") { const a = randInt(11, 99); const b = randInt(1, a - 1); p = { text: `${a} − ${b}`, answer: a - b }; }
      else { const a = randInt(2, 9); const b = randInt(2, 9); p = { text: `${a} × ${b}`, answer: a * b }; }
    } else {
      const kind = pick(["add", "sub", "mul", "div"]);
      if (kind === "add") { const a = randInt(15, 99); const b = randInt(15, 99); p = { text: `${a} + ${b}`, answer: a + b }; }
      else if (kind === "sub") { const a = randInt(30, 99); const b = randInt(11, a - 1); p = { text: `${a} − ${b}`, answer: a - b }; }
      else if (kind === "mul") { const a = randInt(3, 12); const b = randInt(3, 12); p = { text: `${a} × ${b}`, answer: a * b }; }
      else { const b = randInt(2, 9); const q = randInt(2, 12); p = { text: `${b * q} ÷ ${b}`, answer: q }; }
    }
    if (!avoid.has(p.answer)) return p;
  }
  return { text: "1 + 1", answer: 2 };
}

export default function BalloonMathPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [level, setLevel] = useState<Level>("easy");
  const [speed, setSpeed] = useState<Speed>("normal");
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [popped, setPopped] = useState(0);
  const [missed, setMissed] = useState<Problem[]>([]);
  const [flash, setFlash] = useState<"pop" | "miss" | "wrong" | null>(null);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const { highScore, updateHighScore } = useHighScore(`balloon-math-${level}-${speed}`);

  // 遊戲進行中的狀態放 ref，動畫迴圈才讀得到最新值
  const balloonsRef = useRef<Balloon[]>([]);
  const scoreRef = useRef(0);
  const livesRef = useRef(LIVES);
  const poppedRef = useRef(0);
  const missedRef = useRef<Problem[]>([]);
  const comboRef = useRef(0);
  const nextIdRef = useRef(1);
  const lastSpawnRef = useRef(0);
  const startRef = useRef(0);
  const rafRef = useRef(0);
  const endedRef = useRef(false);

  const speedCfg = SPEEDS[SPEEDS.findIndex(s => s.id === speed)];   // 固定的常數物件，effect 不會每次 render 都重跑

  const finish = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    cancelAnimationFrame(rafRef.current);
    const final = scoreRef.current;
    setScore(final);
    setPopped(poppedRef.current);
    setMissed(missedRef.current);
    setIsNewHigh(updateHighScore(final));
    if (final >= MAX_SCORE * 0.9) playPerfect(); else if (final >= MAX_SCORE * 0.5) playVictory();
    setMode("done");
  }, [updateHighScore]);

  const spawn = useCallback((now: number) => {
    const avoid = new Set(balloonsRef.current.map(b => b.problem.answer));
    const problem = makeProblem(level, avoid);
    balloonsRef.current = [...balloonsRef.current, {
      id: nextIdRef.current++, problem, x: 8 + Math.random() * 72, y: -12, color: pick(COLORS), spawnedAt: now,
    }];
    lastSpawnRef.current = now;
  }, [level]);

  // 動畫迴圈
  useEffect(() => {
    if (mode !== "playing") return;
    const tick = (now: number) => {
      if (endedRef.current) return;
      const elapsed = (now - startRef.current) / 1000;
      const left = Math.max(0, GAME_SECONDS - elapsed);
      setTimeLeft(Math.ceil(left));
      if (left <= 0) { finish(); return; }

      if (balloonsRef.current.length < MAX_BALLOONS && now - lastSpawnRef.current > speedCfg.gap * 1000) spawn(now);

      let lostLife = false;
      const alive: Balloon[] = [];
      for (const b of balloonsRef.current) {
        const y = -12 + ((now - b.spawnedAt) / 1000 / speedCfg.fall) * 112; // 掉到 100% 就是底
        if (y >= 100) {
          lostLife = true;
          missedRef.current = [...missedRef.current, b.problem];
          comboRef.current = 0;
        } else alive.push({ ...b, y });
      }
      balloonsRef.current = alive;
      if (lostLife) {
        livesRef.current -= 1;
        setLives(livesRef.current);
        playWrong();
        setFlash("miss"); setTimeout(() => setFlash(null), 300);
        if (livesRef.current <= 0) { setBalloons(alive); finish(); return; }
      }
      setBalloons(alive);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // 切到別的分頁時 requestAnimationFrame 會停，切回來氣球會瞬間全部掉到底。
    // 所以分頁看不見時先暫停，回來後把所有時間往後推，從離開時的位置繼續。
    let hiddenAt = 0;
    const onVisibility = () => {
      if (document.hidden) { hiddenAt = performance.now(); cancelAnimationFrame(rafRef.current); return; }
      if (!hiddenAt) return;
      const paused = performance.now() - hiddenAt;
      hiddenAt = 0;
      startRef.current += paused;
      lastSpawnRef.current += paused;
      balloonsRef.current = balloonsRef.current.map(b => ({ ...b, spawnedAt: b.spawnedAt + paused }));
      rafRef.current = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => { cancelAnimationFrame(rafRef.current); document.removeEventListener("visibilitychange", onVisibility); };
  }, [mode, speedCfg, spawn, finish]);

  const startGame = useCallback(() => {
    balloonsRef.current = []; scoreRef.current = 0; livesRef.current = LIVES; poppedRef.current = 0;
    missedRef.current = []; comboRef.current = 0; nextIdRef.current = 1; endedRef.current = false;
    const now = performance.now();
    startRef.current = now; lastSpawnRef.current = now - 10000; // 一開始就出第一顆
    setBalloons([]); setInput(""); setScore(0); setLives(LIVES); setTimeLeft(GAME_SECONDS);
    setPopped(0); setMissed([]); setFlash(null); setIsNewHigh(false);
    setMode("playing");
  }, []);

  const submit = useCallback(() => {
    if (input === "") return;
    const val = Number(input);
    // 同一個答案只會有一顆氣球；萬一有兩顆，先破最低的那一顆
    const targets = balloonsRef.current.filter(b => b.problem.answer === val).sort((a, b) => b.y - a.y);
    if (targets.length > 0) {
      const hit = targets[0];
      balloonsRef.current = balloonsRef.current.filter(b => b.id !== hit.id);
      setBalloons(balloonsRef.current);
      comboRef.current += 1;
      poppedRef.current += 1;
      scoreRef.current += 10 + Math.min(comboRef.current - 1, 5) * 2; // 連續答對每顆多 2 分，最多 +10
      setScore(scoreRef.current);
      setPopped(poppedRef.current);
      playCorrect();
      setFlash("pop");
    } else {
      comboRef.current = 0;
      scoreRef.current = Math.max(0, scoreRef.current - 3);
      setScore(scoreRef.current);
      playWrong();
      setFlash("wrong");
    }
    setTimeout(() => setFlash(null), 250);
    setInput("");
  }, [input]);

  const press = useCallback((key: string) => {
    if (key === "enter") submit();
    else if (key === "back") setInput(s => s.slice(0, -1));
    else setInput(s => (s.length >= 4 ? s : s === "0" ? key : s + key));
  }, [submit]);

  useEffect(() => {
    if (mode !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^\d$/.test(e.key)) { e.preventDefault(); press(e.key); }
      else if (e.key === "Backspace") { e.preventDefault(); press("back"); }
      else if (e.key === "Enter") { e.preventDefault(); press("enter"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, press]);

  const levelLabel = LEVELS.find(l => l.id === level)!.label;

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <GamePage>
        <BackToGames />
        <GameIntro gameId="balloon-math" title="心算氣球" desc="算出氣球上的答案，在它掉到底之前把它打破" />
        <div className={`${GAME_UI.rules} mb-5`}>
          <h3 className={GAME_UI.rulesTitle}>遊戲規則</h3>
          <ul className={GAME_UI.rulesList}>
            <li>氣球帶著算式從上面掉下來</li>
            <li>算出答案，輸入數字按「確認」，氣球就會破掉</li>
            <li>氣球掉到底沒算出來，少一條命；共 {LIVES} 條命</li>
            <li>每局 {GAME_SECONDS} 秒；連續答對有加分，答錯扣 3 分</li>
            <li>程度和速度可以分開選，先從「慢」開始</li>
          </ul>
        </div>

        <h3 className="text-sm font-bold text-[#263238] mb-2">1. 選程度</h3>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {LEVELS.map(l => (
            <button key={l.id} onClick={() => setLevel(l.id)} aria-pressed={level === l.id}
              className={`py-3 px-2 rounded-xl border cursor-pointer transition ${level === l.id ? GAME_UI.segOn : GAME_UI.segOff}`}>
              <span className="block font-bold">{l.label}</span>
              <span className="block text-xs opacity-80">{l.desc}</span>
            </button>
          ))}
        </div>
        <h3 className="text-sm font-bold text-[#263238] mb-2">2. 選氣球掉落的速度</h3>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {SPEEDS.map(s => (
            <button key={s.id} onClick={() => setSpeed(s.id)} aria-pressed={speed === s.id}
              className={`py-3 px-2 rounded-xl border cursor-pointer transition ${speed === s.id ? GAME_UI.segOn : GAME_UI.segOff}`}>
              <span className="block font-bold">{s.label}</span>
              <span className="block text-xs opacity-80">{s.desc}</span>
            </button>
          ))}
        </div>
        <button onClick={startGame}
          className={`w-full py-4 px-6 text-lg ${GAME_UI.primaryBtn}`}>
          開始：{levelLabel}・速度{SPEEDS.find(s => s.id === speed)!.label}
        </button>
        <p className="text-xs text-[#52616B] text-center mt-3">這個組合的最高紀錄：{highScore} 分</p>
      </GamePage>
    );
  }

  /* ─── Done ─── */
  if (mode === "done") {
    return (
      <GamePage>
        <BackToGames />
        <div className="text-center text-sm text-[#52616B] mt-4">
          {levelLabel}・速度{SPEEDS.find(s => s.id === speed)!.label}・打破 {popped} 顆{lives <= 0 ? "・氣球掉到底三次了" : "・時間到"}
        </div>
        {missed.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {missed.map((p, i) => <span key={i} className="text-sm px-3 py-1 rounded-lg bg-red-50 border border-red-100 text-red-600">{p.text} = {p.answer}</span>)}
          </div>
        )}
        <GameOverScreen
          score={score} maxScore={MAX_SCORE} gameName={`心算氣球 ${levelLabel}`} stars={getStars(score, MAX_SCORE)}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={startGame} onBack={() => setMode("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "balloon-math", activityName: "心算氣球", metadata: { level, speed } }}
        />
      </GamePage>
    );
  }

  /* ─── Playing ─── */
  return (
    <GamePage>
      <BackToGames />
      <h1 className="text-xl font-black text-[#263238] mt-2 mb-3">心算氣球</h1>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={GAME_UI.chip}>得分 <b className="text-[#2457A7]">{score}</b></span>
        <span className={GAME_UI.chip}>時間 <b className={`font-mono ${timeLeft <= 10 ? "text-red-500" : ""}`}>{timeLeft}s</b></span>
        <span className={GAME_UI.chip}>生命 <span>{"❤️".repeat(Math.max(lives, 0))}{"🖤".repeat(LIVES - Math.max(lives, 0))}</span></span>
      </div>

      {/* 天空 */}
      <div className={`relative h-[380px] sm:h-[420px] lg:h-[340px] rounded-2xl overflow-hidden border-2 transition-colors
        ${flash === "pop" ? "border-emerald-400 bg-emerald-50" : flash === "miss" ? "border-red-400 bg-red-50" : flash === "wrong" ? "border-amber-400 bg-amber-50" : "border-sky-200 bg-gradient-to-b from-sky-100 to-sky-50"}`}
        aria-live="polite" aria-label="掉落中的氣球">
        {balloons.map(b => (
          <div key={b.id} className="absolute flex flex-col items-center" style={{ left: `${b.x}%`, top: `${b.y}%`, transform: "translateX(-50%)" }}>
            <div className={`${b.color} w-[76px] h-[92px] rounded-[50%] shadow-md flex items-center justify-center`}>
              <span className="text-white font-black text-lg drop-shadow" style={{ fontVariantNumeric: "tabular-nums" }}>{b.problem.text}</span>
            </div>
            <div className="w-0.5 h-5 bg-slate-400/60" />
          </div>
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-emerald-300" />
      </div>

      {/* 輸入 */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <div className={`min-w-[6rem] h-12 px-4 rounded-xl border-2 bg-white flex items-center justify-center text-2xl font-black ${flash === "wrong" ? "border-red-400 text-red-500" : "border-slate-300 text-[#263238]"}`} aria-label="你的答案">
          {input || <span className="text-slate-300">?</span>}
        </div>
        <button onClick={() => press("enter")} disabled={input === ""}
          className={`h-12 px-6 rounded-xl font-bold text-white border-0 ${input === "" ? "bg-slate-200" : "bg-[#2457A7] cursor-pointer hover:bg-[#1d4688] active:scale-95"}`}>
          確認
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto mt-3 select-none sm:hidden">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(d => (
          <button key={d} onClick={() => press(d)} className="py-3 rounded-xl bg-white border border-slate-200 text-xl font-bold text-[#263238] cursor-pointer active:bg-slate-100">{d}</button>
        ))}
        <button onClick={() => press("back")} aria-label="刪除一個數字" className="py-3 rounded-xl bg-slate-50 border border-slate-200 text-lg font-bold text-slate-500 cursor-pointer active:bg-slate-200">⌫</button>
        <button onClick={() => press("0")} className="py-3 rounded-xl bg-white border border-slate-200 text-xl font-bold text-[#263238] cursor-pointer active:bg-slate-100">0</button>
        <button onClick={() => press("enter")} className="py-3 rounded-xl bg-[#2457A7] text-white text-base font-bold border-0 cursor-pointer active:bg-[#1d4688]">確認</button>
      </div>
      <p className="text-xs text-[#52616B] text-center mt-3 hidden sm:block">直接按鍵盤的數字和 Enter 就可以。</p>
      <div className="text-center mt-2">
        <button onClick={() => { endedRef.current = true; cancelAnimationFrame(rafRef.current); setMode("menu"); }}
          className="text-xs text-[#52616B] hover:text-[#263238] cursor-pointer bg-transparent border-0 underline">結束這一局</button>
      </div>
    </GamePage>
  );
}
