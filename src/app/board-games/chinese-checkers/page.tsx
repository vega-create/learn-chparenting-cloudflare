"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen } from "@/lib/game-utils";

/* ─── Types ─── */
type Difficulty = "easy" | "medium" | "hard";
type Mode = "menu" | "playing" | "done";
type Cell = "empty" | "player" | "ai" | null; // null = not a valid position
type Pos = { r: number; c: number };

/* ─── Board Definition ─── */
// Star board: 17 rows. Each row has a specific width and offset.
// Row structure: [rowIndex, numCells, regionTag]
// Regions: "top" (AI home), "mid" (shared), "bot" (Player home)
const ROW_DEFS: { count: number; region: "top" | "mid" | "bot" }[] = [
  { count: 1, region: "top" },   // row 0
  { count: 2, region: "top" },   // row 1
  { count: 3, region: "top" },   // row 2
  { count: 4, region: "top" },   // row 3
  { count: 13, region: "mid" },  // row 4
  { count: 12, region: "mid" },  // row 5
  { count: 11, region: "mid" },  // row 6
  { count: 10, region: "mid" },  // row 7
  { count: 9, region: "mid" },   // row 8
  { count: 10, region: "mid" },  // row 9
  { count: 11, region: "mid" },  // row 10
  { count: 12, region: "mid" },  // row 11
  { count: 13, region: "mid" },  // row 12
  { count: 4, region: "bot" },   // row 13
  { count: 3, region: "bot" },   // row 14
  { count: 2, region: "bot" },   // row 15
  { count: 1, region: "bot" },   // row 16
];

const TOTAL_ROWS = ROW_DEFS.length;
const MAX_COLS = 13;

// Build valid positions set
function buildBoard(): Cell[][] {
  const board: Cell[][] = [];
  for (let r = 0; r < TOTAL_ROWS; r++) {
    const row: Cell[] = Array(MAX_COLS).fill(null);
    const { count, region } = ROW_DEFS[r];
    const offset = Math.floor((MAX_COLS - count) / 2);
    for (let i = 0; i < count; i++) {
      const c = offset + i;
      if (region === "top") row[c] = "ai";
      else if (region === "bot") row[c] = "player";
      else row[c] = "empty";
    }
    board.push(row);
  }
  return board;
}

function isValid(r: number, c: number, board: Cell[][]): boolean {
  return r >= 0 && r < TOTAL_ROWS && c >= 0 && c < MAX_COLS && board[r][c] !== null;
}

function posKey(r: number, c: number): string { return `${r},${c}`; }

// The player's goal zone is rows 0-3 (AI's home), AI's goal zone is rows 13-16 (player's home)
function isPlayerGoal(r: number): boolean { return r <= 3; }
function isAIGoal(r: number): boolean { return r >= 13; }

function getGoalPositions(region: "top" | "bot"): Pos[] {
  const positions: Pos[] = [];
  for (let r = 0; r < TOTAL_ROWS; r++) {
    const { count, region: reg } = ROW_DEFS[r];
    if (reg !== region) continue;
    const offset = Math.floor((MAX_COLS - count) / 2);
    for (let i = 0; i < count; i++) {
      positions.push({ r, c: offset + i });
    }
  }
  return positions;
}

/* ─── Adjacency: 6 hex neighbors ─── */
// Offset hex grid: even/odd rows have different column offsets for diagonal neighbors.
// Direction indices: 0=upper-left, 1=upper-right, 2=left, 3=right, 4=lower-left, 5=lower-right
const EVEN_DIRS = [[-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]];
const ODD_DIRS  = [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]];

function getDirs(r: number): number[][] {
  return r % 2 === 0 ? EVEN_DIRS : ODD_DIRS;
}

function getNeighbors(r: number, c: number): Pos[] {
  return getDirs(r).map(([dr, dc]) => ({ r: r + dr, c: c + dc }));
}

/* ─── Move finding ─── */
function findSteps(r: number, c: number, board: Cell[][]): Pos[] {
  return getNeighbors(r, c).filter(n => isValid(n.r, n.c, board) && board[n.r][n.c] === "empty");
}

function findJumps(r: number, c: number, board: Cell[][]): Pos[] {
  const result: Pos[] = [];
  const visited = new Set<string>();
  visited.add(posKey(r, c));

  function dfs(cr: number, cc: number) {
    const dirs = getDirs(cr);
    for (let d = 0; d < 6; d++) {
      const nr = cr + dirs[d][0];
      const nc = cc + dirs[d][1];
      if (!isValid(nr, nc, board)) continue;
      if (board[nr][nc] !== "player" && board[nr][nc] !== "ai") continue;
      // There's a piece at (nr,nc) — jump over it using the SAME direction
      // but with the landing row's parity offset so the jump stays straight
      const nDirs = getDirs(nr);
      const jr = nr + nDirs[d][0];
      const jc = nc + nDirs[d][1];
      if (!isValid(jr, jc, board)) continue;
      if (board[jr][jc] !== "empty") continue;
      const key = posKey(jr, jc);
      if (visited.has(key)) continue;
      visited.add(key);
      result.push({ r: jr, c: jc });
      dfs(jr, jc);
    }
  }
  dfs(r, c);
  return result;
}

function findAllMoves(r: number, c: number, board: Cell[][]): Pos[] {
  return [...findSteps(r, c, board), ...findJumps(r, c, board)];
}

/* ─── Win check ─── */
// 終點區 10 格都有棋子、而且其中至少 7 顆是自己的，就算贏。
// 原本要求 10 格全部是自己的棋子，只要對方有一顆棋子留在家裡沒出來，就永遠贏不了。
function checkWin(board: Cell[][], who: "player" | "ai"): boolean {
  const goalRegion = who === "player" ? "top" : "bot";
  const goals = getGoalPositions(goalRegion);
  const mine = goals.filter(g => board[g.r][g.c] === who).length;
  return mine >= 7 && goals.every(g => board[g.r][g.c] !== "empty");
}

/* ─── Piece positions ─── */
function getPieces(board: Cell[][], who: "player" | "ai"): Pos[] {
  const pieces: Pos[] = [];
  for (let r = 0; r < TOTAL_ROWS; r++)
    for (let c = 0; c < MAX_COLS; c++)
      if (board[r][c] === who) pieces.push({ r, c });
  return pieces;
}

/* ─── AI Logic ─── */
/*
 * 舊版的問題：
 * - 已經在終點區裡的棋子，左右移動也能拿到「進終點」的加分，所以電腦會一直在終點區裡晃，
 *   後面的棋子反而不動，整盤下不完。
 * - 初級是完全隨機，會往回走。
 * 新版：只有「從外面走進終點區」才加分；越後面的棋子越優先；
 * 高級會多看一步（自己下一步能跳多遠、會不會幫對手搭橋）。
 */
function moveScore(board: Cell[][], p: Pos, m: Pos): number {
  const advance = m.r - p.r;               // 電腦往下走，r 變大是前進
  const inGoal = isAIGoal(p.r);
  if (inGoal && advance <= 0) return -100; // 已經到家的棋子不要橫著走或往回走
  let score = advance * 10;
  if (advance < 0) score -= 20;
  if (!inGoal && isAIGoal(m.r)) score += 30;
  score += (TOTAL_ROWS - 1 - p.r) * 1.5;   // 落在後面的棋子優先
  if (isPlayerGoal(p.r) && !isPlayerGoal(m.r)) score += 15; // 先離開自己的家，不要擋住對手
  score -= Math.abs(m.c - 6) * 1.5;        // 靠中間比較容易連跳
  return score;
}

function bestAdvance(board: Cell[][], who: "player" | "ai"): number {
  let best = 0;
  for (const p of getPieces(board, who)) {
    for (const m of findAllMoves(p.r, p.c, board)) {
      const adv = who === "ai" ? m.r - p.r : p.r - m.r;
      if (adv > best) best = adv;
    }
  }
  return best;
}

function aiMove(board: Cell[][], diff: Difficulty): { from: Pos; to: Pos } | null {
  const pieces = getPieces(board, "ai");
  const allMoves: { from: Pos; to: Pos; score: number }[] = [];

  for (const p of pieces) {
    for (const m of findAllMoves(p.r, p.c, board)) {
      let score = moveScore(board, p, m);
      if (diff === "hard" && score > -50) {
        // 多看一步：這樣走完之後，自己下一步最多能前進幾排、對手最多能前進幾排
        const nb = board.map(row => [...row]);
        nb[p.r][p.c] = "empty";
        nb[m.r][m.c] = "ai";
        score += bestAdvance(nb, "ai") * 2 - bestAdvance(nb, "player") * 3;
      }
      score += Math.random() * (diff === "hard" ? 1 : 4);
      allMoves.push({ from: p, to: m, score });
    }
  }

  if (allMoves.length === 0) return null;
  allMoves.sort((a, b) => b.score - a.score);

  // 高級下最好的一步；中級從前 3 名挑；初級從前 5 名挑（常常不是最好的，但不會亂走）
  const pool = diff === "hard" ? 1 : diff === "medium" ? 3 : 5;
  const top = allMoves.slice(0, Math.min(pool, allMoves.length));
  return top[Math.floor(Math.random() * top.length)];
}

/* ─── Scoring ─── */
function calcScore(moves: number, board: Cell[][]): number {
  const goalPos = getGoalPositions("top");
  const inGoal = goalPos.filter(g => board[g.r][g.c] === "player").length;
  // Base score from pieces in goal (max 100 from 10 pieces)
  const goalScore = inGoal * 10;
  // Efficiency bonus: fewer moves = higher bonus (max ~50)
  const efficiencyBonus = Math.max(0, 50 - Math.floor(moves / 2));
  return Math.min(100, goalScore + efficiencyBonus);   // 滿分是 100，不要超過
}

/* ─── Position to pixel (for rendering) ─── */
const CELL_SIZE = 28;
const CELL_GAP = 2;

function cellPosition(r: number, c: number): { x: number; y: number } {
  const { count } = ROW_DEFS[r];
  const totalWidth = MAX_COLS * (CELL_SIZE + CELL_GAP);
  const rowWidth = count * (CELL_SIZE + CELL_GAP);
  const rowOffset = (totalWidth - rowWidth) / 2;
  const offset = Math.floor((MAX_COLS - count) / 2);
  const colInRow = c - offset;
  return {
    x: rowOffset + colInRow * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2,
    y: r * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2,
  };
}

/* ─── Difficulty options ─── */
const DIFF_OPTIONS: { key: Difficulty; label: string; desc: string }[] = [
  { key: "easy", label: "初級", desc: "電腦會前進，但常常不是走最好的一步" },
  { key: "medium", label: "中級", desc: "電腦會找連跳、先動後面的棋子" },
  { key: "hard", label: "高級", desc: "電腦會多看一步，還會避免幫你搭橋" },
];

/* ─── Main Component ─── */
export default function ChineseCheckersPage() {
  const [mode, setMode] = useState<Mode>("menu");
  const [diff, setDiff] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<Cell[][]>([]);
  const [selected, setSelected] = useState<Pos | null>(null);
  const [validMoves, setValidMoves] = useState<Pos[]>([]);
  const [turn, setTurn] = useState<"player" | "ai">("player");
  const [moveCount, setMoveCount] = useState(0);
  const [score, setScore] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [message, setMessage] = useState("");
  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { highScore, updateHighScore } = useHighScore("chinese-checkers");

  const startGame = useCallback((d: Difficulty) => {
    setDiff(d);
    setBoard(buildBoard());
    setSelected(null);
    setValidMoves([]);
    setTurn("player");
    setMoveCount(0);
    setScore(0);
    setIsNewHigh(false);
    setMessage("你的回合 - 選擇一顆棋子");
    setMode("playing");
  }, []);

  const endGame = useCallback((winner: "player" | "ai", b: Cell[][]) => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    if (winner === "player") {
      const finalScore = calcScore(moveCount, b);
      setScore(finalScore);
      const newHigh = updateHighScore(finalScore);
      setIsNewHigh(newHigh);
      if (moveCount < 30) playPerfect();
      else playVictory();
      setMessage("恭喜你贏了！");
    } else {
      setScore(Math.max(calcScore(moveCount, b) - 20, 0));
      playWrong();
      setMessage("AI 獲勝了！");
    }
    setMode("done");
  }, [moveCount, updateHighScore]);

  /* ─── Handle AI turn ─── */
  useEffect(() => {
    if (mode !== "playing" || turn !== "ai") return;
    setMessage("AI 思考中...");
    aiTimerRef.current = setTimeout(() => {
      const move = aiMove(board, diff);
      if (!move) {
        // AI stuck, player wins
        endGame("player", board);
        return;
      }
      const newBoard = board.map(row => [...row]);
      newBoard[move.from.r][move.from.c] = "empty";
      newBoard[move.to.r][move.to.c] = "ai";
      setBoard(newBoard);

      if (checkWin(newBoard, "ai")) {
        endGame("ai", newBoard);
        return;
      }
      setTurn("player");
      setMessage("你的回合 - 選擇一顆棋子");
    }, 600);

    return () => { if (aiTimerRef.current) clearTimeout(aiTimerRef.current); };
  }, [turn, mode, board, diff, endGame]);

  /* ─── Handle cell click ─── */
  const handleCellClick = useCallback((r: number, c: number) => {
    if (mode !== "playing" || turn !== "player") return;
    const cell = board[r][c];

    // If clicking on own piece, select it
    if (cell === "player") {
      const moves = findAllMoves(r, c, board);
      if (moves.length === 0) {
        playWrong();
        setMessage("這顆棋子無法移動");
        return;
      }
      setSelected({ r, c });
      setValidMoves(moves);
      playCorrect();
      setMessage(`已選擇棋子 - 點擊綠點移動`);
      return;
    }

    // If clicking on a valid move target
    if (selected && validMoves.some(m => m.r === r && m.c === c)) {
      const newBoard = board.map(row => [...row]);
      newBoard[selected.r][selected.c] = "empty";
      newBoard[r][c] = "player";
      setBoard(newBoard);
      setSelected(null);
      setValidMoves([]);
      setMoveCount(m => m + 1);
      playCorrect();

      if (checkWin(newBoard, "player")) {
        endGame("player", newBoard);
        return;
      }
      setTurn("ai");
      return;
    }

    // Deselect
    if (selected) {
      setSelected(null);
      setValidMoves([]);
      setMessage("你的回合 - 選擇一顆棋子");
    }
  }, [mode, turn, board, selected, validMoves, endGame]);

  const boardWidth = MAX_COLS * (CELL_SIZE + CELL_GAP);
  const boardHeight = TOTAL_ROWS * (CELL_SIZE + CELL_GAP);
  // 棋盤固定 390px 寬，手機放不下會被切掉，依螢幕寬度等比例縮小
  const [fitScale, setFitScale] = useState(1);
  useEffect(() => {
    const fit = () => setFitScale(Math.min(1, (window.innerWidth - 24) / boardWidth));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [boardWidth]);
  const validSet = new Set(validMoves.map(m => posKey(m.r, m.c)));

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-indigo-500 hover:underline no-underline">
          ← 返回桌遊專區
        </a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">⭐</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">跳棋</h1>
          <p className="text-slate-500 text-sm">經典中國跳棋，挑戰 AI 對手</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-indigo-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>你是藍色棋子（下方），AI 是紅色棋子（上方）</li>
            <li>每回合移動一顆棋子到相鄰空位</li>
            <li>可以跳過其他棋子，連續跳躍</li>
            <li>先將所有棋子移到對面三角區即獲勝</li>
            <li>步數越少分數越高</li>
          </ul>
        </div>
        <div className="space-y-3">
          {DIFF_OPTIONS.map(d => (
            <button
              key={d.key}
              onClick={() => startGame(d.key)}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold text-left cursor-pointer border-none hover:opacity-90 transition"
            >
              <div className="text-lg">{d.label}</div>
              <div className="text-xs opacity-80">{d.desc}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ─── Done ─── */
  if (mode === "done") {
    const stars = getStars(score, 100);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-indigo-500 hover:underline no-underline">
          ← 返回桌遊專區
        </a>
        <GameOverScreen
          score={score}
          maxScore={100}
          gameName="跳棋"
          stars={stars}
          highScore={Math.max(highScore, score)}
          isNewHigh={isNewHigh}
          onRestart={() => startGame(diff)}
          onBack={() => setMode("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "chinese-checkers", activityName: "跳棋" }}
        />
      </div>
    );
  }

  /* ─── Playing ─── */
  return (
    <div className="max-w-lg mx-auto px-4 py-6 animate-fadeIn">
      <a href="/board-games" className="text-sm text-indigo-500 hover:underline no-underline">
        ← 返回桌遊專區
      </a>

      {/* Header */}
      <div className="flex justify-between items-center mt-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 font-bold">
            🔴 AI
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 font-bold">
            🔵 你
          </span>
        </div>
        <div className="text-sm font-mono text-slate-500">步數：{moveCount}</div>
      </div>

      {/* Status bar */}
      <div className={`text-center text-sm font-bold mb-3 py-2 rounded-lg ${
        turn === "player"
          ? "bg-blue-50 text-blue-600"
          : "bg-red-50 text-red-600"
      }`}>
        {message}
      </div>

      {/* Board */}
      <div className="bg-white rounded-2xl p-1 sm:p-3 -mx-2 sm:mx-0 border border-indigo-200 shadow-sm mb-4 overflow-hidden">
        <div className="mx-auto" style={{ width: boardWidth * fitScale, height: boardHeight * fitScale }}>
        <div
          className="relative"
          style={{ width: boardWidth, height: boardHeight, transform: `scale(${fitScale})`, transformOrigin: "top left" }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              if (cell === null) return null;
              const { x, y } = cellPosition(r, c);
              const isSelected = selected?.r === r && selected?.c === c;
              const isValidTarget = validSet.has(posKey(r, c));
              const isPlayerGoalCell = isPlayerGoal(r);
              const isAIGoalCell = isAIGoal(r);

              let bg = "bg-slate-200"; // empty
              let border = "border-slate-300";
              let shadow = "";
              let scale = "";
              let zIndex = 1;

              if (cell === "player") {
                bg = "bg-blue-500";
                border = "border-blue-600";
                shadow = "shadow-md";
                if (isSelected) {
                  bg = "bg-blue-400";
                  border = "border-blue-300";
                  shadow = "shadow-lg shadow-blue-300/50";
                  scale = "scale-110";
                  zIndex = 10;
                }
              } else if (cell === "ai") {
                bg = "bg-red-500";
                border = "border-red-600";
                shadow = "shadow-md";
              } else if (isValidTarget) {
                bg = "bg-green-400/50";
                border = "border-green-500";
                zIndex = 5;
              } else if (isPlayerGoalCell) {
                bg = "bg-red-100";
                border = "border-red-200";
              } else if (isAIGoalCell) {
                bg = "bg-blue-100";
                border = "border-blue-200";
              }

              return (
                <button
                  key={posKey(r, c)}
                  onClick={() => handleCellClick(r, c)}
                  className={`absolute rounded-full border-2 transition-all duration-150 cursor-pointer
                    ${bg} ${border} ${shadow} ${scale}
                    ${isValidTarget ? "animate-pulse" : ""}
                    ${cell === "player" && turn === "player" ? "hover:brightness-110" : ""}
                  `}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    left: x - CELL_SIZE / 2,
                    top: y - CELL_SIZE / 2,
                    zIndex,
                  }}
                  title={
                    cell === "player" ? "你的棋子"
                    : cell === "ai" ? "AI 棋子"
                    : isValidTarget ? "可移動位置"
                    : "空位"
                  }
                />
              );
            })
          )}
        </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-xs text-slate-400 mb-2">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-100 border border-blue-200" />
          你的目標區
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-red-100 border border-red-200" />
          AI 目標區
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-green-400/50 border border-green-500" />
          可移動
        </span>
      </div>

      {/* Piece counts */}
      <div className="flex justify-between text-xs text-slate-500 px-2">
        <span>
          你在目標區：{getGoalPositions("top").filter(g => board[g.r]?.[g.c] === "player").length}/10
        </span>
        <span>
          AI 在目標區：{getGoalPositions("bot").filter(g => board[g.r]?.[g.c] === "ai").length}/10
        </span>
      </div>
    </div>
  );
}
