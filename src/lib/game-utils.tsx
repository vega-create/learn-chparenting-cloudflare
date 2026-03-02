"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { trackActivity, type TrackActivityParams } from "@/lib/tracking";
import ShareButtons from "@/components/ShareButtons";

/* ─── Timer Hook ─── */
export function useTimer(running: boolean) {
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [running]);
  const reset = () => setTime(0);
  const fmt = `${Math.floor(time / 60).toString().padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`;
  return { time, fmt, reset };
}

/* ─── Countdown Timer Hook ─── */
export function useCountdown(initialSeconds: number, onEnd: () => void) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const iv = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(iv); onEndRef.current(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [running, remaining]);

  const start = () => { setRemaining(initialSeconds); setRunning(true); };
  const stop = () => setRunning(false);
  const fmt = `${Math.floor(remaining / 60).toString().padStart(2, "0")}:${(remaining % 60).toString().padStart(2, "0")}`;
  return { remaining, fmt, start, stop, running };
}

/* ─── High Score (localStorage) ─── */
export function useHighScore(gameId: string) {
  const [highScore, setHighScore] = useState(0);
  useEffect(() => {
    const saved = localStorage.getItem(`bg_${gameId}_high`);
    if (saved) setHighScore(Number(saved));
  }, [gameId]);
  const updateHighScore = useCallback((score: number) => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(`bg_${gameId}_high`, String(score));
      return true;
    }
    return false;
  }, [gameId, highScore]);
  return { highScore, updateHighScore };
}

/* ─── Shared colors ─── */
export const GAME_COLORS = {
  logic: { bg: "from-purple-500 to-indigo-600", light: "bg-purple-50", border: "border-purple-200", text: "text-purple-600" },
  code: { bg: "from-cyan-500 to-blue-600", light: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-600" },
  memory: { bg: "from-pink-500 to-rose-600", light: "bg-pink-50", border: "border-pink-200", text: "text-pink-600" },
  reaction: { bg: "from-amber-500 to-orange-600", light: "bg-amber-50", border: "border-amber-200", text: "text-amber-600" },
};

/* ─── Star Rating ─── */
export function getStars(score: number, max: number): number {
  const pct = score / Math.max(max, 1);
  return pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0;
}

/* ─── Shuffle ─── */
export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/* ─── Share Result ─── */
export function shareResult(gameName: string, score: number, stars: number) {
  const text = `我在「${gameName}」得了 ${score} 分 ${"⭐".repeat(stars)}${"☆".repeat(3 - stars)}！來挑戰看看 👉 https://learn.chparenting.com/board-games`;
  if (navigator.share) {
    navigator.share({ text }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  }
}

/* ─── Game Over Screen ─── */
export interface TrackingData {
  subject: TrackActivityParams["subject"];
  activityType: TrackActivityParams["activityType"];
  activityId: string;
  activityName: string;
  durationSeconds?: number;
  metadata?: Record<string, unknown>;
}

export function GameOverScreen({ score, maxScore, gameName, stars, highScore, isNewHigh, onRestart, onBack, trackingData }: {
  score: number; maxScore: number; gameName: string; stars: number; highScore: number; isNewHigh: boolean;
  onRestart: () => void; onBack: () => void;
  trackingData?: TrackingData;
}) {
  // Auto-track activity on mount (fire-and-forget)
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current || !trackingData) return;
    tracked.current = true;
    trackActivity({
      ...trackingData,
      score,
      maxScore,
      stars,
    }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-sm mx-auto mt-12 text-center bg-white rounded-2xl p-8 border border-slate-200 shadow-lg animate-slideUp">
      <div className="text-5xl mb-3">{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
      {isNewHigh && <div className="text-sm font-bold text-amber-500 mb-2 animate-pulse">🏆 新紀錄！</div>}
      <h2 className="text-2xl font-black text-slate-800 mb-1">遊戲結束</h2>
      <div className="text-4xl font-black text-amber-500 my-3">{score} 分</div>
      {maxScore > 0 && <div className="text-sm text-slate-400 mb-1">滿分 {maxScore}</div>}
      <div className="text-xs text-slate-400 mb-4">最高紀錄：{highScore}</div>
      <div className="text-xs text-slate-500 mb-2">分享你的成績：</div>
      <ShareButtons
        text={`我在「${gameName}」得了 ${score} 分 ${"⭐".repeat(stars)}${"☆".repeat(3 - stars)}！來挑戰看看 🎮`}
        url="/board-games"
      />
      <div className="flex gap-3 justify-center flex-wrap mt-4">
        <button onClick={onRestart} className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-bold cursor-pointer border-none hover:bg-orange-600 transition">🔄 再玩一次</button>
        <button onClick={onBack} className="px-6 py-2.5 rounded-xl border-2 border-slate-300 text-slate-600 font-bold cursor-pointer bg-white hover:bg-slate-50 transition">← 返回</button>
      </div>
    </div>
  );
}
