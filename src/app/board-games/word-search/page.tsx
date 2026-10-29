"use client";
import { useState, useCallback, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen, shuffle, GamePage, BackToGames, GameIntro, StartTag, GAME_UI } from "@/lib/game-utils";

/* ─── Types ─── */
const GRID_SIZE = 10;

type Direction = [number, number];
// 所有方向都是「由左到右」或「由上到下」讀的。
// 原本還有由右到左、往左下的方向，單字等於倒著寫，對國小孩子太難。
type Level = "easy" | "normal";
const DIRECTIONS: Record<Level, Direction[]> = {
  easy: [
    [0, 1],   // 橫的
    [1, 0],   // 直的
  ],
  normal: [
    [0, 1],   // 橫的
    [1, 0],   // 直的
    [1, 1],   // 往右下斜
    [-1, 1],  // 往右上斜
  ],
};
const LEVEL_OPTIONS: { key: Level; label: string; desc: string; words: number }[] = [
  { key: "easy", label: "初級", desc: "5 個單字，只有橫的和直的", words: 5 },
  { key: "normal", label: "中級", desc: "6 個單字，還有斜的", words: 6 },
];

/** a 到 b 連成一直線（橫、直、斜 45 度）經過的格子；不在同一直線上回傳 null */
function lineCells(a: [number, number], b: [number, number]): [number, number][] | null {
  const dr = b[0] - a[0], dc = b[1] - a[1];
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;
  const n = Math.max(Math.abs(dr), Math.abs(dc));
  const sr = Math.sign(dr), sc = Math.sign(dc);
  return Array.from({ length: n + 1 }, (_, i) => [a[0] + sr * i, a[1] + sc * i] as [number, number]);
}

interface PlacedWord {
  word: string;
  cells: [number, number][];
  found: boolean;
}

interface PuzzleData {
  grid: string[][];
  words: PlacedWord[];
}

/* ─── Word Sets ─── */
const WORD_SETS = [
  ["APPLE", "GRAPE", "LEMON", "MANGO", "PEACH", "PLUM", "BERRY", "CHERRY"],
  ["TIGER", "HORSE", "SNAKE", "EAGLE", "WHALE", "MOUSE", "SHARK", "PANDA"],
  // 這幾組原本有 SHELF、TEMPO、CHORD、IVORY、BLUSH、AMBER 這類國小不會的字，換成常見的
  ["TABLE", "CHAIR", "CLOCK", "DESK", "SOFA", "LIGHT", "DOOR", "PLANT"],
  ["OCEAN", "RIVER", "CLOUD", "STORM", "BEACH", "STONE", "EARTH", "GRASS"],
  ["PIANO", "DRUMS", "FLUTE", "SONGS", "DANCE", "MUSIC", "VOICE", "RADIO"],
  ["BREAD", "SALAD", "PASTA", "CREAM", "JUICE", "TOAST", "STEAK", "CANDY"],
  ["TRAIN", "PLANE", "BIKE", "TRUCK", "SPEED", "DRIVE", "ROAD", "WHEEL"],
  ["GREEN", "WHITE", "BLACK", "BROWN", "PINK", "BLUE", "GRAY", "ORANGE"],
];

function generatePuzzle(setIndex: number, level: Level): PuzzleData {
  const wordSet = WORD_SETS[setIndex % WORD_SETS.length];
  const selectedWords = shuffle([...wordSet]).slice(0, LEVEL_OPTIONS.find(l => l.key === level)!.words);

  // Initialize grid with empty
  const grid: string[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => "")
  );

  const placedWords: PlacedWord[] = [];

  // Try to place each word
  for (const word of selectedWords) {
    let placed = false;
    const shuffledDirs = shuffle([...DIRECTIONS[level]]);

    for (let attempt = 0; attempt < 100 && !placed; attempt++) {
      const dir = shuffledDirs[attempt % shuffledDirs.length];
      const [dr, dc] = dir;

      // Calculate valid start range
      const maxR = dr >= 0 ? GRID_SIZE - dr * (word.length - 1) : GRID_SIZE;
      const minR = dr < 0 ? -dr * (word.length - 1) : 0;
      const maxC = dc >= 0 ? GRID_SIZE - dc * (word.length - 1) : GRID_SIZE;
      const minC = dc < 0 ? -dc * (word.length - 1) : 0;

      if (minR >= maxR || minC >= maxC) continue;

      const startR = Math.floor(Math.random() * (maxR - minR)) + minR;
      const startC = Math.floor(Math.random() * (maxC - minC)) + minC;

      // Check if word fits
      let canPlace = true;
      const cells: [number, number][] = [];
      for (let i = 0; i < word.length; i++) {
        const r = startR + dr * i;
        const c = startC + dc * i;
        if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) { canPlace = false; break; }
        if (grid[r][c] !== "" && grid[r][c] !== word[i]) { canPlace = false; break; }
        cells.push([r, c]);
      }

      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          const [r, c] = cells[i];
          grid[r][c] = word[i];
        }
        placedWords.push({ word, cells, found: false });
        placed = true;
      }
    }
  }

  // Fill empty cells with random letters
  const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      }
    }
  }

  return { grid, words: placedWords };
}

export default function WordSearchPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [puzzleSet, setPuzzleSet] = useState(0);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [wordsFound, setWordsFound] = useState(0);
  const [feedback, setFeedback] = useState<{ type: "correct" | "wrong"; msg: string } | null>(null);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [time, setTime] = useState(0);
  const { highScore, updateHighScore } = useHighScore("word-search");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isDragging = useRef(false);
  const [level, setLevel] = useState<Level>("easy");
  const [anchor, setAnchor] = useState<[number, number] | null>(null);   // 第一個點的字母
  const hoverRef = useRef<[number, number] | null>(null);
  const movedRef = useRef(false);
  const [hintCell, setHintCell] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const startGame = useCallback((lv: Level) => {
    setLevel(lv);
    setAnchor(null);
    setHintCell(null);
    setHintsUsed(0);
    const setIdx = Math.floor(Math.random() * WORD_SETS.length);
    setPuzzleSet(setIdx);
    const p = generatePuzzle(setIdx, lv);
    setPuzzle(p);
    setSelectedCells(new Set());
    setFoundCells(new Set());
    setScore(0);
    setWordsFound(0);
    setFeedback(null);
    setIsNewHigh(false);
    setTime(0);
    setMode("playing");

    if (timerRef.current) clearInterval(timerRef.current);
    let t = 0;
    timerRef.current = setInterval(() => {
      t++;
      setTime(t);
    }, 1000);
  }, []);

  const checkSelection = useCallback((selArray: [number, number][]) => {
    if (!puzzle) return;

    // Check if selection matches any unfound word
    let matchFound = false;
    const updatedWords = puzzle.words.map(pw => {
      if (pw.found) return pw;
      if (pw.cells.length !== selArray.length) return pw;

      // Check forward match
      const forwardMatch = pw.cells.every((cell, i) => cell[0] === selArray[i][0] && cell[1] === selArray[i][1]);
      // Check reverse match
      const reverseMatch = pw.cells.every((cell, i) => {
        const ri = selArray.length - 1 - i;
        return cell[0] === selArray[ri][0] && cell[1] === selArray[ri][1];
      });

      if (forwardMatch || reverseMatch) {
        matchFound = true;
        return { ...pw, found: true };
      }
      return pw;
    });

    if (matchFound) {
      playCorrect();
      const newFoundCells = new Set(foundCells);
      selArray.forEach(([r, c]) => newFoundCells.add(`${r},${c}`));
      setFoundCells(newFoundCells);

      const newPuzzle = { ...puzzle, words: updatedWords };
      setPuzzle(newPuzzle);

      const newWordsFound = wordsFound + 1;
      setWordsFound(newWordsFound);
      const pts = 15;
      const newScore = score + pts;
      setScore(newScore);
      setFeedback({ type: "correct", msg: `找到了！+${pts}分` });
      setTimeout(() => setFeedback(null), 1000);

      // Check if all found
      const allFound = updatedWords.every(w => w.found);
      if (allFound) {
        if (timerRef.current) clearInterval(timerRef.current);
        const timeBonus = Math.max(30 - Math.floor(time / 10), 0);
        const finalScore = newScore + timeBonus;
        setScore(finalScore);
        const newHigh = updateHighScore(finalScore);
        setIsNewHigh(newHigh);
        if (finalScore >= 100) playPerfect();
        else playVictory();
        setTimeout(() => setMode("done"), 800);
      }
    } else {
      setFeedback({ type: "wrong", msg: "不是正確的單字" });
      setTimeout(() => setFeedback(null), 800);
    }

    setSelectedCells(new Set());
    setHintCell(null);
  }, [puzzle, foundCells, wordsFound, score, time, updateHighScore]);

  /*
   * 選取方式（兩種都可以）：
   * 1. 點單字的第一個字母，再點最後一個字母。
   * 2. 從第一個字母按住，拖到最後一個字母再放開。
   * 兩種都只看頭尾兩格，中間自動連成直線，手指稍微歪掉也不會選錯。
   * （原本是把滑過的每一格都加進去，斜的很容易多選到旁邊的格子；
   *   觸控時手指滑到別格也收不到事件，手機上幾乎選不起來。）
   */
  const cellFromPoint = (x: number, y: number): [number, number] | null => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    const cell = el?.closest("[data-cell]") as HTMLElement | null;
    if (!cell?.dataset.cell) return null;
    const [r, c] = cell.dataset.cell.split(",").map(Number);
    return [r, c];
  };

  const tryLine = useCallback((a: [number, number], b: [number, number]) => {
    const line = lineCells(a, b);
    if (!line) {
      setFeedback({ type: "wrong", msg: "兩個字母要在同一條直線上（橫、直或斜）" });
      setTimeout(() => setFeedback(null), 1500);
      setSelectedCells(new Set());
    } else if (line.length >= 2) {
      checkSelection(line);
    } else {
      setSelectedCells(new Set());
    }
    setAnchor(null);
  }, [checkSelection]);

  const handleCellPointerDown = useCallback((r: number, c: number) => {
    if (anchor && !(anchor[0] === r && anchor[1] === c)) {
      // 已經點過第一個字母，這次點的是最後一個字母
      isDragging.current = false;
      tryLine(anchor, [r, c]);
      return;
    }
    isDragging.current = true;
    movedRef.current = false;
    hoverRef.current = [r, c];
    setAnchor([r, c]);
    setSelectedCells(new Set([`${r},${c}`]));
  }, [anchor, tryLine]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !anchor) return;
    const cell = cellFromPoint(e.clientX, e.clientY);
    if (!cell) return;
    if (cell[0] !== anchor[0] || cell[1] !== anchor[1]) movedRef.current = true;
    if (hoverRef.current && hoverRef.current[0] === cell[0] && hoverRef.current[1] === cell[1]) return;
    hoverRef.current = cell;
    const line = lineCells(anchor, cell);
    setSelectedCells(new Set((line ?? [anchor]).map(([r, c]) => `${r},${c}`)));
  }, [anchor]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    // 有拖曳就直接判斷；只是點一下的話，留著第一個字母等下一次點
    if (movedRef.current && anchor && hoverRef.current) tryLine(anchor, hoverRef.current);
  }, [anchor, tryLine]);

  /** 提示：把一個還沒找到的單字的第一個字母亮起來 */
  const showHint = useCallback(() => {
    const target = puzzle?.words.find(w => !w.found);
    if (!target) return;
    setHintCell(`${target.cells[0][0]},${target.cells[0][1]}`);
    setHintsUsed(h => h + 1);
    setScore(s => Math.max(s - 5, 0));
  }, [puzzle]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <GamePage>
        <BackToGames />
        <GameIntro gameId="word-search" title="單字搜尋" desc="在字母方格中找出隱藏的英文單字" />
        <div className={`${GAME_UI.rules} mb-5`}>
          <h3 className={GAME_UI.rulesTitle}>遊戲規則</h3>
          <ul className={GAME_UI.rulesList}>
            <li>10x10 字母方格中隱藏了英文單字</li>
            <li>點單字的第一個字母，再點最後一個字母；也可以直接拖曳</li>
            <li>單字都是由左到右或由上到下，不會倒著寫</li>
            <li>找不到可以按「提示」，會亮出第一個字母（扣 5 分）</li>
            <li>找到所有單字即完成</li>
            <li>速度越快，得分越高</li>
            <li>最高紀錄：{highScore} 分</li>
          </ul>
        </div>
        <div className="text-sm font-bold text-[#263238] mb-2">選擇難度</div>
        <div className="space-y-3">
          {LEVEL_OPTIONS.map(d => (
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
    const maxScore = (puzzle?.words.length || 6) * 15 + 30;
    const stars = getStars(score, maxScore);
    return (
      <GamePage>
        <BackToGames />
        <div className="text-center text-sm text-[#52616B] mt-4 mb-2">
          找到 {wordsFound} 個字 ・ 用時 {formatTime(time)}
        </div>
        <GameOverScreen
          score={score} maxScore={maxScore} gameName="單字搜尋" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={() => startGame(level)} onBack={() => setMode("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "word-search", activityName: "單字搜尋" }}
        />
      </GamePage>
    );
  }

  /* ─── Playing ─── */
  return (
    <GamePage>
    <div onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} onPointerCancel={handlePointerUp}>
      <BackToGames />
      <h1 className="text-xl font-black text-[#263238] mt-2 mb-3">單字搜尋</h1>

      {/* Header */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className={GAME_UI.chip}>找到 <b>{wordsFound}/{puzzle?.words.length || 0}</b></div>
        <div className={GAME_UI.chip}>時間 <b className="font-mono">{formatTime(time)}</b></div>
        <div className={GAME_UI.chip}>得分 <b className="text-[#2457A7]">{score}</b></div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`text-center text-sm font-bold mb-2 animate-fadeIn ${feedback.type === "correct" ? "text-green-500" : "text-red-500"}`}>
          {feedback.msg}
        </div>
      )}

      {/* Word List */}
      {puzzle && (
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {puzzle.words.map((pw, i) => (
            <span key={i} className={`text-sm px-3 py-1 rounded-full font-bold transition-all
              ${pw.found
                ? "bg-green-100 text-green-600 line-through"
                : "bg-[#EAF0F9] text-[#2457A7]"
              }
            `}>
              {pw.word}
            </span>
          ))}
        </div>
      )}

      {/* Grid */}
      {puzzle && (
        <div className="bg-white rounded-2xl p-3 border border-slate-200 select-none touch-none">
          <div className="grid mx-auto" style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            maxWidth: GRID_SIZE * 36,
            gap: 2,
          }}>
            {puzzle.grid.map((row, r) =>
              row.map((letter, c) => {
                const key = `${r},${c}`;
                const isSelected = selectedCells.has(key);
                const isFound = foundCells.has(key);
                return (
                  <button
                    key={key}
                    data-cell={key}
                    onPointerDown={(e) => { e.preventDefault(); handleCellPointerDown(r, c); }}
                    className={`aspect-square rounded-md flex items-center justify-center font-bold text-sm sm:text-base cursor-pointer border transition-all select-none
                      ${isSelected
                        ? "bg-[#2457A7] border-[#1d4688] text-white scale-105"
                        : isFound
                          ? "bg-green-200 border-green-400 text-green-800"
                          : hintCell === key
                            ? "bg-amber-200 border-amber-400 text-amber-900 animate-pulse"
                          : "bg-slate-50 border-slate-200 text-[#263238] hover:bg-[#F3F7FD] hover:border-[#2457A7]"
                      }
                    `}
                    style={{ touchAction: "none" }}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      <p className="text-center text-sm text-[#52616B] mt-3 h-5" aria-live="polite">
        {anchor ? "再點這個單字的最後一個字母" : "點單字的第一個字母，或直接拖曳"}
      </p>
      <div className="text-center mt-2">
        <button onClick={showHint}
          className={`px-4 py-2 text-sm ${GAME_UI.secondaryBtn}`}>
          💡 提示第一個字母（-5 分{hintsUsed > 0 ? `，已用 ${hintsUsed} 次` : ""}）
        </button>
      </div>
    </div>
    </GamePage>
  );
}
