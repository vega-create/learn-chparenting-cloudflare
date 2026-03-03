"use client";
import { useState, useCallback, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen } from "@/lib/game-utils";

/* ─── Level Data ─── */
type Dir = "up" | "down" | "left" | "right";
const DIR_EMOJI: Record<Dir, string> = { up: "⬆️", down: "⬇️", left: "⬅️", right: "➡️" };
const DIR_DELTA: Record<Dir, [number, number]> = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };

interface Level {
  size: number;
  start: [number, number];
  goal: [number, number];
  walls: [number, number][];
  maxMoves: number;
  hints: [string, string, string];
}

const TOTAL_LEVELS = 8;

/* ─── BFS pathfinding ─── */
function bfs(
  size: number,
  start: [number, number],
  goal: [number, number],
  wallSet: Set<string>
): [number, number][] | null {
  const queue: { pos: [number, number]; path: [number, number][] }[] = [
    { pos: start, path: [start] },
  ];
  const visited = new Set<string>();
  visited.add(`${start[0]},${start[1]}`);

  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;
    if (pos[0] === goal[0] && pos[1] === goal[1]) return path;

    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = pos[0] + dr;
      const nc = pos[1] + dc;
      const key = `${nr},${nc}`;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && !wallSet.has(key) && !visited.has(key)) {
        visited.add(key);
        queue.push({ pos: [nr, nc], path: [...path, [nr, nc]] });
      }
    }
  }
  return null;
}

/* ─── Compress moves for hint display ─── */
function compressMoves(moves: string[]): string[] {
  const result: string[] = [];
  let i = 0;
  while (i < moves.length) {
    let count = 1;
    while (i + count < moves.length && moves[i + count] === moves[i]) count++;
    result.push(count === 1 ? moves[i] : `${moves[i]}x${count}`);
    i += count;
  }
  return result;
}

/* ─── Auto-generate 3-tier hints from path ─── */
function generateHints(
  start: [number, number],
  goal: [number, number],
  walls: [number, number][],
  optimalPath: [number, number][]
): [string, string, string] {
  // Hint 1 (vague): direction + wall count
  const dirParts: string[] = [];
  if (goal[0] > start[0]) dirParts.push("下方");
  if (goal[0] < start[0]) dirParts.push("上方");
  if (goal[1] > start[1]) dirParts.push("右邊");
  if (goal[1] < start[1]) dirParts.push("左邊");
  const hint1 = walls.length === 0
    ? `目標在你的${dirParts.join("和")}`
    : `目標在${dirParts.join("")}，需要繞過 ${walls.length} 面牆`;

  // Hint 2 (moderate): step count
  const steps = optimalPath.length - 1;
  const hint2 = `最短路線需要 ${steps} 步`;

  // Hint 3 (near-answer): full compressed path
  const moves: string[] = [];
  for (let i = 1; i < optimalPath.length; i++) {
    const dRow = optimalPath[i][0] - optimalPath[i - 1][0];
    const dCol = optimalPath[i][1] - optimalPath[i - 1][1];
    moves.push(dRow === -1 ? "⬆️" : dRow === 1 ? "⬇️" : dCol === -1 ? "⬅️" : "➡️");
  }
  const hint3 = compressMoves(moves).join(" ") + `（${steps}步）`;

  return [hint1, hint2, hint3];
}

/* ─── Difficulty tiers for procedural generation ─── */
interface DifficultyConfig {
  wallCount: number;
  minPathLen: number;
  maxPathLen: number;
  startOptions: [number, number][];
  goalOptions: [number, number][];
}

const DIFFICULTY: DifficultyConfig[] = [
  // 1-2: Tutorial, no walls
  { wallCount: 0, minPathLen: 3, maxPathLen: 4, startOptions: [[0, 0]], goalOptions: [[0, 4], [4, 0]] },
  { wallCount: 0, minPathLen: 5, maxPathLen: 8, startOptions: [[0, 0]], goalOptions: [[4, 4], [2, 4], [4, 2]] },
  // 3-4: Easy walls
  { wallCount: 2, minPathLen: 5, maxPathLen: 8, startOptions: [[0, 0], [0, 2]], goalOptions: [[4, 4], [4, 2]] },
  { wallCount: 3, minPathLen: 6, maxPathLen: 10, startOptions: [[0, 0]], goalOptions: [[4, 4], [3, 4]] },
  // 5-6: Medium walls
  { wallCount: 4, minPathLen: 7, maxPathLen: 12, startOptions: [[0, 0], [2, 0], [0, 2]], goalOptions: [[4, 4], [2, 4], [4, 2]] },
  { wallCount: 5, minPathLen: 7, maxPathLen: 12, startOptions: [[0, 0], [2, 0]], goalOptions: [[4, 4], [2, 4]] },
  // 7-8: Hard walls
  { wallCount: 5, minPathLen: 8, maxPathLen: 14, startOptions: [[0, 0], [4, 0], [0, 4]], goalOptions: [[4, 4], [0, 4], [4, 0]] },
  { wallCount: 6, minPathLen: 8, maxPathLen: 14, startOptions: [[0, 0], [4, 0]], goalOptions: [[4, 4], [0, 4]] },
];

function generateLevels(): Level[] {
  const SIZE = 5;
  return DIFFICULTY.map((cfg) => {
    for (let attempt = 0; attempt < 100; attempt++) {
      const start = cfg.startOptions[Math.floor(Math.random() * cfg.startOptions.length)] as [number, number];
      const goal = cfg.goalOptions[Math.floor(Math.random() * cfg.goalOptions.length)] as [number, number];
      if (start[0] === goal[0] && start[1] === goal[1]) continue;

      // Place random walls
      const walls: [number, number][] = [];
      const occupied = new Set<string>();
      occupied.add(`${start[0]},${start[1]}`);
      occupied.add(`${goal[0]},${goal[1]}`);

      for (let w = 0; w < cfg.wallCount; w++) {
        for (let t = 0; t < 50; t++) {
          const wr = Math.floor(Math.random() * SIZE);
          const wc = Math.floor(Math.random() * SIZE);
          const key = `${wr},${wc}`;
          if (!occupied.has(key)) {
            walls.push([wr, wc]);
            occupied.add(key);
            break;
          }
        }
      }

      // Validate with BFS
      const wallSet = new Set(walls.map((w) => `${w[0]},${w[1]}`));
      const optimalPath = bfs(SIZE, start, goal, wallSet);
      if (!optimalPath) continue;

      const pathLen = optimalPath.length - 1;
      if (pathLen < cfg.minPathLen || pathLen > cfg.maxPathLen) continue;

      const slack = Math.max(2, Math.floor(pathLen * 0.5));
      return {
        size: SIZE,
        start,
        goal,
        walls,
        maxMoves: pathLen + slack,
        hints: generateHints(start, goal, walls, optimalPath),
      };
    }

    // Fallback
    const start: [number, number] = [0, 0];
    const goal: [number, number] = [4, 4];
    return {
      size: SIZE, start, goal, walls: [], maxMoves: 10,
      hints: ["需要用到兩個方向", "先右再下", "➡️x4 ⬇️x4（8步）"] as [string, string, string],
    };
  });
}

/* ─── Component ─── */
export default function CodePathPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "running" | "done">("menu");
  const [levels, setLevels] = useState<Level[]>([]);
  const [level, setLevel] = useState(0);
  const [commands, setCommands] = useState<Dir[]>([]);
  const [robotPos, setRobotPos] = useState<[number, number]>([0, 0]);
  const [path, setPath] = useState<[number, number][]>([]);
  const [runResult, setRunResult] = useState<"success" | "fail" | "wall" | null>(null);
  const [failCount, setFailCount] = useState(0);
  const [score, setScore] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const { highScore, updateHighScore } = useHighScore("code-path");
  const runTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  const currentLevel = levels[level] || { size: 5, start: [0, 0] as [number, number], goal: [4, 4] as [number, number], walls: [] as [number, number][], maxMoves: 8, hints: ["", "", ""] as [string, string, string] };
  const wallSet = new Set(currentLevel.walls.map(w => `${w[0]},${w[1]}`));

  const startGame = useCallback(() => {
    const newLevels = generateLevels();
    setLevels(newLevels);
    setLevel(0);
    setScore(0);
    setCommands([]);
    setRobotPos(newLevels[0].start);
    setPath([]);
    setRunResult(null);
    setFailCount(0);
    setMode("playing");
    setIsNewHigh(false);
  }, []);

  const addCommand = (dir: Dir) => {
    if (commands.length >= currentLevel.maxMoves) return;
    setCommands(prev => [...prev, dir]);
  };

  const removeCommand = (idx: number) => {
    setCommands(prev => prev.filter((_, i) => i !== idx));
  };

  const clearCommands = () => setCommands([]);

  const skipLevel = useCallback(() => {
    if (level + 1 >= TOTAL_LEVELS) {
      const newHigh = updateHighScore(score);
      setIsNewHigh(newHigh);
      if (score >= TOTAL_LEVELS * 10) playPerfect();
      else playVictory();
      setMode("done");
    } else {
      const nextLv = level + 1;
      setLevel(nextLv);
      setCommands([]);
      setRobotPos(levels[nextLv].start);
      setPath([]);
      setRunResult(null);
      setFailCount(0);
      setMode("playing");
    }
  }, [level, levels, score, updateHighScore]);

  const runProgram = useCallback(() => {
    if (commands.length === 0) return;
    setMode("running");
    setPath([currentLevel.start]);
    setRobotPos(currentLevel.start);
    setRunResult(null);

    let pos: [number, number] = [...currentLevel.start] as [number, number];
    const positions: [number, number][] = [pos];
    let hitWall = false;

    for (const cmd of commands) {
      const [dr, dc] = DIR_DELTA[cmd];
      const nr = pos[0] + dr;
      const nc = pos[1] + dc;

      if (nr < 0 || nr >= currentLevel.size || nc < 0 || nc >= currentLevel.size) {
        hitWall = true;
        break;
      }
      if (wallSet.has(`${nr},${nc}`)) {
        hitWall = true;
        break;
      }
      pos = [nr, nc];
      positions.push([...pos] as [number, number]);
    }

    // Animate step by step
    runTimeoutRef.current.forEach(clearTimeout);
    runTimeoutRef.current = [];

    positions.forEach((p, i) => {
      const t = setTimeout(() => {
        setRobotPos(p);
        setPath(positions.slice(0, i + 1));

        if (i === positions.length - 1) {
          if (hitWall) {
            setRunResult("wall");
            setFailCount(c => c + 1);
            playWrong();
            setTimeout(() => { setMode("playing"); setRunResult(null); setPath([]); setRobotPos(currentLevel.start); }, 1500);
          } else if (p[0] === currentLevel.goal[0] && p[1] === currentLevel.goal[1]) {
            setRunResult("success");
            const points = Math.max(15 - commands.length, 5);
            setScore(s => s + points);
            playCorrect();
            setTimeout(() => {
              if (level + 1 >= TOTAL_LEVELS) {
                const finalScore = score + points;
                const newHigh = updateHighScore(finalScore);
                setIsNewHigh(newHigh);
                if (finalScore >= TOTAL_LEVELS * 10) playPerfect();
                else playVictory();
                setMode("done");
              } else {
                const nextLv = level + 1;
                setLevel(nextLv);
                setCommands([]);
                setRobotPos(levels[nextLv].start);
                setPath([]);
                setRunResult(null);
                setFailCount(0);
                setMode("playing");
              }
            }, 1200);
          } else {
            setRunResult("fail");
            setFailCount(c => c + 1);
            playWrong();
            setTimeout(() => { setMode("playing"); setRunResult(null); setPath([]); setRobotPos(currentLevel.start); }, 1500);
          }
        }
      }, i * 400);
      runTimeoutRef.current.push(t);
    });
  }, [commands, currentLevel, level, levels, score, wallSet, updateHighScore]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-cyan-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">🤖</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">程式路徑</h1>
          <p className="text-slate-500 text-sm">編寫指令，引導機器人到達目標</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>共 {TOTAL_LEVELS} 關，每次隨機產生</li>
            <li>用方向指令引導 🤖 到達 🎯</li>
            <li>避開牆壁 🧱</li>
            <li>指令越少，分數越高</li>
            <li>最高紀錄：{highScore} 分</li>
          </ul>
        </div>
        <button onClick={startGame}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg cursor-pointer border-none hover:opacity-90 transition">
          🚀 開始闖關
        </button>
      </div>
    );
  }

  /* ─── Done ─── */
  if (mode === "done") {
    const maxScore = TOTAL_LEVELS * 15;
    const stars = getStars(score, maxScore);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-cyan-500 hover:underline no-underline">← 返回桌遊專區</a>
        <GameOverScreen
          score={score} maxScore={maxScore} gameName="程式路徑" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={startGame} onBack={() => setMode("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "code-path", activityName: "程式路徑" }}
        />
      </div>
    );
  }

  /* ─── Playing / Running ─── */
  const isRunning = mode === "running";
  const pathSet = new Set(path.map(p => `${p[0]},${p[1]}`));

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
      <a href="/board-games" className="text-sm text-cyan-500 hover:underline no-underline">← 返回桌遊專區</a>

      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-4">
        <div className="text-sm text-slate-500">第 {level + 1}/{TOTAL_LEVELS} 關</div>
        <div className="text-sm font-bold text-cyan-600">{score} 分</div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl p-4 border border-cyan-200 shadow-sm mb-4">
        <div className="grid gap-1 mx-auto" style={{ gridTemplateColumns: `repeat(${currentLevel.size}, 1fr)`, maxWidth: currentLevel.size * 52 }}>
          {Array.from({ length: currentLevel.size * currentLevel.size }, (_, idx) => {
            const r = Math.floor(idx / currentLevel.size);
            const c = idx % currentLevel.size;
            const isStart = r === currentLevel.start[0] && c === currentLevel.start[1];
            const isGoal = r === currentLevel.goal[0] && c === currentLevel.goal[1];
            const isWall = wallSet.has(`${r},${c}`);
            const isRobot = r === robotPos[0] && c === robotPos[1];
            const isPath = pathSet.has(`${r},${c}`);
            return (
              <div key={idx}
                className={`w-[48px] h-[48px] flex items-center justify-center rounded-lg text-xl transition-all duration-300
                  ${isWall ? "bg-slate-700" : isPath ? "bg-cyan-100" : isGoal ? "bg-amber-100" : "bg-slate-50 border border-slate-200"}
                `}>
                {isRobot ? "🤖" : isGoal ? "🎯" : isWall ? "🧱" : isStart && !isRunning ? "📍" : ""}
              </div>
            );
          })}
        </div>
      </div>

      {/* Run result */}
      {runResult && (
        <div className={`text-center text-sm font-bold mb-3 ${runResult === "success" ? "text-green-500" : "text-red-500"}`}>
          {runResult === "success" ? "✅ 成功到達目標！" : runResult === "wall" ? "💥 撞到牆壁了！" : "❌ 沒有到達目標"}
        </div>
      )}

      {/* Command list */}
      <div className="bg-white rounded-xl p-3 border border-cyan-200 mb-4 min-h-[52px]">
        <div className="text-xs text-slate-400 mb-1">指令 ({commands.length}/{currentLevel.maxMoves})</div>
        <div className="flex flex-wrap gap-1">
          {commands.map((cmd, i) => (
            <button key={i} onClick={() => !isRunning && removeCommand(i)}
              className={`px-2 py-1 rounded-lg text-lg cursor-pointer border-none transition ${isRunning ? "bg-cyan-100" : "bg-slate-100 hover:bg-red-100"}`}>
              {DIR_EMOJI[cmd]}
            </button>
          ))}
          {commands.length === 0 && <span className="text-xs text-slate-300">點擊下方方向鍵加入指令</span>}
        </div>
      </div>

      {/* Controls */}
      {!isRunning && (
        <>
          <div className="flex gap-2 justify-center mb-3">
            {(Object.keys(DIR_EMOJI) as Dir[]).map(dir => (
              <button key={dir} onClick={() => addCommand(dir)}
                className="w-14 h-14 rounded-xl bg-white border-2 border-cyan-200 text-2xl cursor-pointer hover:border-cyan-400 hover:bg-cyan-50 transition">
                {DIR_EMOJI[dir]}
              </button>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={runProgram} disabled={commands.length === 0}
              className="px-6 py-2.5 rounded-xl bg-green-500 text-white font-bold cursor-pointer border-none hover:bg-green-600 transition disabled:opacity-40">
              ▶️ 執行
            </button>
            <button onClick={clearCommands}
              className="px-6 py-2.5 rounded-xl border-2 border-slate-300 text-slate-600 font-bold cursor-pointer bg-white hover:bg-slate-50 transition">
              🗑️ 清除
            </button>
          </div>
          {/* Progressive hints: 3次模糊、5次較明確、7次給答案 */}
          {failCount >= 3 && (
            <div className="text-center mt-3 space-y-2">
              <div className="text-xs text-amber-500">已嘗試 {failCount} 次，需要幫助嗎？</div>
              <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg inline-block">
                💡 提示：{currentLevel.hints[failCount >= 7 ? 2 : failCount >= 5 ? 1 : 0]}
              </div>
              <div>
                <button onClick={skipLevel}
                  className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent underline">
                  跳過此關（不得分）
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
