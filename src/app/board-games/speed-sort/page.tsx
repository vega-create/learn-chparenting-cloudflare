"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen, shuffle, GamePage, BackToGames, GameIntro, GAME_UI } from "@/lib/game-utils";

/* ─── Types ─── */
interface Round {
  numbers: number[];
  sorted: number[];
}

const TOTAL_ROUNDS = 8;

function generateRound(roundIndex: number): Round {
  // 4 個數字開始，最後一回合 8 個
  const count = Math.min(4 + Math.ceil(roundIndex / 2), 8);
  // Increase range with rounds
  const maxVal = 20 + roundIndex * 10;
  const numSet = new Set<number>();
  while (numSet.size < count) {
    numSet.add(Math.floor(Math.random() * maxVal) + 1);
  }
  const numbers = shuffle(Array.from(numSet));
  const sorted = [...numbers].sort((a, b) => a - b);
  return { numbers, sorted };
}

export default function SpeedSortPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [roundIndex, setRoundIndex] = useState(0);
  const [round, setRound] = useState<Round | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [totalTime, setTotalTime] = useState(0);
  const [roundTime, setRoundTime] = useState(0);
  const [feedback, setFeedback] = useState<{ type: "correct" | "wrong"; msg: string } | null>(null);
  const [roundComplete, setRoundComplete] = useState(false);
  const [wrongPicks, setWrongPicks] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const { highScore, updateHighScore } = useHighScore("speed-sort");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRoundTime(0);
    let t = 0;
    timerRef.current = setInterval(() => {
      t++;
      setRoundTime(t);
      setTotalTime(prev => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startGame = useCallback(() => {
    setRoundIndex(0);
    setRound(generateRound(0));
    setSelected([]);
    setScore(0);
    scoreRef.current = 0;
    setTotalTime(0);
    setRoundTime(0);
    setFeedback(null);
    setRoundComplete(false);
    setWrongPicks(0);
    setIsNewHigh(false);
    setMode("playing");
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const nextRound = useCallback(() => {
    const next = roundIndex + 1;
    if (next >= TOTAL_ROUNDS) {
      stopTimer();
      // 用 ref 取最新的總分；直接讀 score 會少算最後一回合，最高紀錄就記錯了
      const finalScore = scoreRef.current;
      const newHigh = updateHighScore(finalScore);
      setIsNewHigh(newHigh);
      if (finalScore >= TOTAL_ROUNDS * 15) playPerfect();
      else if (finalScore >= TOTAL_ROUNDS * 10) playVictory();
      setMode("done");
    } else {
      setRoundIndex(next);
      setRound(generateRound(next));
      setSelected([]);
      setRoundComplete(false);
      setFeedback(null);
      setWrongPicks(0);
      startTimer();
    }
  }, [roundIndex, score, stopTimer, updateHighScore, startTimer]);

  const handlePick = useCallback((num: number) => {
    if (!round || roundComplete) return;
    if (selected.includes(num)) return;

    const expectedIndex = selected.length;
    const expectedNum = round.sorted[expectedIndex];

    if (num === expectedNum) {
      playCorrect();
      const newSelected = [...selected, num];
      setSelected(newSelected);

      if (newSelected.length === round.sorted.length) {
        // Round complete!
        stopTimer();
        // 數字越多給的時間越寬：每個數字 2 秒內點完就拿滿 20 分的時間加分
        const allowance = round.sorted.length * 2;
        const timeBonus = Math.max(20 - Math.max(roundTime - allowance, 0), 0);
        const wrongPenalty = wrongPicks * 3;
        const roundScore = Math.max(10 + timeBonus - wrongPenalty, 5);
        scoreRef.current += roundScore;
        setScore(scoreRef.current);
        setFeedback({ type: "correct", msg: `+${roundScore} 分（用時 ${roundTime}s）` });
        setRoundComplete(true);

        setTimeout(() => nextRound(), 1500);
      }
    } else {
      playWrong();
      setWrongPicks(w => w + 1);
      setFeedback({ type: "wrong", msg: "順序不對！" });
      setTimeout(() => setFeedback(null), 800);
    }
  }, [round, roundComplete, selected, stopTimer, roundTime, wrongPicks, nextRound]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <GamePage>
        <BackToGames />
        <GameIntro gameId="speed-sort" title="快速排序" desc="按順序點擊數字，越快越好！" />
        <div className={`${GAME_UI.rules} mb-5`}>
          <h3 className={GAME_UI.rulesTitle}>遊戲規則</h3>
          <ul className={GAME_UI.rulesList}>
            <li>螢幕顯示一組打亂的數字</li>
            <li>按<span className="font-bold text-[#2457A7]">從小到大</span>的順序點擊</li>
            <li>速度越快，得分越高</li>
            <li>點錯會扣分</li>
            <li>共 {TOTAL_ROUNDS} 回合，數字越來越多</li>
            <li>最高紀錄：{highScore} 分</li>
          </ul>
        </div>
        <button onClick={startGame}
          className={`w-full py-4 px-6 text-lg ${GAME_UI.primaryBtn}`}>
          開始排序
        </button>
      </GamePage>
    );
  }

  /* ─── Done ─── */
  if (mode === "done") {
    const maxScore = TOTAL_ROUNDS * 30;
    const stars = getStars(score, maxScore);
    return (
      <GamePage>
        <BackToGames />
        <div className="text-center text-sm text-[#52616B] mt-4 mb-2">
          總用時 {formatTime(totalTime)} ・ 得分 {score}
        </div>
        <GameOverScreen
          score={score} maxScore={TOTAL_ROUNDS * 30} gameName="快速排序" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={startGame} onBack={() => setMode("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "speed-sort", activityName: "快速排序" }}
        />
      </GamePage>
    );
  }

  /* ─── Playing ─── */
  return (
    <GamePage>
      <BackToGames />
      <h1 className="text-xl font-black text-[#263238] mt-2 mb-3">快速排序</h1>

      {/* Header */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className={GAME_UI.chip}>回合 <b>{roundIndex + 1}/{TOTAL_ROUNDS}</b></div>
        <div className={GAME_UI.chip}>時間 <b className="font-mono">{roundTime}s</b></div>
        <div className={GAME_UI.chip}>得分 <b className="text-[#2457A7]">{score}</b></div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-200 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-[#2457A7] rounded-full transition-all duration-500"
          style={{ width: `${(roundIndex / TOTAL_ROUNDS) * 100}%` }} />
      </div>

      {/* Instruction */}
      <div className="text-center text-sm text-[#52616B] mb-4">
        從小到大依序點擊
      </div>

      {/* Sorted progress display */}
      {round && (
        <div className="flex justify-center gap-1 mb-4 flex-wrap">
          {round.sorted.map((n, i) => (
            <div key={i} className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all
              ${i < selected.length ? "bg-[#2457A7] text-white scale-100" : "bg-slate-100 text-slate-300 scale-90"}
            `}>
              {i < selected.length ? n : "?"}
            </div>
          ))}
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className={`text-center text-sm font-bold mb-3 animate-fadeIn ${feedback.type === "correct" ? "text-green-500" : "text-red-500"}`}>
          {feedback.msg}
        </div>
      )}

      {/* Number grid */}
      {round && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200">
          <div className="grid grid-cols-4 gap-3 max-w-[320px] mx-auto">
            {round.numbers.map((num) => {
              const isSelected = selected.includes(num);
              const selIndex = selected.indexOf(num);
              return (
                <button key={num}
                  onClick={() => handlePick(num)}
                  disabled={isSelected}
                  className={`aspect-square rounded-xl text-xl sm:text-2xl font-black cursor-pointer border-2 transition-all
                    ${isSelected
                      ? "bg-[#F3F7FD] border-[#BFD0EA] text-[#2457A7] scale-90 opacity-60"
                      : "bg-white border-slate-200 text-[#263238] hover:border-[#2457A7] hover:bg-[#F3F7FD] active:scale-95"
                    }
                  `}
                >
                  {isSelected ? (
                    <span className="text-sm">{selIndex + 1}st</span>
                  ) : (
                    num
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </GamePage>
  );
}
