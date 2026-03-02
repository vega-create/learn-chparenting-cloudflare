"use client";
import { useState, useCallback } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen } from "@/lib/game-utils";
import { useTimer } from "@/lib/game-utils";

/* ─── Sequence Generators ─── */
type SeqType = "arithmetic" | "geometric" | "fibonacci" | "squares" | "cubes" | "triangular" | "power2" | "alternating";

interface Question {
  sequence: number[];
  answer: number;
  hint: string;
  type: SeqType;
}

function genArithmetic(difficulty: number): Question {
  const start = Math.floor(Math.random() * 10) + 1;
  const diff = (Math.floor(Math.random() * 5) + 1) * (difficulty > 5 ? (Math.random() > 0.5 ? -1 : 1) : 1);
  const len = 5;
  const seq = Array.from({ length: len + 1 }, (_, i) => start + diff * i);
  const answer = seq.pop()!;
  return { sequence: seq, answer, hint: `每次 ${diff > 0 ? "+" : ""}${diff}`, type: "arithmetic" };
}

function genGeometric(difficulty: number): Question {
  const start = Math.floor(Math.random() * 3) + 1;
  const ratio = difficulty > 5 ? (Math.random() > 0.5 ? 3 : -2) : 2;
  const len = 5;
  const seq = Array.from({ length: len + 1 }, (_, i) => start * Math.pow(ratio, i));
  const answer = seq.pop()!;
  return { sequence: seq, answer, hint: `每次 ×${ratio}`, type: "geometric" };
}

function genFibonacci(): Question {
  const a = Math.floor(Math.random() * 5) + 1;
  const b = Math.floor(Math.random() * 5) + 1;
  const seq = [a, b];
  for (let i = 2; i <= 5; i++) seq.push(seq[i - 1] + seq[i - 2]);
  const answer = seq.pop()!;
  return { sequence: seq, answer, hint: "前兩數之和", type: "fibonacci" };
}

function genSquares(): Question {
  const start = Math.floor(Math.random() * 3) + 1;
  const seq = Array.from({ length: 6 }, (_, i) => (start + i) * (start + i));
  const answer = seq.pop()!;
  return { sequence: seq, answer, hint: "平方數列", type: "squares" };
}

function genCubes(): Question {
  const start = Math.floor(Math.random() * 2) + 1;
  const seq = Array.from({ length: 6 }, (_, i) => Math.pow(start + i, 3));
  const answer = seq.pop()!;
  return { sequence: seq, answer, hint: "立方數列", type: "cubes" };
}

function genTriangular(): Question {
  const seq = Array.from({ length: 6 }, (_, i) => ((i + 1) * (i + 2)) / 2);
  const answer = seq.pop()!;
  return { sequence: seq, answer, hint: "三角數", type: "triangular" };
}

function genPower2(): Question {
  const seq = Array.from({ length: 6 }, (_, i) => Math.pow(2, i + 1));
  const answer = seq.pop()!;
  return { sequence: seq, answer, hint: "2 的次方", type: "power2" };
}

function genAlternating(): Question {
  const a = Math.floor(Math.random() * 5) + 1;
  const d1 = Math.floor(Math.random() * 3) + 1;
  const d2 = Math.floor(Math.random() * 3) + 2;
  const seq = [a];
  for (let i = 1; i <= 5; i++) seq.push(seq[i - 1] + (i % 2 === 1 ? d1 : d2));
  const answer = seq.pop()!;
  return { sequence: seq, answer, hint: `交替 +${d1} / +${d2}`, type: "alternating" };
}

function generateQuestion(round: number): Question {
  const difficulty = round + 1;
  if (difficulty <= 2) return genArithmetic(difficulty);
  if (difficulty <= 4) {
    const gen = [genArithmetic, genGeometric, genFibonacci];
    return gen[Math.floor(Math.random() * gen.length)](difficulty);
  }
  if (difficulty <= 7) {
    const gen = [genArithmetic, genGeometric, genFibonacci, genSquares, genAlternating];
    return gen[Math.floor(Math.random() * gen.length)](difficulty);
  }
  const gen = [genGeometric, genFibonacci, genSquares, genCubes, genTriangular, genPower2, genAlternating];
  return gen[Math.floor(Math.random() * gen.length)](difficulty);
}

const TOTAL_ROUNDS = 10;

export default function SequenceQuestPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const { highScore, updateHighScore } = useHighScore("sequence-quest");
  const { fmt: timerFmt, reset: resetTimer } = useTimer(mode === "playing");

  const startGame = useCallback(() => {
    setRound(0);
    setScore(0);
    setFeedback(null);
    setInput("");
    setShowHint(false);
    setQuestion(generateQuestion(0));
    setMode("playing");
    resetTimer();
    setIsNewHigh(false);
  }, [resetTimer]);

  const nextRound = useCallback(() => {
    if (round + 1 >= TOTAL_ROUNDS) {
      const newHigh = updateHighScore(score);
      setIsNewHigh(newHigh);
      if (score === TOTAL_ROUNDS * 10) playPerfect();
      else if (score >= TOTAL_ROUNDS * 6) playVictory();
      setMode("done");
      return;
    }
    const nextR = round + 1;
    setRound(nextR);
    setQuestion(generateQuestion(nextR));
    setFeedback(null);
    setInput("");
    setShowHint(false);
  }, [round, score, updateHighScore]);

  const handleSubmit = useCallback(() => {
    if (!question || feedback) return;
    const userAnswer = Number(input.trim());
    if (isNaN(userAnswer)) return;

    if (userAnswer === question.answer) {
      const points = showHint ? 5 : 10;
      setScore(s => s + points);
      setFeedback("correct");
      playCorrect();
    } else {
      setFeedback("wrong");
      playWrong();
    }
    setTimeout(nextRound, 1200);
  }, [question, input, feedback, showHint, nextRound]);

  const handleSkip = useCallback(() => {
    if (!question || feedback) return;
    setFeedback("wrong");
    setTimeout(nextRound, 1200);
  }, [question, feedback, nextRound]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-purple-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">🔍</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">數列探險</h1>
          <p className="text-slate-500 text-sm">找出數列的規律，推算下一個數字</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>共 {TOTAL_ROUNDS} 題，難度逐漸提升</li>
            <li>觀察數列規律，填入下一個數字</li>
            <li>每題答對得 10 分（用提示得 5 分）</li>
            <li>包含：等差、等比、費式、平方……</li>
            <li>最高紀錄：{highScore} 分</li>
          </ul>
        </div>
        <button onClick={startGame}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-lg cursor-pointer border-none hover:opacity-90 transition">
          🚀 開始挑戰
        </button>
      </div>
    );
  }

  /* ─── Done ─── */
  if (mode === "done") {
    const maxScore = TOTAL_ROUNDS * 10;
    const stars = getStars(score, maxScore);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-purple-500 hover:underline no-underline">← 返回桌遊專區</a>
        <GameOverScreen
          score={score} maxScore={maxScore} gameName="數列探險" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={startGame} onBack={() => setMode("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "sequence-quest", activityName: "數列探險" }}
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

      {/* Sequence Display */}
      {question && (
        <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-sm mb-6">
          <div className="text-center mb-4">
            <div className="text-xs text-slate-400 mb-2">找出規律，填入 ? 的數字</div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {question.sequence.map((n, i) => (
                <span key={i} className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-purple-100 text-purple-700 font-black text-lg border border-purple-200">
                  {n}
                </span>
              ))}
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-100 text-amber-600 font-black text-xl border-2 border-dashed border-amber-400">
                {feedback === "correct" ? question.answer : feedback === "wrong" ? question.answer : "?"}
              </span>
            </div>
          </div>

          {/* Hint & Skip */}
          {!feedback && (
            <div className="text-center space-y-2">
              {showHint ? (
                <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg inline-block">
                  💡 提示：{question.hint}
                </div>
              ) : (
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
          )}
        </div>
      )}

      {/* Input */}
      {!feedback && (
        <div className="flex gap-3 justify-center mb-4">
          <input
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="輸入答案"
            className="w-32 px-4 py-3 rounded-xl border-2 border-purple-200 text-center text-lg font-bold focus:outline-none focus:border-purple-500"
            autoFocus
          />
          <button onClick={handleSubmit}
            className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold cursor-pointer border-none hover:bg-purple-700 transition">
            確定
          </button>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className={`text-center text-lg font-bold ${feedback === "correct" ? "text-green-500" : "text-red-500"}`}>
          {feedback === "correct" ? "✅ 答對了！" : `❌ 正確答案是 ${question?.answer}`}
        </div>
      )}
    </div>
  );
}
