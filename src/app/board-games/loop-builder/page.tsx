"use client";
import { useState, useCallback, useEffect } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen } from "@/lib/game-utils";

/* ─── Types ─── */
type Direction = 0 | 1 | 2 | 3; // 0=up, 1=right, 2=down, 3=left
const DIR_NAMES = ["上", "右", "下", "左"];

interface TurtleState {
  x: number;
  y: number;
  dir: Direction;
}

interface Level {
  name: string;
  targetPath: [number, number][];
  hint: string;
  solution: { repeat: number; forward: number; turn: "left" | "right" };
}

function generatePath(startX: number, startY: number, startDir: Direction, repeat: number, forward: number, turn: "left" | "right"): [number, number][] {
  const path: [number, number][] = [[startX, startY]];
  let x = startX, y = startY, dir = startDir;
  const dx = [0, 1, 0, -1];
  const dy = [-1, 0, 1, 0];

  for (let r = 0; r < repeat; r++) {
    for (let f = 0; f < forward; f++) {
      x += dx[dir];
      y += dy[dir];
      path.push([x, y]);
    }
    dir = turn === "right" ? ((dir + 1) % 4) as Direction : ((dir + 3) % 4) as Direction;
  }
  return path;
}

const LEVELS: Level[] = [
  { name: "直線", hint: "重複 1 次，前進 4 步", targetPath: generatePath(1, 5, 1, 1, 4, "right"), solution: { repeat: 1, forward: 4, turn: "right" } },
  { name: "L 形", hint: "重複 1 次前進再轉彎", targetPath: generatePath(1, 5, 1, 2, 3, "left"), solution: { repeat: 2, forward: 3, turn: "left" } },
  { name: "正方形", hint: "重複 4 次：前進 + 右轉", targetPath: generatePath(2, 6, 0, 4, 3, "right"), solution: { repeat: 4, forward: 3, turn: "right" } },
  { name: "三角形", hint: "重複 3 次，每次轉更多", targetPath: generatePath(1, 7, 1, 3, 3, "right"), solution: { repeat: 3, forward: 3, turn: "right" } },
  { name: "長方形", hint: "交替不同長度", targetPath: generatePath(1, 6, 1, 4, 4, "right"), solution: { repeat: 4, forward: 4, turn: "right" } },
  { name: "Z 字形", hint: "重複 3 次：前進 + 左轉", targetPath: generatePath(1, 2, 1, 3, 3, "left"), solution: { repeat: 3, forward: 3, turn: "left" } },
  { name: "大正方形", hint: "每邊 5 步的正方形", targetPath: generatePath(1, 7, 1, 4, 5, "right"), solution: { repeat: 4, forward: 5, turn: "right" } },
  { name: "螺旋線", hint: "重複 6 次，前進 2 步", targetPath: generatePath(3, 5, 0, 6, 2, "right"), solution: { repeat: 6, forward: 2, turn: "right" } },
];

const GRID_SIZE = 10;
const TOTAL_LEVELS = LEVELS.length;

export default function LoopBuilderPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "running" | "done">("menu");
  const [level, setLevel] = useState(0);
  const [repeatCount, setRepeatCount] = useState(1);
  const [forwardSteps, setForwardSteps] = useState(1);
  const [turnDir, setTurnDir] = useState<"left" | "right">("right");
  const [drawnPath, setDrawnPath] = useState<[number, number][]>([]);
  const [turtlePos, setTurtlePos] = useState<{ x: number; y: number }>({ x: 1, y: 5 });
  const [runResult, setRunResult] = useState<"success" | "fail" | null>(null);
  const [failCount, setFailCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const { highScore, updateHighScore } = useHighScore("loop-builder");

  const currentLevel = LEVELS[level] || LEVELS[0];

  const startGame = useCallback(() => {
    setLevel(0);
    setScore(0);
    setDrawnPath([]);
    setRunResult(null);
    setFailCount(0);
    setShowAnswer(false);
    setRepeatCount(1);
    setForwardSteps(1);
    setTurnDir("right");
    setMode("playing");
    setIsNewHigh(false);
  }, []);

  const skipLevel = useCallback(() => {
    if (level + 1 >= TOTAL_LEVELS) {
      const newHigh = updateHighScore(score);
      setIsNewHigh(newHigh);
      if (score >= TOTAL_LEVELS * 8) playPerfect();
      else playVictory();
      setMode("done");
    } else {
      setLevel(l => l + 1);
      setDrawnPath([]);
      setRunResult(null);
      setFailCount(0);
      setShowAnswer(false);
      setRepeatCount(1);
      setForwardSteps(1);
      setMode("playing");
    }
  }, [level, score, updateHighScore]);

  const runProgram = useCallback(() => {
    const startX = currentLevel.targetPath[0][0];
    const startY = currentLevel.targetPath[0][1];
    const path = generatePath(startX, startY, 1, repeatCount, forwardSteps, turnDir);

    setMode("running");
    setDrawnPath([]);
    setTurtlePos({ x: startX, y: startY });

    // Animate
    path.forEach((p, i) => {
      setTimeout(() => {
        setDrawnPath(path.slice(0, i + 1));
        setTurtlePos({ x: p[0], y: p[1] });

        if (i === path.length - 1) {
          // Check if path matches target
          const targetSet = new Set(currentLevel.targetPath.map(t => `${t[0]},${t[1]}`));
          const drawnSet = new Set(path.map(t => `${t[0]},${t[1]}`));
          const match = targetSet.size === drawnSet.size && Array.from(targetSet).every(t => drawnSet.has(t));

          if (match) {
            setRunResult("success");
            const points = 10;
            setScore(s => s + points);
            playCorrect();
            setTimeout(() => {
              if (level + 1 >= TOTAL_LEVELS) {
                const finalScore = score + points;
                const newHigh = updateHighScore(finalScore);
                setIsNewHigh(newHigh);
                if (finalScore >= TOTAL_LEVELS * 8) playPerfect();
                else playVictory();
                setMode("done");
              } else {
                setLevel(l => l + 1);
                setDrawnPath([]);
                setRunResult(null);
                setFailCount(0);
                setShowAnswer(false);
                setRepeatCount(1);
                setForwardSteps(1);
                setMode("playing");
              }
            }, 1200);
          } else {
            setRunResult("fail");
            setFailCount(c => c + 1);
            playWrong();
            setTimeout(() => {
              setDrawnPath([]);
              setRunResult(null);
              setMode("playing");
            }, 1500);
          }
        }
      }, i * 150);
    });
  }, [repeatCount, forwardSteps, turnDir, currentLevel, level, score, updateHighScore]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-cyan-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">🔄</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">迴圈建造師</h1>
          <p className="text-slate-500 text-sm">用重複指令畫出目標圖形</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>共 {TOTAL_LEVELS} 關</li>
            <li>設定「重複次數」「前進步數」「轉向」</li>
            <li>讓烏龜畫出和目標一樣的圖形</li>
            <li>最高紀錄：{highScore} 分</li>
          </ul>
        </div>
        <button onClick={startGame}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg cursor-pointer border-none hover:opacity-90 transition">
          🚀 開始建造
        </button>
      </div>
    );
  }

  /* ─── Done ─── */
  if (mode === "done") {
    const maxScore = TOTAL_LEVELS * 10;
    const stars = getStars(score, maxScore);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-cyan-500 hover:underline no-underline">← 返回桌遊專區</a>
        <GameOverScreen
          score={score} maxScore={maxScore} gameName="迴圈建造師" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={startGame} onBack={() => setMode("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "loop-builder", activityName: "迴圈建造師" }}
        />
      </div>
    );
  }

  /* ─── Playing / Running ─── */
  const isRunning = mode === "running";
  const targetSet = new Set(currentLevel.targetPath.map(t => `${t[0]},${t[1]}`));
  const drawnSet = new Set(drawnPath.map(t => `${t[0]},${t[1]}`));

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
      <a href="/board-games" className="text-sm text-cyan-500 hover:underline no-underline">← 返回桌遊專區</a>

      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-4">
        <div className="text-sm text-slate-500">第 {level + 1}/{TOTAL_LEVELS} 關：{currentLevel.name}</div>
        <div className="text-sm font-bold text-cyan-600">{score} 分</div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl p-3 border border-cyan-200 shadow-sm mb-4 overflow-auto">
        <div className="grid gap-0 mx-auto" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, width: GRID_SIZE * 32 }}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, idx) => {
            const x = idx % GRID_SIZE;
            const y = Math.floor(idx / GRID_SIZE);
            const isTarget = targetSet.has(`${x},${y}`);
            const isDrawn = drawnSet.has(`${x},${y}`);
            const isTurtle = turtlePos.x === x && turtlePos.y === y && isRunning;
            return (
              <div key={idx}
                className={`w-[30px] h-[30px] flex items-center justify-center text-xs border border-slate-100 transition-all duration-200
                  ${isTurtle ? "bg-green-400 text-white" :
                    isDrawn ? "bg-cyan-400" :
                    isTarget ? "bg-amber-200 border-amber-300" :
                    "bg-slate-50"}
                `}>
                {isTurtle ? "🐢" : ""}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 text-xs text-slate-400 mt-2 justify-center">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-200 inline-block"></span> 目標</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-cyan-400 inline-block"></span> 已畫</span>
        </div>
      </div>

      {/* Run result */}
      {runResult && (
        <div className={`text-center text-sm font-bold mb-3 ${runResult === "success" ? "text-green-500" : "text-red-500"}`}>
          {runResult === "success" ? "✅ 圖形匹配！" : "❌ 圖形不匹配，再試一次"}
        </div>
      )}

      {/* Controls */}
      {!isRunning && (
        <div className="bg-white rounded-xl p-4 border border-cyan-200 mb-4">
          <div className="font-mono text-sm text-slate-600 mb-3 bg-slate-50 rounded-lg p-3">
            <span className="text-cyan-600 font-bold">repeat</span>({repeatCount}) {"{"}<br />
            &nbsp;&nbsp;<span className="text-green-600">forward</span>({forwardSteps})<br />
            &nbsp;&nbsp;<span className="text-purple-600">turn</span>(<span className="text-amber-600">{turnDir === "right" ? "右轉" : "左轉"}</span>)<br />
            {"}"}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-500 w-20">重複次數</label>
              <input type="range" min={1} max={8} value={repeatCount}
                onChange={e => setRepeatCount(Number(e.target.value))}
                className="flex-1" />
              <span className="font-mono font-bold text-cyan-600 w-8 text-center">{repeatCount}</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-500 w-20">前進步數</label>
              <input type="range" min={1} max={8} value={forwardSteps}
                onChange={e => setForwardSteps(Number(e.target.value))}
                className="flex-1" />
              <span className="font-mono font-bold text-green-600 w-8 text-center">{forwardSteps}</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-500 w-20">轉向</label>
              <div className="flex gap-2">
                <button onClick={() => setTurnDir("left")}
                  className={`px-4 py-2 rounded-lg font-bold cursor-pointer border-none transition ${turnDir === "left" ? "bg-purple-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                  ↰ 左轉
                </button>
                <button onClick={() => setTurnDir("right")}
                  className={`px-4 py-2 rounded-lg font-bold cursor-pointer border-none transition ${turnDir === "right" ? "bg-purple-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                  ↱ 右轉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isRunning && (
        <div className="flex gap-3 justify-center">
          <button onClick={runProgram}
            className="px-6 py-2.5 rounded-xl bg-green-500 text-white font-bold cursor-pointer border-none hover:bg-green-600 transition">
            ▶️ 執行
          </button>
        </div>
      )}

      {/* Hint area: show after 3 failures */}
      {!isRunning && failCount >= 3 && (
        <div className="text-center mt-3 space-y-2">
          <div className="text-xs text-amber-500 mb-1">已嘗試 {failCount} 次，需要幫助嗎？</div>
          {currentLevel.hint && !showAnswer && (
            <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg inline-block">
              💡 提示：{currentLevel.hint}
            </div>
          )}
          {!showAnswer ? (
            <div>
              <button onClick={() => setShowAnswer(true)}
                className="text-xs text-slate-400 hover:text-amber-500 cursor-pointer border-none bg-transparent underline">
                還是不行？顯示答案
              </button>
            </div>
          ) : (
            <div className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg inline-block">
              💡 答案：重複 {currentLevel.solution.repeat} 次，前進 {currentLevel.solution.forward} 步，{currentLevel.solution.turn === "right" ? "右轉" : "左轉"}
            </div>
          )}
          <div>
            <button onClick={skipLevel}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent underline">
              跳過此關（不得分）
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
