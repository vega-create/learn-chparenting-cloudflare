"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type React from "react";
import { trackActivity, type TrackActivityParams } from "@/lib/tracking";
import ShareButtons from "@/components/ShareButtons";
import { useAchievements } from "@/contexts/AchievementContext";

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

/* ─── Shared visual chrome (presentation only, no game logic) ─── */
export const GAME_UI = {
  card: "bg-white rounded-2xl border border-slate-200",
  rules: "bg-white rounded-2xl border border-slate-200 p-5",
  rulesTitle: "font-bold text-[#263238] mb-2 text-base",
  rulesList: "text-sm text-[#52616B] space-y-1 list-disc list-inside m-0 pl-0",
  diffBtn: "w-full flex items-center justify-between gap-3 py-3.5 px-5 rounded-xl bg-white border border-slate-200 text-left text-[#263238] cursor-pointer hover:border-[#2457A7] hover:bg-[#F3F7FD] transition",
  diffLabel: "text-base font-bold text-[#263238]",
  diffDesc: "text-xs text-[#52616B] mt-0.5",
  primaryBtn: "rounded-xl bg-[#2457A7] text-white font-bold cursor-pointer border-none hover:bg-[#1d4688] transition",
  secondaryBtn: "rounded-xl border border-slate-300 bg-white text-[#263238] font-semibold cursor-pointer hover:bg-slate-50 transition",
  chip: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-sm text-[#263238]",
  segOn: "bg-[#2457A7] text-white border-[#2457A7]",
  segOff: "bg-white text-[#52616B] border-slate-200 hover:bg-slate-50",
};

/** Full-width ivory page background + centred column. */
export function GamePage({ children, maxW = "max-w-lg" }: { children: React.ReactNode; maxW?: string }) {
  return (
    <div className="bg-white min-h-screen">
      <div className={`${maxW} mx-auto px-4 py-6 sm:py-8 animate-fadeIn text-[#263238]`}>{children}</div>
    </div>
  );
}

export function BackToGames() {
  return (
    <a href="/board-games" className="inline-flex items-center gap-1 text-sm font-semibold text-[#2457A7] no-underline hover:underline">
      ← 返回教育遊戲
    </a>
  );
}

/** Start-screen hero: illustration + title + one-line description. */
export function GameIntro({ gameId, title, desc }: { gameId: string; title: string; desc: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mt-4 mb-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/images/games/${gameId}.webp`} alt="" className="w-full aspect-[3/2] object-cover bg-slate-50 block" />
      <div className="px-5 py-4">
        <div className="text-xs font-bold text-[#E65E83] mb-1">教育遊戲</div>
        <h1 className="text-2xl font-black text-[#263238] m-0 mb-1">{title}</h1>
        <p className="text-sm text-[#52616B] m-0">{desc}</p>
      </div>
    </div>
  );
}

/** Small "開始" tag shown at the right edge of a difficulty button. */
export function StartTag() {
  return <span className="shrink-0 px-3 py-1.5 rounded-lg bg-[#2457A7] text-white text-sm font-bold">開始 →</span>;
}

/** Compact in-game header: back link + title (+ optional right-side content). */
export function GameTopBar({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-4">
      <BackToGames />
      <div className="flex items-center justify-between gap-3 mt-2 flex-wrap">
        <h1 className="text-xl font-black text-[#263238] m-0">{title}</h1>
        {children}
      </div>
    </div>
  );
}

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
  const { checkAndUnlock } = useAchievements();

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

    // Achievement triggers
    checkAndUnlock("first-game");
    if (stars >= 3) checkAndUnlock("game-master");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-sm mx-auto mt-8 text-center bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-slideUp">
      <div className="text-5xl mb-3">{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
      {isNewHigh && <div className="text-sm font-bold text-[#E65E83] mb-2 animate-pulse">🏆 新紀錄！</div>}
      <h2 className="text-2xl font-black text-[#263238] mb-1">遊戲結束</h2>
      <div className="text-4xl font-black text-[#2457A7] my-3">{score} 分</div>
      {maxScore > 0 && <div className="text-sm text-[#52616B] mb-1">滿分 {maxScore}</div>}
      <div className="text-xs text-[#52616B] mb-4">最高紀錄：{highScore}</div>
      <div className="text-xs text-slate-500 mb-2">分享你的成績：</div>
      <ShareButtons
        text={`我在「${gameName}」得了 ${score} 分 ${"⭐".repeat(stars)}${"☆".repeat(3 - stars)}！來挑戰看看 🎮`}
        url="/board-games"
      />
      <div className="flex gap-3 justify-center flex-wrap mt-4">
        <button onClick={onRestart} className="px-6 py-2.5 rounded-xl bg-[#2457A7] text-white font-bold cursor-pointer border-none hover:bg-[#1d4688] transition">🔄 再玩一次</button>
        <button onClick={onBack} className="px-6 py-2.5 rounded-xl border border-slate-300 text-[#263238] font-semibold cursor-pointer bg-white hover:bg-slate-50 transition">← 返回</button>
      </div>
    </div>
  );
}
