"use client";
import { useState, useCallback, useEffect } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen, GamePage, BackToGames, GameIntro, StartTag, GAME_UI } from "@/lib/game-utils";
import { useTimer } from "@/lib/game-utils";
import { generateSudoku as generate, SPEC_4 } from "@/lib/sudoku";

/* ─── Sudoku Generator ─── */
const EMOJIS = ["🍎", "🍊", "🍇", "🍓"];
type Difficulty = "easy" | "medium" | "hard";

function generateSudoku(diff: Difficulty): { solution: number[][]; puzzle: (number | null)[][]; } {
  // 共用產生器保證：解答符合列、行、2×2 宮格三個規則，而且題目只有一個解、不用猜。
  // （舊版把整列隨機對調，會產生違反宮格規則的「解答」，孩子照規則填反而被判錯。）
  const givens = diff === "easy" ? 10 : diff === "medium" ? 8 : 6;
  const p = generate(SPEC_4, givens);
  const rows = (g: number[]) => Array.from({ length: 4 }, (_, r) => g.slice(r * 4, r * 4 + 4));
  return {
    solution: rows(p.solution).map(row => row.map(v => v - 1)),
    puzzle: rows(p.puzzle).map(row => row.map(v => (v === 0 ? null : v - 1))),
  };
}

const DIFF_OPTIONS: { key: Difficulty; label: string; desc: string }[] = [
  { key: "easy", label: "初級", desc: "16 格裡已經填好 10 格" },
  { key: "medium", label: "中級", desc: "16 格裡已經填好 8 格" },
  { key: "hard", label: "高級", desc: "16 格裡只填好 6 格" },
];

export default function MiniSudokuPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [diff, setDiff] = useState<Difficulty>("easy");
  const [solution, setSolution] = useState<number[][]>([]);
  const [puzzle, setPuzzle] = useState<(number | null)[][]>([]);
  const [board, setBoard] = useState<(number | null)[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [hints, setHints] = useState(3);
  const [score, setScore] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const { highScore, updateHighScore } = useHighScore("mini-sudoku");
  const { time, fmt: timerFmt, reset: resetTimer } = useTimer(mode === "playing");

  const startGame = useCallback((d: Difficulty) => {
    setDiff(d);
    const { solution: sol, puzzle: puz } = generateSudoku(d);
    setSolution(sol);
    setPuzzle(puz);
    setBoard(puz.map(row => [...row]));
    setSelected(null);
    setErrors(new Set());
    setHints(3);
    setScore(0);
    setMode("playing");
    resetTimer();
    setIsNewHigh(false);
  }, [resetTimer]);

  const isGiven = (r: number, c: number) => puzzle[r]?.[c] !== null;

  const checkComplete = useCallback((b: (number | null)[][]) => {
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++)
        if (b[r][c] === null || b[r][c] !== solution[r][c]) return false;
    return true;
  }, [solution]);

  const placeEmoji = useCallback((val: number) => {
    if (!selected || isGiven(selected[0], selected[1])) return;
    const [r, c] = selected;
    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = val;
    setBoard(newBoard);

    const key = `${r},${c}`;
    if (val !== solution[r][c]) {
      setErrors(prev => new Set(prev).add(key));
      playWrong();
    } else {
      const newErrors = new Set(errors);
      newErrors.delete(key);
      setErrors(newErrors);
      playCorrect();

      if (checkComplete(newBoard)) {
        // Calculate score: base 100 - time penalty - error penalty
        const timePenalty = Math.min(Math.floor(time / 6), 40); // 每 6 秒扣 1 分，最多扣 40
        const errorPenalty = errors.size * 5;
        const finalScore = Math.max(100 - timePenalty - errorPenalty, 10);
        setScore(finalScore);
        const newHigh = updateHighScore(finalScore);
        setIsNewHigh(newHigh);
        if (errors.size === 0 && time < 120) playPerfect();
        else playVictory();
        setMode("done");
      }
    }
  }, [selected, board, solution, puzzle, errors, time, checkComplete, updateHighScore]);

  const useHint = useCallback(() => {
    if (hints <= 0) return;
    // Find an empty or wrong cell
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!isGiven(r, c) && board[r][c] !== solution[r][c]) {
          const newBoard = board.map(row => [...row]);
          newBoard[r][c] = solution[r][c];
          setBoard(newBoard);
          const newErrors = new Set(errors);
          newErrors.delete(`${r},${c}`);
          setErrors(newErrors);
          setHints(h => h - 1);
          playCorrect();
          if (checkComplete(newBoard)) {
            const finalScore = Math.max(60 - Math.min(Math.floor(time / 6), 30) - errors.size * 5, 10);
            setScore(finalScore);
            const newHigh = updateHighScore(finalScore);
            setIsNewHigh(newHigh);
            playVictory();
            setMode("done");
          }
          return;
        }
      }
    }
  }, [hints, board, solution, puzzle, errors, time, checkComplete, updateHighScore]);

  const clearCell = useCallback(() => {
    if (!selected || isGiven(selected[0], selected[1])) return;
    const [r, c] = selected;
    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = null;
    setBoard(newBoard);
    const newErrors = new Set(errors);
    newErrors.delete(`${r},${c}`);
    setErrors(newErrors);
  }, [selected, board, puzzle, errors]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <GamePage>
        <BackToGames />
        <GameIntro gameId="mini-sudoku" title="迷你數獨" desc="4×4 水果數獨，每一橫排、直排、宮格都不重複" />
        <div className={`${GAME_UI.rules} mb-5`}>
          <h3 className={GAME_UI.rulesTitle}>遊戲規則</h3>
          <ul className={GAME_UI.rulesList}>
            <li>每一橫排 4 種水果各出現一次</li>
            <li>每一直排 4 種水果各出現一次</li>
            <li>每個 2x2 宮格 4 種水果各一次</li>
            <li>水果：{EMOJIS.join(" ")}</li>
            <li>每一題都只有一個答案，不用猜</li>
            <li>錯誤越少、完成越快，分數越高</li>
          </ul>
        </div>
        <div className="text-sm font-bold text-[#263238] mb-2">選擇難度</div>
        <div className="space-y-3">
          {DIFF_OPTIONS.map(d => (
            <button key={d.key} onClick={() => startGame(d.key)}
              className={GAME_UI.diffBtn}>
              <div>
                <div className={GAME_UI.diffLabel}>{d.label}</div>
                <div className={GAME_UI.diffDesc}>{d.desc}</div>
              </div>
              <StartTag />
            </button>
          ))}
        </div>
      </GamePage>
    );
  }

  /* ─── Done ─── */
  if (mode === "done") {
    const stars = getStars(score, 100);
    return (
      <GamePage>
        <BackToGames />
        <GameOverScreen
          score={score} maxScore={100} gameName="迷你數獨" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={() => startGame(diff)} onBack={() => setMode("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "mini-sudoku", activityName: "迷你數獨" }}
        />
      </GamePage>
    );
  }

  /* ─── Playing ─── */
  return (
    <GamePage>
      <BackToGames />
      <h1 className="text-xl sm:text-2xl font-black text-[#263238] mt-2 mb-1">迷你數獨</h1>
      <p className="text-sm text-[#52616B] m-0 mb-3">每一橫排、直排與 2×2 宮格，四種水果各出現一次。</p>

      {/* Header */}
      <div className="flex justify-between items-center gap-2 mb-4">
        <div className={GAME_UI.chip}>時間 <b className="font-mono">{timerFmt}</b></div>
        <button onClick={useHint} disabled={hints <= 0}
          className="text-sm px-4 py-2 rounded-xl bg-[#2457A7] text-white font-bold cursor-pointer border-none hover:bg-[#1d4688] disabled:opacity-40">
          💡 提示 ({hints})
        </button>
      </div>

      {/* Board */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-5">
        <div className="grid grid-cols-4 gap-0 max-w-[280px] mx-auto border-2 border-slate-800 rounded-lg overflow-hidden">
          {board.map((row, r) =>
            row.map((val, c) => {
              const given = isGiven(r, c);
              const isSelected = selected?.[0] === r && selected?.[1] === c;
              const hasError = errors.has(`${r},${c}`);
              const borderR = c === 1 ? "border-r-2 border-r-slate-800" : c < 3 ? "border-r border-r-slate-300" : "";
              const borderB = r === 1 ? "border-b-2 border-b-slate-800" : r < 3 ? "border-b border-b-slate-300" : "";
              return (
                <button key={`${r}-${c}`}
                  onClick={() => !given && setSelected([r, c])}
                  className={`w-[70px] h-[70px] flex items-center justify-center text-2xl cursor-pointer border-none transition-colors
                    ${borderR} ${borderB}
                    ${given ? "bg-slate-100" : isSelected ? "bg-[#CFE0F7]" : hasError ? "bg-red-50" : "bg-white hover:bg-[#F3F7FD]"}
                  `}>
                  {val !== null ? EMOJIS[val] : ""}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Emoji Input */}
      <div className="flex gap-2 sm:gap-3 justify-center mb-4">
        {EMOJIS.map((emoji, i) => (
          <button key={i} onClick={() => placeEmoji(i)}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border-2 border-slate-200 text-2xl cursor-pointer hover:border-[#2457A7] hover:bg-[#F3F7FD] transition">
            {emoji}
          </button>
        ))}
        <button onClick={clearCell}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border-2 border-slate-200 text-lg cursor-pointer hover:border-red-300 hover:bg-red-50 transition">
          🗑️
        </button>
      </div>

      {selected && (
        <div className="text-center text-xs text-[#52616B]">
          已選取第 {selected[0] + 1} 橫排、第 {selected[1] + 1} 直排
        </div>
      )}
    </GamePage>
  );
}
