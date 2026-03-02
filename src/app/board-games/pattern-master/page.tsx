"use client";
import { useState, useCallback } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen, shuffle } from "@/lib/game-utils";
import { useTimer } from "@/lib/game-utils";

/* ─── Pattern Data ─── */
type Difficulty = "easy" | "medium" | "hard";

const EMOJI_SETS: Record<Difficulty, string[][]> = {
  easy: [
    ["🔴", "🔵", "🟢", "🟡"],
    ["🍎", "🍊", "🍋", "🍇"],
    ["⭐", "🌙", "☀️", "💫"],
    ["❤️", "💙", "💚", "💛"],
  ],
  medium: [
    ["🐶", "🐱", "🐰", "🐻", "🦊"],
    ["🌸", "🌺", "🌻", "🌹", "🌷"],
    ["🎈", "🎀", "🎁", "🎊", "🎉"],
    ["🚗", "🚕", "🚙", "🚌", "🚎"],
  ],
  hard: [
    ["♠️", "♥️", "♦️", "♣️", "🃏", "👑"],
    ["🔺", "🔻", "🔸", "🔹", "💠", "🔶"],
    ["🌍", "🌎", "🌏", "🌕", "🌖", "🌗"],
    ["🎵", "🎶", "🎼", "🎹", "🎸", "🎺"],
  ],
};

function generatePattern(diff: Difficulty): { grid: string[]; missing: number; answer: string; choices: string[] } {
  const sets = EMOJI_SETS[diff];
  const emojiSet = sets[Math.floor(Math.random() * sets.length)];
  const grid: string[] = [];

  if (diff === "easy") {
    // Simple repeating pattern: ABAB or ABCABC
    const patLen = Math.random() > 0.5 ? 2 : 3;
    const pat = shuffle(emojiSet).slice(0, patLen);
    for (let i = 0; i < 9; i++) grid.push(pat[i % patLen]);
  } else if (diff === "medium") {
    // Row-based pattern: each row has a pattern
    const pat = shuffle(emojiSet).slice(0, 3);
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        grid.push(pat[(row + col) % 3]);
      }
    }
  } else {
    // Diagonal / complex pattern
    const pat = shuffle(emojiSet).slice(0, 4);
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        grid.push(pat[(row * 3 + col) % 4]);
      }
    }
  }

  const missing = Math.floor(Math.random() * 9);
  const answer = grid[missing];

  // Generate wrong choices
  const wrongs = shuffle(emojiSet.filter(e => e !== answer)).slice(0, 3);
  const choices = shuffle([answer, ...wrongs]);

  return { grid, missing, answer, choices };
}

const TOTAL_ROUNDS = 10;
const DIFF_OPTIONS: { key: Difficulty; label: string; desc: string }[] = [
  { key: "easy", label: "初級", desc: "簡單色彩重複" },
  { key: "medium", label: "中級", desc: "行列交替規律" },
  { key: "hard", label: "高級", desc: "複雜多維規律" },
];

export default function PatternMasterPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [diff, setDiff] = useState<Difficulty>("easy");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [pattern, setPattern] = useState<ReturnType<typeof generatePattern> | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const { highScore, updateHighScore } = useHighScore("pattern-master");
  const { fmt: timerFmt, reset: resetTimer } = useTimer(mode === "playing");
  const [isNewHigh, setIsNewHigh] = useState(false);

  const startGame = useCallback((d: Difficulty) => {
    setDiff(d);
    setRound(0);
    setScore(0);
    setFeedback(null);
    setShowHint(false);
    setPattern(generatePattern(d));
    setMode("playing");
    resetTimer();
    setIsNewHigh(false);
  }, [resetTimer]);

  const nextRound = useCallback(() => {
    if (round + 1 >= TOTAL_ROUNDS) {
      const finalScore = score;
      const newHigh = updateHighScore(finalScore);
      setIsNewHigh(newHigh);
      if (finalScore === TOTAL_ROUNDS * 10) playPerfect();
      else if (finalScore >= TOTAL_ROUNDS * 6) playVictory();
      setMode("done");
      return;
    }
    setRound(r => r + 1);
    setPattern(generatePattern(diff));
    setFeedback(null);
    setShowHint(false);
  }, [round, score, diff, updateHighScore]);

  const handleChoice = useCallback((choice: string) => {
    if (feedback) return;
    if (!pattern) return;
    if (choice === pattern.answer) {
      const points = showHint ? 5 : 10;
      setScore(s => s + points);
      setFeedback("correct");
      playCorrect();
    } else {
      setFeedback("wrong");
      playWrong();
    }
    setTimeout(nextRound, 800);
  }, [feedback, pattern, showHint, nextRound]);

  const handleSkip = useCallback(() => {
    if (feedback || !pattern) return;
    setFeedback("wrong");
    setTimeout(nextRound, 1200);
  }, [feedback, pattern, nextRound]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-purple-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">🧩</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">圖案大師</h1>
          <p className="text-slate-500 text-sm">觀察 3x3 圖案，找出缺失的那一個</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>每局 {TOTAL_ROUNDS} 題</li>
            <li>找出 3x3 格中缺少的圖案</li>
            <li>每題答對得 10 分</li>
            <li>最高紀錄：{highScore} 分</li>
          </ul>
        </div>
        <div className="space-y-3">
          {DIFF_OPTIONS.map(d => (
            <button key={d.key} onClick={() => startGame(d.key)}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-left cursor-pointer border-none hover:opacity-90 transition">
              <div className="text-lg">{d.label}</div>
              <div className="text-xs opacity-80">{d.desc}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ─── Game Over ─── */
  if (mode === "done") {
    const maxScore = TOTAL_ROUNDS * 10;
    const stars = getStars(score, maxScore);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-purple-500 hover:underline no-underline">← 返回桌遊專區</a>
        <GameOverScreen
          score={score} maxScore={maxScore} gameName="圖案大師" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={() => startGame(diff)} onBack={() => setMode("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "pattern-master", activityName: "圖案大師" }}
        />
      </div>
    );
  }

  /* ─── Playing ─── */
  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
      <a href="/board-games" className="text-sm text-purple-500 hover:underline no-underline">← 返回桌遊專區</a>

      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-6">
        <div className="text-sm text-slate-500">第 {round + 1}/{TOTAL_ROUNDS} 題</div>
        <div className="text-sm font-mono text-slate-500">{timerFmt}</div>
        <div className="text-sm font-bold text-purple-600">{score} 分</div>
      </div>

      {/* Grid */}
      {pattern && (
        <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-sm mb-6">
          <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
            {pattern.grid.map((emoji, i) => (
              <div key={i} className={`w-[72px] h-[72px] flex items-center justify-center rounded-xl text-3xl
                ${i === pattern.missing
                  ? feedback === "correct"
                    ? "bg-green-100 border-2 border-green-400"
                    : feedback === "wrong"
                      ? "bg-red-100 border-2 border-red-400"
                      : "bg-purple-100 border-2 border-dashed border-purple-400"
                  : "bg-slate-50 border border-slate-200"
                }`}>
                {i === pattern.missing
                  ? feedback
                    ? feedback === "correct" ? pattern.answer : "❌"
                    : "❓"
                  : emoji}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Choices */}
      {pattern && !feedback && (
        <>
          <div className="grid grid-cols-2 gap-3 max-w-[280px] mx-auto">
            {pattern.choices.map((c, i) => {
              // When hint is active, hide 2 wrong choices
              if (showHint && c !== pattern.answer) {
                const wrongChoices = pattern.choices.filter(ch => ch !== pattern.answer);
                const hiddenTwo = wrongChoices.slice(0, 2);
                if (hiddenTwo.includes(c)) {
                  return <div key={i} className="py-4 rounded-xl bg-slate-100 border-2 border-slate-200 text-3xl opacity-30 text-center">✕</div>;
                }
              }
              return (
                <button key={i} onClick={() => handleChoice(c)}
                  className="py-4 rounded-xl bg-white border-2 border-purple-200 text-3xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition">
                  {c}
                </button>
              );
            })}
          </div>
          <div className="text-center mt-4 space-y-2">
            {!showHint && (
              <button onClick={() => setShowHint(true)}
                className="text-xs text-slate-400 hover:text-amber-500 cursor-pointer border-none bg-transparent underline">
                需要提示？（使用提示得分減半）
              </button>
            )}
            <div>
              <button onClick={handleSkip}
                className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent underline">
                跳過此題（不得分）
              </button>
            </div>
          </div>
        </>
      )}

      {/* Feedback */}
      {feedback && (
        <div className={`text-center text-lg font-bold mt-4 ${feedback === "correct" ? "text-green-500" : "text-red-500"}`}>
          {feedback === "correct" ? "✅ 答對了！" : `❌ 答案是 ${pattern?.answer}`}
        </div>
      )}
    </div>
  );
}
