"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen, useTimer } from "@/lib/game-utils";
import { generateSudoku, SPEC_6, SPEC_9, type SudokuSpec } from "@/lib/sudoku";

/**
 * 數獨（6×6、9×9，用數字）。
 *
 * 迷你數獨是 4×4 水果版，給低年級入門；這一款接在後面，給已經會玩的孩子。
 * 題目都由 @/lib/sudoku 產生：只有一個解，而且只靠「這一格只剩一個數字能填」
 * 和「這個數字在這一排只剩一格能放」就解得出來，不用猜。
 */

type LevelKey = "l1" | "l2" | "l3" | "l4";
interface LevelDef { key: LevelKey; label: string; desc: string; spec: SudokuSpec; givens: number; parSeconds: number }

const LEVELS: LevelDef[] = [
  { key: "l1", label: "入門 6×6", desc: "36 格裡已經填好 22 格", spec: SPEC_6, givens: 22, parSeconds: 240 },
  { key: "l2", label: "初級 6×6", desc: "36 格裡只填好 16 格", spec: SPEC_6, givens: 16, parSeconds: 360 },
  { key: "l3", label: "中級 9×9", desc: "81 格裡已經填好 44 格", spec: SPEC_9, givens: 44, parSeconds: 900 },
  { key: "l4", label: "高級 9×9", desc: "81 格裡只填好 32 格", spec: SPEC_9, givens: 32, parSeconds: 1500 },
];

const MAX_HINTS = 3;

export default function SudokuPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [level, setLevel] = useState<LevelDef>(LEVELS[0]);
  const [solution, setSolution] = useState<number[]>([]);
  const [given, setGiven] = useState<boolean[]>([]);
  const [board, setBoard] = useState<number[]>([]);
  const [notes, setNotes] = useState<number[][]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [noteMode, setNoteMode] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [score, setScore] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const { highScore, updateHighScore } = useHighScore(`sudoku-${level.key}`);
  const { time, fmt: timerFmt, reset: resetTimer } = useTimer(mode === "playing");
  const timeRef = useRef(0);
  timeRef.current = time;

  const size = level.spec.size;

  const startGame = useCallback((lv: LevelDef) => {
    const p = generateSudoku(lv.spec, lv.givens);
    setLevel(lv);
    setSolution(p.solution);
    setGiven(p.puzzle.map(v => v !== 0));
    setBoard([...p.puzzle]);
    setNotes(p.puzzle.map(() => []));
    setSelected(null);
    setNoteMode(false);
    setMistakes(0);
    setHintsUsed(0);
    setScore(0);
    setIsNewHigh(false);
    resetTimer();
    setMode("playing");
  }, [resetTimer]);

  const finish = useCallback((m: number, h: number) => {
    const over = Math.max(0, timeRef.current - level.parSeconds);
    const timePenalty = Math.min(Math.floor(over / 15), 30);
    const final = Math.max(100 - m * 5 - h * 10 - timePenalty, 10);
    setScore(final);
    setIsNewHigh(updateHighScore(final));
    if (final >= 95) playPerfect(); else playVictory();
    setMode("done");
  }, [level, updateHighScore]);

  /** 填對一格之後，把同一排、同一宮的筆記裡這個數字擦掉 */
  const clearNotesAround = useCallback((ns: number[][], idx: number, val: number) => {
    const { boxRows, boxCols } = level.spec;
    const r = Math.floor(idx / size), c = idx % size;
    const br = Math.floor(r / boxRows) * boxRows, bc = Math.floor(c / boxCols) * boxCols;
    return ns.map((list, i) => {
      const rr = Math.floor(i / size), cc = i % size;
      const same = rr === r || cc === c || (rr >= br && rr < br + boxRows && cc >= bc && cc < bc + boxCols);
      return i === idx ? [] : same ? list.filter(v => v !== val) : list;
    });
  }, [level, size]);

  const place = useCallback((val: number) => {
    if (selected === null || given[selected] || board[selected] === solution[selected]) return;
    if (noteMode) {
      setNotes(ns => ns.map((list, i) => i !== selected ? list : list.includes(val) ? list.filter(v => v !== val) : [...list, val].sort()));
      return;
    }
    const nb = [...board];
    nb[selected] = val;
    setBoard(nb);
    if (val === solution[selected]) {
      playCorrect();
      setNotes(ns => clearNotesAround(ns, selected, val));
      if (nb.every((v, i) => v === solution[i])) finish(mistakes, hintsUsed);
    } else {
      playWrong();
      setMistakes(m => m + 1);
    }
  }, [selected, given, board, solution, noteMode, mistakes, hintsUsed, finish, clearNotesAround]);

  const erase = useCallback(() => {
    if (selected === null || given[selected] || board[selected] === solution[selected]) return;
    const nb = [...board];
    nb[selected] = 0;
    setBoard(nb);
    setNotes(ns => ns.map((list, i) => (i === selected ? [] : list)));
  }, [selected, given, board, solution]);

  const hint = useCallback(() => {
    if (hintsUsed >= MAX_HINTS) return;
    // 有選格子就提示那一格，沒有就找第一個還沒填對的
    let idx = selected !== null && board[selected] !== solution[selected] ? selected : -1;
    if (idx < 0) idx = board.findIndex((v, i) => v !== solution[i]);
    if (idx < 0) return;
    const nb = [...board];
    nb[idx] = solution[idx];
    setBoard(nb);
    setSelected(idx);
    setNotes(ns => clearNotesAround(ns, idx, solution[idx]));
    setHintsUsed(h => h + 1);
    playCorrect();
    if (nb.every((v, i) => v === solution[i])) finish(mistakes, hintsUsed + 1);
  }, [hintsUsed, selected, board, solution, mistakes, finish, clearNotesAround]);

  /* 鍵盤：數字、刪除、方向鍵 */
  useEffect(() => {
    if (mode !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^[1-9]$/.test(e.key) && Number(e.key) <= size) { e.preventDefault(); place(Number(e.key)); return; }
      if (e.key === "Backspace" || e.key === "Delete") { e.preventDefault(); erase(); return; }
      const move: Record<string, number> = { ArrowUp: -size, ArrowDown: size, ArrowLeft: -1, ArrowRight: 1 };
      if (move[e.key] !== undefined) {
        e.preventDefault();
        setSelected(s => {
          const cur = s ?? 0;
          if (e.key === "ArrowLeft" && cur % size === 0) return cur;
          if (e.key === "ArrowRight" && cur % size === size - 1) return cur;
          const n = cur + move[e.key];
          return n < 0 || n >= size * size ? cur : n;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, size, place, erase]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-purple-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">🔢</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">數獨</h1>
          <p className="text-slate-500 text-sm">6×6 和 9×9 數字數獨，每一題都只有一個答案</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>每一橫排、每一直排的數字都不能重複</li>
            <li>每一個粗線框起來的宮格裡，數字也不能重複</li>
            <li>6×6 填 1 到 6，9×9 填 1 到 9</li>
            <li>每一題都不用猜，一格一格推得出來</li>
            <li>填錯會變紅色並扣分；有 {MAX_HINTS} 次提示</li>
            <li>可以開「筆記」先記下可能的數字</li>
          </ul>
        </div>
        <div className="space-y-3">
          {LEVELS.map(lv => (
            <button key={lv.key} onClick={() => startGame(lv)}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-left cursor-pointer border-none hover:opacity-90 transition">
              <div className="text-lg">{lv.label}</div>
              <div className="text-xs opacity-80">{lv.desc}</div>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 text-center mt-4">
          還沒玩過數獨？先從<a href="/board-games/mini-sudoku" className="text-purple-500">4×4 的迷你數獨</a>開始。
        </p>
      </div>
    );
  }

  /* ─── Done ─── */
  if (mode === "done") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-purple-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center text-sm text-slate-500 mt-4">
          {level.label}・用時 {timerFmt}・填錯 {mistakes} 次・用了 {hintsUsed} 次提示
        </div>
        <GameOverScreen
          score={score} maxScore={100} gameName={`數獨 ${level.label}`} stars={getStars(score, 100)}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={() => startGame(level)} onBack={() => setMode("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "sudoku", activityName: "數獨", metadata: { level: level.key } }}
        />
      </div>
    );
  }

  /* ─── Playing ─── */
  const { boxRows, boxCols } = level.spec;
  const selVal = selected !== null ? board[selected] : 0;
  const selR = selected !== null ? Math.floor(selected / size) : -1;
  const selC = selected !== null ? selected % size : -1;
  const counts = Array.from({ length: size + 1 }, (_, v) => board.filter((x, i) => x === v && x === solution[i]).length);
  const noteCols = size === 9 ? 3 : 3;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 animate-fadeIn">
      <a href="/board-games" className="text-sm text-purple-500 hover:underline no-underline">← 返回桌遊專區</a>

      <div className="flex justify-between items-center mt-3 mb-3 text-sm">
        <span className="font-mono text-slate-500">⏱ {timerFmt}</span>
        <span className="text-slate-500">{level.label}</span>
        <span className="text-slate-500">填錯 {mistakes} 次</span>
      </div>

      {/* Board */}
      <div className="mx-auto border-2 border-slate-800 rounded-lg overflow-hidden bg-white select-none"
        style={{ width: "min(100vw - 32px, 450px)", display: "grid", gridTemplateColumns: `repeat(${size}, 1fr)` }}>
        {board.map((val, i) => {
          const r = Math.floor(i / size), c = i % size;
          const isSel = i === selected;
          const wrong = val !== 0 && val !== solution[i];
          const related = selected !== null && (r === selR || c === selC ||
            (Math.floor(r / boxRows) === Math.floor(selR / boxRows) && Math.floor(c / boxCols) === Math.floor(selC / boxCols)));
          const sameVal = selVal !== 0 && val === selVal;
          const thickR = (c + 1) % boxCols === 0 && c < size - 1;
          const thickB = (r + 1) % boxRows === 0 && r < size - 1;
          return (
            <button key={i} onClick={() => setSelected(i)}
              aria-label={`第 ${r + 1} 橫排第 ${c + 1} 直排${val ? `，${val}` : "，空格"}`}
              className={`relative aspect-square flex items-center justify-center p-0 cursor-pointer border-0 font-bold
                ${size === 9 ? "text-lg sm:text-2xl" : "text-2xl sm:text-3xl"}
                ${isSel ? "bg-purple-200" : wrong ? "bg-red-50" : sameVal ? "bg-purple-100" : related ? "bg-slate-100" : "bg-white"}
                ${wrong ? "text-red-500" : given[i] ? "text-slate-800" : "text-indigo-600"}`}
              style={{
                borderRight: c < size - 1 ? (thickR ? "2px solid #1e293b" : "1px solid #cbd5e1") : undefined,
                borderBottom: r < size - 1 ? (thickB ? "2px solid #1e293b" : "1px solid #cbd5e1") : undefined,
              }}>
              {val !== 0 ? val : notes[i]?.length > 0 ? (
                <span className="absolute inset-0.5 grid text-slate-400 font-normal leading-none"
                  style={{ gridTemplateColumns: `repeat(${noteCols}, 1fr)`, fontSize: size === 9 ? "9px" : "11px" }}>
                  {Array.from({ length: size }, (_, k) => k + 1).map(n => (
                    <span key={n} className="flex items-center justify-center">{notes[i].includes(n) ? n : ""}</span>
                  ))}
                </span>
              ) : ""}
            </button>
          );
        })}
      </div>

      {/* Number pad */}
      <div className="grid gap-1.5 mt-4 mx-auto" style={{ width: "min(100vw - 32px, 450px)", gridTemplateColumns: `repeat(${size}, 1fr)` }}>
        {Array.from({ length: size }, (_, k) => k + 1).map(n => {
          const full = counts[n] >= size;
          return (
            <button key={n} onClick={() => place(n)} disabled={full}
              className={`aspect-square rounded-lg border-2 font-bold text-xl sm:text-2xl p-0
                ${full ? "bg-slate-50 border-slate-100 text-slate-300" : "bg-white border-purple-200 text-purple-700 cursor-pointer hover:bg-purple-50 active:scale-95"}`}>
              {n}
            </button>
          );
        })}
      </div>

      {/* Tools */}
      <div className="flex gap-2 justify-center mt-3 flex-wrap">
        <button onClick={() => setNoteMode(v => !v)} aria-pressed={noteMode}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer border-2 ${noteMode ? "bg-purple-600 border-purple-600 text-white" : "bg-white border-slate-200 text-slate-600"}`}>
          ✏️ 筆記{noteMode ? "：開" : "：關"}
        </button>
        <button onClick={erase}
          className="px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer border-2 bg-white border-slate-200 text-slate-600 hover:bg-slate-50">
          🧽 清除
        </button>
        <button onClick={hint} disabled={hintsUsed >= MAX_HINTS}
          className="px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer border-2 bg-amber-50 border-amber-200 text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed">
          💡 提示（剩 {MAX_HINTS - hintsUsed}）
        </button>
      </div>

      <p className="text-xs text-slate-400 text-center mt-3">
        先點一格，再點下面的數字。{noteMode ? "筆記開著：點數字是記小字，不算作答。" : "用電腦可以直接按數字鍵和方向鍵。"}
      </p>
      <div className="text-center mt-2">
        <button onClick={() => setMode("menu")} className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-0 underline">放棄這一題，回選單</button>
      </div>
    </div>
  );
}
