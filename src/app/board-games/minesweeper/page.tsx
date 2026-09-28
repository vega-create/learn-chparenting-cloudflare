"use client";
import { useState, useCallback, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen, useTimer } from "@/lib/game-utils";
import { generateBoard, floodReveal, neighbors, type MineBoard } from "@/lib/minesweeper";

/**
 * 踩地雷。
 *
 * 和一般版本不同的地方：
 * - 第一次點擊之後才埋雷，第一下一定安全，而且會翻開一片。
 * - 每一盤都先用推理程式解過，確定不用猜（見 @/lib/minesweeper）。
 * - 手機沒有右鍵，所以有「挖開／插旗」切換；也可以長按插旗。
 */

type LevelKey = "easy" | "medium" | "hard";
interface LevelDef { key: LevelKey; label: string; desc: string; rows: number; cols: number; mines: number; parSeconds: number }

const LEVELS: LevelDef[] = [
  { key: "easy", label: "初級", desc: "6×6，5 顆地雷", rows: 6, cols: 6, mines: 5, parSeconds: 90 },
  { key: "medium", label: "中級", desc: "8×8，10 顆地雷", rows: 8, cols: 8, mines: 10, parSeconds: 210 },
  { key: "hard", label: "高級", desc: "10×10，18 顆地雷", rows: 10, cols: 10, mines: 18, parSeconds: 420 },
];

const NUM_COLOR = ["", "text-blue-600", "text-emerald-600", "text-red-500", "text-indigo-700", "text-amber-700", "text-cyan-700", "text-slate-800", "text-slate-500"];
const LONG_PRESS_MS = 450;

export default function MinesweeperPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [level, setLevel] = useState<LevelDef>(LEVELS[0]);
  const [board, setBoard] = useState<MineBoard | null>(null);   // 第一次點擊前是 null
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [flagged, setFlagged] = useState<boolean[]>([]);
  const [flagMode, setFlagMode] = useState(false);
  const [outcome, setOutcome] = useState<"won" | "lost" | null>(null);
  const [boom, setBoom] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const { highScore, updateHighScore } = useHighScore(`minesweeper-${level.key}`);
  const { time, fmt: timerFmt, reset: resetTimer } = useTimer(mode === "playing" && board !== null && outcome === null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressed = useRef(false);

  const total = level.rows * level.cols;

  const startGame = useCallback((lv: LevelDef) => {
    const n = lv.rows * lv.cols;
    setLevel(lv);
    setBoard(null);
    setRevealed(new Array(n).fill(false));
    setFlagged(new Array(n).fill(false));
    setFlagMode(false);
    setOutcome(null);
    setBoom(null);
    setScore(0);
    setIsNewHigh(false);
    resetTimer();
    setMode("playing");
  }, [resetTimer]);

  const win = useCallback(() => {
    const over = Math.max(0, time - level.parSeconds);
    const final = 60 + Math.max(0, 40 - Math.floor(over / 5));
    setScore(final);
    setIsNewHigh(updateHighScore(final));
    setOutcome("won");
    if (final >= 95) playPerfect(); else playVictory();
  }, [time, level, updateHighScore]);

  const lose = useCallback((b: MineBoard, rev: boolean[], at: number) => {
    const safeTotal = total - level.mines;
    const opened = rev.filter((v, i) => v && !b.mines[i]).length;
    const final = Math.round((opened / safeTotal) * 40);
    setScore(final);
    setIsNewHigh(updateHighScore(final));
    setBoom(at);
    setOutcome("lost");
    playWrong();
  }, [total, level, updateHighScore]);

  /** 翻開一批格子，處理踩雷和過關 */
  const open = useCallback((b: MineBoard, targets: number[]) => {
    const rev = [...revealed];
    for (const i of targets) {
      if (rev[i] || flagged[i]) continue;
      if (b.mines[i]) { setRevealed(rev); lose(b, rev, i); return; }
      floodReveal(b, rev, i);
    }
    setRevealed(rev);
    // 被連帶翻開的格子上如果有旗子，拿掉
    setFlagged(f => f.map((v, i) => v && !rev[i]));
    if (rev.filter(Boolean).length === total - level.mines) win();
    else playCorrect();
  }, [revealed, flagged, total, level, win, lose]);

  const toggleFlag = useCallback((i: number) => {
    if (outcome || revealed[i] || !board) return;
    setFlagged(f => f.map((v, k) => (k === i ? !v : v)));
  }, [outcome, revealed, board]);

  const tap = useCallback((i: number) => {
    if (outcome) return;
    if (longPressed.current) { longPressed.current = false; return; }
    if (!board) {
      // 第一下：現在才埋雷
      const b = generateBoard(level.rows, level.cols, level.mines, i);
      setBoard(b);
      const rev = new Array(total).fill(false);
      floodReveal(b, rev, i);
      setRevealed(rev);
      playCorrect();
      return;
    }
    if (revealed[i]) {
      // 點已經翻開的數字：周圍旗子數剛好等於數字時，把其他格一次翻開
      const ns = neighbors(level.rows, level.cols, i);
      if (board.counts[i] > 0 && ns.filter(q => flagged[q]).length === board.counts[i]) {
        open(board, ns.filter(q => !revealed[q] && !flagged[q]));
      }
      return;
    }
    if (flagMode) { toggleFlag(i); return; }
    if (flagged[i]) return;   // 插了旗的格子要先拔旗才能挖，避免手滑
    open(board, [i]);
  }, [outcome, board, level, total, revealed, flagged, flagMode, toggleFlag, open]);

  const pressStart = (i: number) => {
    longPressed.current = false;
    if (!board || outcome) return;   // 還沒開始或已經結束就不處理長按，免得下一次點擊被吃掉
    if (pressTimer.current) clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => { longPressed.current = true; toggleFlag(i); }, LONG_PRESS_MS);
  };
  const pressEnd = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-red-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">💣</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">踩地雷</h1>
          <p className="text-slate-500 text-sm">看數字推理，把沒有地雷的格子全部翻開</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>數字代表「周圍一圈 8 格裡有幾顆地雷」</li>
            <li>第一下一定安全，每一盤都不用猜</li>
            <li>確定是地雷的格子可以插旗 🚩 做記號</li>
            <li>手機：切到「插旗」再點，或是長按格子</li>
            <li>電腦：按滑鼠右鍵插旗</li>
            <li>把沒有地雷的格子全部翻開就過關</li>
          </ul>
        </div>
        <div className="space-y-3">
          {LEVELS.map(lv => (
            <button key={lv.key} onClick={() => startGame(lv)}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold text-left cursor-pointer border-none hover:opacity-90 transition">
              <div className="text-lg">{lv.label}</div>
              <div className="text-xs opacity-80">{lv.desc}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ─── Done ─── */
  if (mode === "done") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-red-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center text-sm text-slate-500 mt-4">
          {level.label}・{outcome === "won" ? `過關！用時 ${timerFmt}` : "踩到地雷了，分數依翻開的格數計算"}
        </div>
        <GameOverScreen
          score={score} maxScore={100} gameName={`踩地雷 ${level.label}`} stars={getStars(score, 100)}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={() => startGame(level)} onBack={() => setMode("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "minesweeper", activityName: "踩地雷", metadata: { level: level.key, won: outcome === "won" } }}
        />
      </div>
    );
  }

  /* ─── Playing ─── */
  const flagsLeft = level.mines - flagged.filter(Boolean).length;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 animate-fadeIn">
      <a href="/board-games" className="text-sm text-red-500 hover:underline no-underline">← 返回桌遊專區</a>

      <div className="flex justify-between items-center mt-3 mb-3 text-sm">
        <span className="font-mono text-slate-500">⏱ {timerFmt}</span>
        <span className="text-slate-500">{level.label}</span>
        <span className="text-slate-500">🚩 還剩 {flagsLeft}</span>
      </div>

      <p className="text-sm text-center mb-3 h-5" aria-live="polite">
        {outcome === "won" ? <span className="text-emerald-600 font-bold">全部翻開了，過關！</span>
          : outcome === "lost" ? <span className="text-red-500 font-bold">踩到地雷了！看看地雷在哪裡</span>
          : !board ? <span className="text-slate-500">隨便點一格開始，第一下一定安全</span>
          : <span className="text-slate-400">{flagMode ? "插旗模式：點格子插旗或拔旗" : "挖開模式：點格子翻開"}</span>}
      </p>

      {/* Board */}
      <div className="mx-auto grid gap-0.5 bg-slate-300 border-2 border-slate-400 rounded-lg overflow-hidden select-none"
        style={{ width: "min(100vw - 32px, 440px)", gridTemplateColumns: `repeat(${level.cols}, 1fr)`, touchAction: "manipulation" }}
        onContextMenu={e => e.preventDefault()}>
        {revealed.map((rev, i) => {
          const isMine = !!board?.mines[i];
          const showMine = outcome === "lost" && isMine;
          const wrongFlag = outcome === "lost" && flagged[i] && !isMine;
          const n = board?.counts[i] ?? 0;
          return (
            <button key={i}
              onClick={() => tap(i)}
              onContextMenu={e => { e.preventDefault(); toggleFlag(i); }}
              onPointerDown={e => { if (e.pointerType !== "mouse") pressStart(i); }}
              onPointerUp={pressEnd} onPointerLeave={pressEnd} onPointerCancel={pressEnd}
              aria-label={rev ? (n > 0 ? `${n}` : "空") : flagged[i] ? "旗子" : "還沒翻開"}
              className={`aspect-square flex items-center justify-center p-0 border-0 font-black
                ${level.cols >= 10 ? "text-base sm:text-xl" : "text-xl sm:text-2xl"}
                ${i === boom ? "bg-red-400" : rev || showMine ? "bg-slate-50" : "bg-sky-200 hover:bg-sky-100 cursor-pointer active:bg-sky-300"}
                ${rev ? NUM_COLOR[n] : ""}`}
              style={{ WebkitTouchCallout: "none" }}>
              {showMine ? "💣" : wrongFlag ? "❌" : flagged[i] && !rev ? "🚩" : rev && n > 0 ? n : ""}
            </button>
          );
        })}
      </div>

      {/* Controls */}
      {outcome === null ? (
        <>
          <div className="grid grid-cols-2 gap-2 mt-4 mx-auto" style={{ width: "min(100vw - 32px, 440px)" }}>
            <button onClick={() => setFlagMode(false)} aria-pressed={!flagMode}
              className={`py-3 rounded-xl font-bold cursor-pointer border-2 ${!flagMode ? "bg-slate-700 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-600"}`}>
              ⛏️ 挖開
            </button>
            <button onClick={() => setFlagMode(true)} aria-pressed={flagMode}
              className={`py-3 rounded-xl font-bold cursor-pointer border-2 ${flagMode ? "bg-red-500 border-red-500 text-white" : "bg-white border-slate-200 text-slate-600"}`}>
              🚩 插旗
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center mt-3">
            點已經翻開的數字：如果周圍的旗子數量剛好等於那個數字，會把其他格一次翻開。
          </p>
          <div className="text-center mt-2">
            <button onClick={() => setMode("menu")} className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-0 underline">放棄這一盤，回選單</button>
          </div>
        </>
      ) : (
        <div className="flex gap-3 justify-center mt-4 flex-wrap">
          <button onClick={() => setMode("done")} className="px-6 py-3 rounded-xl bg-orange-500 text-white font-bold cursor-pointer border-none hover:bg-orange-600">看成績</button>
          <button onClick={() => startGame(level)} className="px-6 py-3 rounded-xl bg-white border-2 border-slate-300 text-slate-600 font-bold cursor-pointer hover:bg-slate-50">再玩一盤</button>
        </div>
      )}
    </div>
  );
}
