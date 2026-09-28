"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen } from "@/lib/game-utils";

/* ─── Types ─── */
interface Mole {
  id: number;
  type: "normal" | "golden" | "bomb";
  active: boolean;
  hit: boolean;
}

const MOLE_EMOJI: Record<string, string> = {
  normal: "🐹",
  golden: "⭐",
  bomb: "💣",
};

const GRID_SIZE = 9; // 3x3
const GAME_DURATION = 30;

export default function WhackAMolePage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [moles, setMoles] = useState<Mole[]>(
    Array.from({ length: GRID_SIZE }, (_, i) => ({ id: i, type: "normal", active: false, hit: false }))
  );
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const { highScore, updateHighScore } = useHighScore("whack-a-mole");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);
  const gameActiveRef = useRef(false);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const maxComboRef = useRef(0);
  const hitsRef = useRef(0);
  const missesRef = useRef(0);

  const cleanUp = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearTimeout(spawnRef.current);
    gameActiveRef.current = false;
  }, []);

  const endGame = useCallback(() => {
    cleanUp();
    const finalScore = Math.max(scoreRef.current, 0);
    const newHigh = updateHighScore(finalScore);
    setIsNewHigh(newHigh);
    setScore(finalScore);
    if (finalScore >= 200) playPerfect();
    else if (finalScore >= 100) playVictory();
    setMode("done");
  }, [cleanUp, updateHighScore]);

  const spawnTokenRef = useRef(0);
  const holeTokenRef = useRef<Record<number, number>>({});

  const spawnMole = useCallback(() => {
    if (!gameActiveRef.current) return;

    setMoles(prev => {
      const inactive = prev.filter(m => !m.active);
      if (inactive.length === 0) return prev;

      const idx = inactive[Math.floor(Math.random() * inactive.length)].id;
      const rand = Math.random();
      const type: "normal" | "golden" | "bomb" = rand < 0.1 ? "golden" : rand < 0.25 ? "bomb" : "normal";

      const updated = prev.map(m =>
        m.id === idx ? { ...m, active: true, type, hit: false } : m
      );

      // Auto-hide after random time
      // 每次出現給一個編號：地鼠被打掉後同一個洞又冒出新的，舊的計時器不能把新的地鼠藏起來
      const token = ++spawnTokenRef.current;
      holeTokenRef.current[idx] = token;
      const hideDelay = 800 + Math.random() * 1200;
      setTimeout(() => {
        if (!gameActiveRef.current) return;
        if (holeTokenRef.current[idx] !== token) return;
        setMoles(p => p.map(m =>
          m.id === idx && m.active && !m.hit ? { ...m, active: false } : m
        ));
      }, hideDelay);

      return updated;
    });

    // Schedule next spawn
    const nextDelay = 400 + Math.random() * 600;
    spawnRef.current = setTimeout(spawnMole, nextDelay);
  }, []);

  const startGame = useCallback(() => {
    cleanUp();
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHits(0);
    setMisses(0);
    setTimeLeft(GAME_DURATION);
    setIsNewHigh(false);
    scoreRef.current = 0;
    comboRef.current = 0;
    maxComboRef.current = 0;
    hitsRef.current = 0;
    missesRef.current = 0;

    setMoles(Array.from({ length: GRID_SIZE }, (_, i) => ({
      id: i, type: "normal" as const, active: false, hit: false
    })));

    setMode("playing");
    gameActiveRef.current = true;

    // Start timer
    let t = GAME_DURATION;
    timerRef.current = setInterval(() => {
      t--;
      setTimeLeft(t);
      if (t <= 0) {
        // Use setTimeout to avoid state update issues
        setTimeout(() => endGame(), 0);
      }
    }, 1000);

    // Start spawning
    setTimeout(spawnMole, 500);
  }, [cleanUp, spawnMole, endGame]);

  useEffect(() => {
    return cleanUp;
  }, [cleanUp]);

  const handleWhack = useCallback((id: number) => {
    if (!gameActiveRef.current) return;

    setMoles(prev => {
      const mole = prev.find(m => m.id === id);
      if (!mole || !mole.active || mole.hit) return prev;

      if (mole.type === "bomb") {
        // Hit a bomb
        playWrong();
        scoreRef.current = Math.max(scoreRef.current - 20, 0);
        comboRef.current = 0;
        setScore(scoreRef.current);
        setCombo(0);
        missesRef.current++;
        setMisses(missesRef.current);
      } else {
        // Hit a mole
        playCorrect();
        const points = mole.type === "golden" ? 20 : 10;
        const comboBonus = Math.min(comboRef.current, 5) * 2;
        scoreRef.current += points + comboBonus;
        comboRef.current++;
        maxComboRef.current = Math.max(maxComboRef.current, comboRef.current);
        hitsRef.current++;
        setScore(scoreRef.current);
        setCombo(comboRef.current);
        setMaxCombo(maxComboRef.current);
        setHits(hitsRef.current);
      }

      return prev.map(m =>
        m.id === id ? { ...m, hit: true, active: false } : m
      );
    });
  }, []);

  const handleMiss = useCallback((id: number) => {
    // Clicking empty hole
    if (!gameActiveRef.current) return;
    const mole = moles.find(m => m.id === id);
    if (mole && !mole.active) {
      comboRef.current = 0;
      setCombo(0);
    }
  }, [moles]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-amber-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">🐹</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">打地鼠</h1>
          <p className="text-slate-500 text-sm">快速反應，精準出擊</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>地鼠會從洞裡冒出來</li>
            <li>🐹 普通地鼠：+10 分</li>
            <li>⭐ 金色地鼠：+20 分</li>
            <li>💣 炸彈：-20 分，千萬別點！</li>
            <li>連續命中有額外加分</li>
            <li>限時 {GAME_DURATION} 秒</li>
            <li>最高紀錄：{highScore} 分</li>
          </ul>
        </div>
        <button onClick={startGame}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg cursor-pointer border-none hover:opacity-90 transition">
          🚀 開始打地鼠
        </button>
      </div>
    );
  }

  /* ─── Done ─── */
  if (mode === "done") {
    const stars = getStars(score, 250);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-amber-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center text-sm text-slate-500 mt-4 mb-2">
          命中 {hits} 次 ・ 最長連續 {maxCombo}
        </div>
        <GameOverScreen
          score={score} maxScore={250} gameName="打地鼠" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={startGame} onBack={() => setMode("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "whack-a-mole", activityName: "打地鼠" }}
        />
      </div>
    );
  }

  /* ─── Playing ─── */
  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
      <a href="/board-games" className="text-sm text-amber-500 hover:underline no-underline">← 返回桌遊專區</a>

      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-4">
        <div className="text-sm text-slate-500">⏱ {timeLeft}s</div>
        <div className="text-sm text-slate-500">🔥 x{combo}</div>
        <div className="text-sm font-bold text-amber-600">{score} 分</div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-2 bg-slate-200 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000"
          style={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }} />
      </div>

      {/* Grid */}
      <div className="bg-gradient-to-b from-green-100 to-amber-100 rounded-2xl p-6 border border-amber-200 shadow-sm">
        <div className="grid grid-cols-3 gap-4 max-w-[300px] mx-auto">
          {moles.map(mole => (
            <button key={mole.id}
              onClick={() => mole.active ? handleWhack(mole.id) : handleMiss(mole.id)}
              className={`aspect-square rounded-2xl flex items-center justify-center text-4xl cursor-pointer border-none transition-all duration-150 transform select-none
                ${mole.active
                  ? mole.type === "bomb"
                    ? "bg-red-100 border-2 border-red-300 scale-110 animate-pulse"
                    : mole.type === "golden"
                      ? "bg-amber-100 border-2 border-amber-400 scale-110"
                      : "bg-amber-50 border-2 border-amber-300 scale-110"
                  : mole.hit
                    ? "bg-green-50 border-2 border-green-200 scale-90 opacity-60"
                    : "bg-amber-800/20 border-2 border-amber-800/30 hover:bg-amber-800/30"
                }
              `}
              style={{ minHeight: 80 }}
            >
              {mole.active ? (
                <span className="animate-slideUp">{MOLE_EMOJI[mole.type]}</span>
              ) : mole.hit ? (
                <span className="text-2xl opacity-50">💨</span>
              ) : (
                <span className="text-2xl opacity-30">🕳️</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Combo display */}
      {combo >= 3 && (
        <div className="text-center mt-4 text-lg font-bold text-amber-500 animate-pulse">
          🔥 {combo} 連擊！+{Math.min(combo, 5) * 2} 額外分
        </div>
      )}
    </div>
  );
}
