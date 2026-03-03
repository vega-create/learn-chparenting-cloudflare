"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  type ReactNode,
} from "react";
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_MAP,
  type Achievement,
} from "@/data/achievements";

const STORAGE_KEY = "achievements_unlocked";

interface UnlockRecord {
  id: string;
  unlockedAt: string;
}

interface AchievementContextType {
  unlockedIds: Set<string>;
  records: UnlockRecord[];
  checkAndUnlock: (id: string) => boolean;
  newlyUnlocked: Achievement | null;
  dismissNotification: () => void;
  totalCount: number;
  unlockedCount: number;
}

const AchievementContext = createContext<AchievementContextType | null>(null);

// Board game IDs (same list as sitemap.ts)
const BOARD_GAME_IDS = [
  "pattern-master", "mini-sudoku", "sequence-quest",
  "code-path", "logic-gates", "loop-builder",
  "memory-match", "memory-sequence",
  "color-tap", "whack-a-mole",
  "math-rush", "speed-sort",
  "word-chain", "word-search",
  "maze-runner", "emoji-puzzle",
  "go-game", "chinese-checkers",
];

const SUBJECT_KEYS = [
  "gept", "jlpt", "chinese-lang", "math",
  "history-geo", "typing", "board-games",
  "music", "finance",
];

function readUnlocked(): UnlockRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeUnlocked(records: UnlockRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<UnlockRecord[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const initializedRef = useRef(false);

  useEffect(() => {
    setRecords(readUnlocked());
  }, []);

  const checkAndUnlock = useCallback((id: string): boolean => {
    const current = readUnlocked();
    if (current.some((r) => r.id === id)) return false;
    const achievement = ACHIEVEMENT_MAP[id];
    if (!achievement) return false;

    const updated = [...current, { id, unlockedAt: new Date().toISOString() }];
    writeUnlocked(updated);
    setRecords(updated);
    setNewlyUnlocked(achievement);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setNewlyUnlocked(null), 4000);

    return true;
  }, []);

  const dismissNotification = useCallback(() => {
    setNewlyUnlocked(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // Auto-check achievements on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Game high score checks
    ACHIEVEMENTS.forEach((a) => {
      if (a.id === "memory-king") {
        const saved = localStorage.getItem("bg_memory-match_high");
        if (saved && Number(saved) >= 100) checkAndUnlock(a.id);
      }
      if (a.id === "speed-demon") {
        const saved = localStorage.getItem("bg_color-tap_high");
        if (saved && Number(saved) >= 80) checkAndUnlock(a.id);
      }
    });

    // Games played count
    const gamesPlayed = BOARD_GAME_IDS.filter(
      (id) => localStorage.getItem(`bg_${id}_high`) !== null
    ).length;
    if (gamesPlayed >= 10) checkAndUnlock("game-collector");

    // Subjects visited
    const subjectsVisited = SUBJECT_KEYS.filter(
      (key) => localStorage.getItem(`visited_${key}`) === "true"
    ).length;
    if (subjectsVisited >= 3) checkAndUnlock("curious-explorer");
    if (subjectsVisited >= 6) checkAndUnlock("all-rounder");
    if (subjectsVisited >= 9) checkAndUnlock("platform-master");

    // Time-based
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 5) checkAndUnlock("night-owl");
    if (hour >= 5 && hour < 7) checkAndUnlock("early-bird");

    // Streak checks
    const streakDays = localStorage.getItem("achievement_streak_days");
    if (streakDays) {
      const days = Number(streakDays);
      if (days >= 3) checkAndUnlock("three-day-streak");
      if (days >= 7) checkAndUnlock("week-warrior");
    }

    // Track daily visit for streak
    const today = new Date().toISOString().split("T")[0];
    const lastVisit = localStorage.getItem("achievement_last_visit");
    const currentStreak = Number(localStorage.getItem("achievement_streak_days") || "0");

    if (lastVisit !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      const newStreak = lastVisit === yesterdayStr ? currentStreak + 1 : 1;
      localStorage.setItem("achievement_streak_days", String(newStreak));
      localStorage.setItem("achievement_last_visit", today);

      if (newStreak >= 3) checkAndUnlock("three-day-streak");
      if (newStreak >= 7) checkAndUnlock("week-warrior");
    }
  }, [checkAndUnlock]);

  const unlockedIds = useMemo(() => new Set(records.map((r) => r.id)), [records]);

  const value = useMemo<AchievementContextType>(
    () => ({
      unlockedIds,
      records,
      checkAndUnlock,
      newlyUnlocked,
      dismissNotification,
      totalCount: ACHIEVEMENTS.length,
      unlockedCount: records.length,
    }),
    [unlockedIds, records, checkAndUnlock, newlyUnlocked, dismissNotification]
  );

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const ctx = useContext(AchievementContext);
  if (!ctx) throw new Error("useAchievements must be used within AchievementProvider");
  return ctx;
}
