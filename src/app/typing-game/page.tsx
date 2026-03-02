"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { ENGLISH_WORDS, ENGLISH_SENTENCES } from "@/data/typing/english-words";
import { CHINESE_PHRASES } from "@/data/typing/chinese-phrases";
import ShareButtons from "@/components/ShareButtons";

/* ─── Types ─── */
type Lang = "en" | "zh";
type GameMode = "menu" | "falling" | "time-attack" | "sentence" | "speed-test" | "result";
type Difficulty = "easy" | "medium" | "hard";

interface FallingWord {
  id: number;
  text: string;
  x: number; // % from left
  y: number; // px from top
  speed: number;
}

/* ─── Helpers ─── */
const shuffle = <T,>(a: T[]): T[] => [...a].sort(() => Math.random() - 0.5);
const pick = <T,>(a: T[], n: number): T[] => shuffle(a).slice(0, n);

const MODES = [
  { id: "falling" as GameMode, icon: "🌧️", title: "落下文字", desc: "在文字落到底部前打完它", skill: "速度" },
  { id: "time-attack" as GameMode, icon: "⏱️", title: "限時挑戰", desc: "60 秒內打越多字越好", skill: "耐力" },
  { id: "sentence" as GameMode, icon: "📝", title: "句子打字", desc: "完整句子逐字打", skill: "準確" },
  { id: "speed-test" as GameMode, icon: "📊", title: "速度測試", desc: "測量你的打字速度 WPM", skill: "綜合" },
];

/* ═══════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════ */
export default function TypingGamePage() {
  const [lang, setLang] = useState<Lang>("en");
  const [mode, setMode] = useState<GameMode>("menu");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  // Game state
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [startTime, setStartTime] = useState(0);

  // Falling words
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const animRef = useRef<number>(0);
  const nextIdRef = useRef(0);
  const lastSpawnRef = useRef(0);

  // Sentence mode
  const [sentences, setSentences] = useState<string[]>([]);
  const [sentIdx, setSentIdx] = useState(0);
  const [sentInput, setSentInput] = useState("");
  const [sentErrors, setSentErrors] = useState(0);
  const [sentCorrectChars, setSentCorrectChars] = useState(0);
  const [sentTotalChars, setSentTotalChars] = useState(0);

  // Speed test
  const [speedText, setSpeedText] = useState("");
  const [speedInput, setSpeedInput] = useState("");
  const [speedStarted, setSpeedStarted] = useState(false);

  // Chinese mode
  const [zhPhrases, setZhPhrases] = useState<{ text: string; zhuyin: string }[]>([]);
  const [zhIdx, setZhIdx] = useState(0);
  const [zhInput, setZhInput] = useState("");
  const composingRef = useRef(false);

  const resetGame = useCallback(() => {
    setScore(0); setCombo(0); setMaxCombo(0); setCorrect(0); setWrong(0);
    setTimeLeft(60); setGameActive(false); setInput("");
    setFallingWords([]); nextIdRef.current = 0; lastSpawnRef.current = 0;
    setSentIdx(0); setSentInput(""); setSentErrors(0); setSentCorrectChars(0); setSentTotalChars(0);
    setSpeedInput(""); setSpeedStarted(false);
    setZhIdx(0); setZhInput("");
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, []);

  const startGame = (m: GameMode) => {
    resetGame();
    setMode(m);
    setGameActive(true);
    setStartTime(Date.now());

    if (m === "sentence") {
      if (lang === "en") {
        setSentences(shuffle(ENGLISH_SENTENCES).slice(0, 10));
      } else {
        const pool = CHINESE_PHRASES[difficulty];
        setZhPhrases(shuffle(pool).slice(0, 10));
      }
    }

    if (m === "speed-test") {
      if (lang === "en") {
        setSpeedText(shuffle(ENGLISH_SENTENCES).slice(0, 3).join(" "));
      } else {
        const pool = CHINESE_PHRASES[difficulty];
        setSpeedText(shuffle(pool).slice(0, 5).map(p => p.text).join(""));
      }
    }

    if (m === "time-attack") {
      setTimeLeft(60);
    }

    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Timer for time-attack
  useEffect(() => {
    if (!gameActive) return;
    if (mode !== "time-attack" && mode !== "falling") return;

    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setGameActive(false);
          setMode("result");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameActive, mode]);

  // ─── FALLING WORDS GAME ───
  useEffect(() => {
    if (mode !== "falling" || !gameActive) return;

    const pool = lang === "en"
      ? ENGLISH_WORDS[difficulty]
      : CHINESE_PHRASES[difficulty].map(p => p.text);

    const spawnInterval = difficulty === "easy" ? 2500 : difficulty === "medium" ? 2000 : 1500;
    const baseSpeed = difficulty === "easy" ? 0.5 : difficulty === "medium" ? 0.8 : 1.2;

    let lastTime = performance.now();
    lastSpawnRef.current = lastTime;

    const animate = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      // Spawn new words
      if (time - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = time;
        const word = pool[Math.floor(Math.random() * pool.length)];
        setFallingWords(prev => [...prev, {
          id: nextIdRef.current++,
          text: word,
          x: 10 + Math.random() * 70,
          y: -30,
          speed: baseSpeed + Math.random() * 0.3,
        }]);
      }

      // Move words down
      setFallingWords(prev => {
        const updated = prev.map(w => ({ ...w, y: w.y + w.speed * (dt / 16) }));
        const missed = updated.filter(w => w.y > 500);
        if (missed.length > 0) {
          setWrong(w => w + missed.length);
          setCombo(0);
        }
        return updated.filter(w => w.y <= 500);
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [mode, gameActive, lang, difficulty]);

  // Check falling word input
  const handleFallingInput = (val: string) => {
    setInput(val);
    const match = fallingWords.find(w => w.text.toLowerCase() === val.trim().toLowerCase());
    if (match) {
      setFallingWords(prev => prev.filter(w => w.id !== match.id));
      setCorrect(c => c + 1);
      setCombo(c => { const n = c + 1; setMaxCombo(m => Math.max(m, n)); return n; });
      setScore(s => s + match.text.length * 10 + combo * 5);
      setInput("");
    }
  };

  // Time attack input
  const handleTimeAttackInput = (val: string) => {
    setInput(val);
    if (composingRef.current) return;
    const pool = lang === "en"
      ? ENGLISH_WORDS[difficulty]
      : CHINESE_PHRASES[difficulty].map(p => p.text);

    const target = pool[correct % pool.length];
    if (val.trim().toLowerCase() === target.toLowerCase()) {
      setCorrect(c => c + 1);
      setCombo(c => { const n = c + 1; setMaxCombo(m => Math.max(m, n)); return n; });
      setScore(s => s + target.length * 10 + combo * 5);
      setInput("");
    }
  };

  // Sentence input
  const handleSentenceInput = (val: string) => {
    setSentInput(val);
    if (composingRef.current) return;
    const target = lang === "en" ? sentences[sentIdx] : zhPhrases[zhIdx]?.text;
    if (!target) return;

    if (val === target) {
      setSentCorrectChars(c => c + target.length);
      setSentTotalChars(c => c + target.length);
      setCorrect(c => c + 1);
      setScore(s => s + target.length * 5);
      setSentInput("");
      if (lang === "en") {
        if (sentIdx + 1 >= sentences.length) { setGameActive(false); setMode("result"); }
        else setSentIdx(i => i + 1);
      } else {
        if (zhIdx + 1 >= zhPhrases.length) { setGameActive(false); setMode("result"); }
        else setZhIdx(i => i + 1);
      }
    }
  };

  // Speed test input
  const handleSpeedInput = (val: string) => {
    setSpeedInput(val);
    if (composingRef.current) return;
    if (!speedStarted) { setSpeedStarted(true); setStartTime(Date.now()); }

    if (val.length >= speedText.length) {
      let correctChars = 0;
      for (let i = 0; i < speedText.length; i++) {
        if (val[i] === speedText[i]) correctChars++;
      }
      setSentCorrectChars(correctChars);
      setSentTotalChars(speedText.length);
      setGameActive(false);
      setMode("result");
    }
  };

  const getWPM = () => {
    const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
    if (elapsed < 0.01) return 0;
    if (mode === "speed-test") {
      const words = speedInput.trim().split(/\s+/).length;
      return Math.round(words / elapsed);
    }
    return Math.round(correct / Math.max(elapsed, 0.01));
  };

  const getAccuracy = () => {
    if (mode === "speed-test" && sentTotalChars > 0) {
      return Math.round((sentCorrectChars / sentTotalChars) * 100);
    }
    const total = correct + wrong;
    return total > 0 ? Math.round((correct / total) * 100) : 100;
  };

  // ─── MENU ───
  if (mode === "menu") return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">⌨️</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">打字練習</h1>
        <p className="text-slate-500">中英雙語打字訓練，提升打字速度與準確率</p>
      </div>

      {/* Language & Difficulty */}
      <div className="flex justify-center gap-3 mb-4">
        <button onClick={() => setLang("en")}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition cursor-pointer ${
            lang === "en" ? "text-rose-400 border-rose-300" : "bg-white border-slate-200 text-slate-600"
          }`}>🔤 English</button>
        <button onClick={() => setLang("zh")}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition cursor-pointer ${
            lang === "zh" ? "bg-red-500 text-white border-red-500" : "bg-white border-slate-200 text-slate-600"
          }`}>ㄅ 中文</button>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        {(["easy", "medium", "hard"] as Difficulty[]).map(d => (
          <button key={d} onClick={() => setDifficulty(d)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
              difficulty === d ? "bg-emerald-500 text-white border-emerald-500" : "bg-white border-slate-200 text-slate-500"
            }`}>
            {d === "easy" ? "初級" : d === "medium" ? "中級" : "高級"}
          </button>
        ))}
      </div>

      {/* Game modes */}
      <div className="grid sm:grid-cols-2 gap-3">
        {MODES.map(m => (
          <button key={m.id} onClick={() => startGame(m.id)}
            className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md text-left cursor-pointer transition active:scale-[0.98]">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl flex-shrink-0">{m.icon}</div>
            <div className="flex-1">
              <div className="font-bold text-slate-800 text-base">{m.title}</div>
              <div className="text-sm text-slate-400 mt-0.5">{m.desc}</div>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-600">{m.skill}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <a href="/" className="text-sm text-slate-400 hover:text-blue-500 transition no-underline">← 回到首頁</a>
      </div>
    </div>
  );

  // ─── RESULT ───
  if (mode === "result") {
    const wpm = getWPM();
    const acc = getAccuracy();
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
          <div className="text-5xl mb-4">{acc >= 90 ? "🏆" : acc >= 70 ? "⭐" : "💪"}</div>
          <h2 className="text-2xl font-black text-slate-800 mb-6">
            {acc >= 90 ? "太厲害了！" : acc >= 70 ? "做得好！" : "繼續加油！"}
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-blue-50">
              <div className="text-3xl font-black text-blue-600">{score}</div>
              <div className="text-xs text-blue-400 mt-1">總分</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50">
              <div className="text-3xl font-black text-emerald-600">{acc}%</div>
              <div className="text-xs text-emerald-400 mt-1">正確率</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50">
              <div className="text-3xl font-black text-amber-600">{wpm}</div>
              <div className="text-xs text-amber-400 mt-1">WPM</div>
            </div>
            <div className="p-4 rounded-xl bg-red-50">
              <div className="text-3xl font-black text-red-500">{maxCombo}</div>
              <div className="text-xs text-red-400 mt-1">最高連擊</div>
            </div>
          </div>

          <div className="text-xs text-slate-500 mb-2 mt-4">分享你的成績：</div>
          <ShareButtons
            text={`我的打字速度是 ${wpm} WPM，正確率 ${acc}%！你能打得比我快嗎？⌨️`}
            url="/typing-game"
          />

          <div className="flex gap-2 justify-center mt-4">
            <button onClick={() => setMode("menu")}
              className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-semibold cursor-pointer border-none transition hover:bg-slate-200">
              選單
            </button>
            <button onClick={() => startGame(mode)}
              className="px-6 py-3 rounded-xl bg-rose-300 text-white font-semibold cursor-pointer border-none transition hover:bg-rose-400">
              再來一次
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── GAME SCREENS ───
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* HUD */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => { resetGame(); setMode("menu"); }}
          className="text-sm text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none">← 選單</button>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-600 text-sm font-bold">⭐ {score}</span>
          {combo > 1 && <span className="px-3 py-1 rounded-full bg-red-50 border border-red-300 text-red-500 text-sm font-bold animate-pulse">🔥 x{combo}</span>}
          {(mode === "time-attack" || mode === "falling") && (
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${timeLeft <= 10 ? "bg-red-50 border-red-300 text-red-500 animate-pulse" : "bg-blue-50 border-blue-300 text-blue-600"} border`}>
              ⏱️ {timeLeft}s
            </span>
          )}
        </div>
      </div>

      {/* FALLING WORDS */}
      {mode === "falling" && (
        <>
          <div className="relative bg-slate-900 rounded-2xl overflow-hidden mb-4" style={{ height: 500 }}>
            {fallingWords.map(w => (
              <div key={w.id}
                className="absolute text-white font-bold text-lg px-3 py-1 rounded-lg whitespace-nowrap transition-none"
                style={{
                  left: `${w.x}%`,
                  top: `${w.y}px`,
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                }}>
                {w.text}
              </div>
            ))}
            {/* Ground line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 opacity-50" />
          </div>
          <input
            ref={inputRef}
            value={input}
            onChange={e => handleFallingInput(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-slate-200 text-lg font-mono text-center outline-none focus:border-blue-500 transition"
            placeholder={lang === "en" ? "Type the falling word..." : "輸入落下的文字..."}
            autoFocus
          />
        </>
      )}

      {/* TIME ATTACK */}
      {mode === "time-attack" && (
        <>
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center mb-4">
            <div className="text-sm text-slate-400 mb-2">輸入這個{lang === "en" ? "單字" : "詞"}：</div>
            <div className="text-4xl font-black text-slate-800 mb-2">
              {lang === "en"
                ? ENGLISH_WORDS[difficulty][correct % ENGLISH_WORDS[difficulty].length]
                : CHINESE_PHRASES[difficulty][correct % CHINESE_PHRASES[difficulty].length]?.text
              }
            </div>
            {lang === "zh" && (
              <div className="text-sm text-slate-400">
                {CHINESE_PHRASES[difficulty][correct % CHINESE_PHRASES[difficulty].length]?.zhuyin}
              </div>
            )}
            <div className="mt-3 text-sm text-emerald-500 font-semibold">已完成 {correct} 個</div>
          </div>
          <input
            ref={inputRef}
            value={input}
            onChange={e => handleTimeAttackInput(e.target.value)}
            onCompositionStart={() => { composingRef.current = true; }}
            onCompositionEnd={e => { composingRef.current = false; handleTimeAttackInput((e.target as HTMLInputElement).value); }}
            className="w-full p-4 rounded-xl border-2 border-slate-200 text-lg font-mono text-center outline-none focus:border-blue-500 transition"
            placeholder={lang === "en" ? "Type here..." : "在此輸入..."}
            autoFocus
          />
        </>
      )}

      {/* SENTENCE MODE */}
      {mode === "sentence" && (
        <>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-4">
            <div className="flex justify-between mb-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
                {(lang === "en" ? sentIdx : zhIdx) + 1} / {lang === "en" ? sentences.length : zhPhrases.length}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">✓ {correct}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mb-4 font-mono text-lg leading-8">
              {(lang === "en" ? sentences[sentIdx] : zhPhrases[zhIdx]?.text || "").split("").map((ch, i) => {
                const typed = sentInput[i];
                let color = "text-slate-400";
                if (typed === ch) color = "text-emerald-600";
                else if (typed !== undefined) color = "text-red-500 underline";
                return <span key={i} className={`${color} ${i === sentInput.length ? "border-l-2 border-blue-500" : ""}`}>{ch}</span>;
              })}
            </div>

            {lang === "zh" && zhPhrases[zhIdx] && (
              <div className="text-sm text-slate-400 text-center mb-2">{zhPhrases[zhIdx].zhuyin}</div>
            )}
          </div>
          <input
            ref={inputRef}
            value={sentInput}
            onChange={e => handleSentenceInput(e.target.value)}
            onCompositionStart={() => { composingRef.current = true; }}
            onCompositionEnd={e => { composingRef.current = false; handleSentenceInput((e.target as HTMLInputElement).value); }}
            className="w-full p-4 rounded-xl border-2 border-slate-200 text-lg font-mono outline-none focus:border-blue-500 transition"
            placeholder={lang === "en" ? "Type the sentence..." : "輸入上方句子..."}
            autoFocus
          />
        </>
      )}

      {/* SPEED TEST */}
      {mode === "speed-test" && (
        <>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-4">
            <div className="text-sm text-slate-400 mb-3">
              {speedStarted ? `WPM: ${getWPM()} · 正確率: ${speedInput.length > 0 ? Math.round(speedInput.split("").filter((c, i) => c === speedText[i]).length / speedInput.length * 100) : 100}%` : "開始打字即計時"}
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 font-mono text-base leading-8">
              {speedText.split("").map((ch, i) => {
                const typed = speedInput[i];
                let color = "text-slate-400";
                if (typed === ch) color = "text-emerald-600";
                else if (typed !== undefined) color = "text-red-500 bg-red-50";
                return <span key={i} className={`${color} ${i === speedInput.length ? "border-l-2 border-blue-500" : ""}`}>{ch}</span>;
              })}
            </div>
          </div>
          <textarea
            ref={inputRef as unknown as React.RefObject<HTMLTextAreaElement>}
            value={speedInput}
            onChange={e => handleSpeedInput(e.target.value)}
            onCompositionStart={() => { composingRef.current = true; }}
            onCompositionEnd={e => { composingRef.current = false; handleSpeedInput((e.target as HTMLTextAreaElement).value); }}
            className="w-full p-4 rounded-xl border-2 border-slate-200 text-base font-mono outline-none focus:border-blue-500 transition resize-none"
            rows={4}
            placeholder={lang === "en" ? "Start typing to begin..." : "開始打字即計時..."}
            autoFocus
          />
        </>
      )}
    </div>
  );
}
