"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen, shuffle, GamePage, BackToGames, GameIntro, StartTag, GAME_UI } from "@/lib/game-utils";
import { useTimer } from "@/lib/game-utils";

/* ─── Types ─── */
type Difficulty = "easy" | "medium" | "hard";

interface Card {
  id: number;
  emoji: string;
  pairId: number;
  flipped: boolean;
  matched: boolean;
}

const ALL_EMOJIS = ["🐶", "🐱", "🐰", "🐻", "🦊", "🐼", "🐨", "🦁", "🐸", "🐙"];
const DIFF_CONFIG: Record<Difficulty, { cols: number; rows: number; pairs: number }> = {
  easy: { cols: 4, rows: 3, pairs: 6 },
  medium: { cols: 4, rows: 4, pairs: 8 },
  hard: { cols: 5, rows: 4, pairs: 10 },
};

const DIFF_OPTIONS: { key: Difficulty; label: string; desc: string }[] = [
  { key: "easy", label: "初級", desc: "3x4（6 對）" },
  { key: "medium", label: "中級", desc: "4x4（8 對）" },
  { key: "hard", label: "高級", desc: "4x5（10 對）" },
];

function createCards(pairs: number): Card[] {
  const emojis = shuffle(ALL_EMOJIS).slice(0, pairs);
  const cards: Card[] = [];
  emojis.forEach((emoji, i) => {
    cards.push({ id: i * 2, emoji, pairId: i, flipped: false, matched: false });
    cards.push({ id: i * 2 + 1, emoji, pairId: i, flipped: false, matched: false });
  });
  return shuffle(cards);
}

export default function MemoryMatchPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [diff, setDiff] = useState<Difficulty>("easy");
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [score, setScore] = useState(0);
  const { highScore, updateHighScore } = useHighScore("memory-match");
  const { time, fmt: timerFmt, reset: resetTimer } = useTimer(mode === "playing");
  const totalPairs = DIFF_CONFIG[diff].pairs;

  const startGame = useCallback((d: Difficulty) => {
    setDiff(d);
    const config = DIFF_CONFIG[d];
    setCards(createCards(config.pairs));
    setFlippedIds([]);
    setMoves(0);
    setMatchedPairs(0);
    setIsChecking(false);
    setMode("playing");
    resetTimer();
    setIsNewHigh(false);
    setScore(0);
  }, [resetTimer]);

  const handleFlip = useCallback((cardId: number) => {
    if (isChecking) return;
    if (flippedIds.length >= 2) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.flipped || card.matched) return;

    const newFlipped = [...flippedIds, cardId];
    setFlippedIds(newFlipped);
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, flipped: true } : c));

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsChecking(true);

      const [id1, id2] = newFlipped;
      const card1 = cards.find(c => c.id === id1)!;
      const card2 = cards.find(c => c.id === id2)!;

      if (card1.pairId === card2.pairId) {
        // Match!
        playCorrect();
        const newMatched = matchedPairs + 1;
        setMatchedPairs(newMatched);
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.pairId === card1.pairId ? { ...c, matched: true, flipped: true } : c
          ));
          setFlippedIds([]);
          setIsChecking(false);

          if (newMatched === totalPairs) {
            // Game complete
            const maxMoves = totalPairs * 3;
            const moveScore = Math.max(100 - (moves + 1 - totalPairs) * 3, 20);
            const timeScore = Math.max(50 - Math.floor(time / 5), 0);
            const finalScore = Math.min(moveScore + timeScore, 150);
            setScore(finalScore);
            const newHigh = updateHighScore(finalScore);
            setIsNewHigh(newHigh);
            if (moves + 1 <= totalPairs + 2) playPerfect();
            else playVictory();
            setMode("done");
          }
        }, 500);
      } else {
        // No match
        playWrong();
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newFlipped.includes(c.id) && !c.matched ? { ...c, flipped: false } : c
          ));
          setFlippedIds([]);
          setIsChecking(false);
        }, 800);
      }
    }
  }, [isChecking, flippedIds, cards, matchedPairs, totalPairs, moves, time, updateHighScore]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <GamePage>
        <BackToGames />
        <GameIntro gameId="memory-match" title="記憶翻牌" desc="翻開配對，訓練你的記憶力" />
        <div className={`${GAME_UI.rules} mb-5`}>
          <h3 className={GAME_UI.rulesTitle}>遊戲規則</h3>
          <ul className={GAME_UI.rulesList}>
            <li>每次翻開 2 張牌</li>
            <li>圖案相同即配對成功</li>
            <li>翻牌次數越少、速度越快，分數越高</li>
            <li>最高紀錄：{highScore} 分</li>
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
    const stars = getStars(score, 150);
    return (
      <GamePage>
        <BackToGames />
        <div className="text-center text-sm text-[#52616B] mt-4 mb-2">翻牌 {moves} 次 ・ 用時 {timerFmt}</div>
        <GameOverScreen
          score={score} maxScore={150} gameName="記憶翻牌" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={() => startGame(diff)} onBack={() => setMode("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "memory-match", activityName: "記憶翻牌" }}
        />
      </GamePage>
    );
  }

  /* ─── Playing ─── */
  const config = DIFF_CONFIG[diff];

  return (
    <GamePage>
      <BackToGames />
      <h1 className="text-xl font-black text-[#263238] mt-2 mb-0">記憶翻牌</h1>

      {/* Header */}
      <div className="flex flex-wrap gap-2 mt-3 mb-4">
        <div className={GAME_UI.chip}>翻牌 <b>{moves}</b> 次</div>
        <div className={GAME_UI.chip}>時間 <b className="font-mono">{timerFmt}</b></div>
        <div className={GAME_UI.chip}>已配對 <b className="text-[#2457A7]">{matchedPairs}/{totalPairs}</b></div>
      </div>

      {/* Card Grid */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200">
        <div className="grid gap-2 mx-auto" style={{
          gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
          maxWidth: config.cols * 72,
        }}>
          {cards.map(card => (
            <button key={card.id} onClick={() => handleFlip(card.id)}
              className={`aspect-square rounded-xl text-2xl flex items-center justify-center cursor-pointer border-none transition-all duration-300 transform
                ${card.matched
                  ? "bg-green-100 border-2 border-green-300 scale-90 opacity-70"
                  : card.flipped
                    ? "bg-white border-2 border-[#E65E83] scale-105"
                    : "bg-[#FDECF1] border-2 border-[#F5B8C8] hover:bg-[#FAD9E3] scale-100"
                }
              `}
              style={{ minHeight: 60 }}
              disabled={card.flipped || card.matched || isChecking}
            >
              {card.flipped || card.matched ? (
                <span className="animate-fadeIn">{card.emoji}</span>
              ) : (
                <span className="text-[#E65E83] text-lg font-bold">?</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </GamePage>
  );
}
