"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen, GamePage, BackToGames, GameIntro, GAME_UI } from "@/lib/game-utils";

/* ─── Types ─── */
const COLORS = [
  { name: "紅", bg: "bg-red-500", active: "bg-red-300", light: "bg-red-100", freq: 261 },
  { name: "藍", bg: "bg-blue-500", active: "bg-blue-300", light: "bg-blue-100", freq: 329 },
  { name: "綠", bg: "bg-green-500", active: "bg-green-300", light: "bg-green-100", freq: 392 },
  { name: "黃", bg: "bg-yellow-400", active: "bg-yellow-200", light: "bg-yellow-100", freq: 523 },
];

type Phase = "menu" | "showing" | "input" | "done";

function playTone(freq: number) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.3);
  } catch {}
}

export default function MemorySequencePage() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activePanel, setActivePanel] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [bestRound, setBestRound] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { highScore, updateHighScore } = useHighScore("memory-sequence");
  const showingRef = useRef(false);

  const startGame = useCallback(() => {
    setSequence([]);
    setPlayerInput([]);
    setRound(0);
    setScore(0);
    setBestRound(0);
    setActivePanel(null);
    setFeedback(null);
    setIsNewHigh(false);
    // Start first round
    nextSequence([]);
  }, []);

  const nextSequence = useCallback((prevSeq: number[]) => {
    const nextColor = Math.floor(Math.random() * 4);
    const newSeq = [...prevSeq, nextColor];
    setSequence(newSeq);
    setPlayerInput([]);
    setPhase("showing");
    showingRef.current = true;

    // Show sequence with delays
    newSeq.forEach((colorIdx, i) => {
      setTimeout(() => {
        setActivePanel(colorIdx);
        playTone(COLORS[colorIdx].freq);
      }, (i + 1) * 600);
      setTimeout(() => {
        setActivePanel(null);
      }, (i + 1) * 600 + 400);
    });

    // After showing, switch to input
    setTimeout(() => {
      setPhase("input");
      showingRef.current = false;
    }, (newSeq.length + 1) * 600 + 200);
  }, []);

  const handlePanelPress = useCallback((colorIdx: number) => {
    if (phase !== "input") return;

    playTone(COLORS[colorIdx].freq);
    setActivePanel(colorIdx);
    setTimeout(() => setActivePanel(null), 200);

    const newInput = [...playerInput, colorIdx];
    setPlayerInput(newInput);
    const step = newInput.length - 1;

    if (newInput[step] !== sequence[step]) {
      // Wrong!
      playWrong();
      const finalScore = round * 10;
      setScore(finalScore);
      setBestRound(round);
      const newHigh = updateHighScore(finalScore);
      setIsNewHigh(newHigh);
      if (round >= 10) playVictory();
      setFeedback(`記住了 ${round} 個！`);
      setPhase("done");
      return;
    }

    if (newInput.length === sequence.length) {
      // Completed this round
      playCorrect();
      const newRound = round + 1;
      setRound(newRound);
      setBestRound(newRound);
      setFeedback(`✅ 第 ${newRound} 輪成功！`);
      // 馬上鎖住輸入。原本這一秒內還能按，多按一下會被當成答錯，
      // 接著下一輪又照常開始，結束畫面閃一下就不見。
      setPhase("showing");
      setTimeout(() => {
        setFeedback(null);
        nextSequence(sequence);
      }, 1000);
    }
  }, [phase, playerInput, sequence, round, updateHighScore, nextSequence]);

  /* ─── Menu ─── */
  if (phase === "menu") {
    return (
      <GamePage>
        <BackToGames />
        <GameIntro gameId="memory-sequence" title="記憶旋律" desc="記住燈光順序，挑戰你的記憶極限" />
        <div className={`${GAME_UI.rules} mb-5`}>
          <h3 className={GAME_UI.rulesTitle}>遊戲規則</h3>
          <ul className={GAME_UI.rulesList}>
            <li>觀察燈光閃爍的順序</li>
            <li>按照相同順序點擊面板</li>
            <li>每輪增加一個新燈光</li>
            <li>記錯即結束，看你能撐幾輪</li>
            <li>最高紀錄：{highScore} 分</li>
          </ul>
        </div>
        <button onClick={startGame}
          className={`w-full py-4 px-6 text-lg ${GAME_UI.primaryBtn}`}>
          開始挑戰 →
        </button>
      </GamePage>
    );
  }

  /* ─── Done ─── */
  if (phase === "done") {
    const maxScore = 100; // 記住 9 個以上就是三顆星；原本要 14 個，國小孩子幾乎拿不到
    const stars = getStars(score, maxScore);
    return (
      <GamePage>
        <BackToGames />
        <div className="text-center text-sm text-[#52616B] mt-4 mb-2">連續記住了 {bestRound} 個</div>
        <GameOverScreen
          score={score} maxScore={maxScore} gameName="記憶旋律" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={startGame} onBack={() => setPhase("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "memory-sequence", activityName: "記憶旋律" }}
        />
      </GamePage>
    );
  }

  /* ─── Playing (showing / input) ─── */
  const isShowing = phase === "showing";

  return (
    <GamePage>
      <BackToGames />
      <h1 className="text-xl font-black text-[#263238] mt-2 mb-3">記憶旋律</h1>

      {/* Header */}
      <div className="flex flex-wrap gap-2 mb-5">
        <div className={GAME_UI.chip}>回合 <b>第 {round + 1} 輪</b></div>
        <div className={GAME_UI.chip}>序列長度 <b className="text-[#2457A7]">{sequence.length}</b></div>
      </div>

      {/* Status */}
      <div className="text-center mb-6 bg-white rounded-2xl border border-slate-200 py-3">
        {isShowing ? (
          <div className="text-lg font-bold text-amber-500 animate-pulse">👀 注意觀察！</div>
        ) : (
          <div className="text-lg font-bold text-green-500">🎮 輪到你了！({playerInput.length}/{sequence.length})</div>
        )}
      </div>

      {/* Panels */}
      <div className="grid grid-cols-2 gap-4 max-w-[280px] mx-auto mb-6">
        {COLORS.map((color, i) => (
          <button key={i}
            onClick={() => handlePanelPress(i)}
            disabled={isShowing}
            className={`aspect-square rounded-2xl cursor-pointer border-none transition-all duration-200 transform
              ${activePanel === i
                ? `${color.active} scale-105 shadow-lg`
                : `${color.bg} ${!isShowing ? "hover:scale-102 active:scale-95" : "opacity-70"}`
              }
            `}
            style={{ minHeight: 120 }}
          >
            <span className="text-white/60 text-sm font-bold">{color.name}</span>
          </button>
        ))}
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 flex-wrap mb-4">
        {sequence.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all
            ${i < playerInput.length
              ? "bg-green-400 scale-110"
              : isShowing && activePanel !== null
                ? "bg-slate-200"
                : "bg-slate-200"
            }`} />
        ))}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="text-center text-sm font-bold text-green-500">{feedback}</div>
      )}
    </GamePage>
  );
}
