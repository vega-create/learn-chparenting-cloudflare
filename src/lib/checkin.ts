/**
 * 原 Supabase RPC `record_checkin(p_user_id)` 的程式版（見 supabase-schema.sql）。
 *
 * 1. daily_checkins 當天那列 +1（沒有就建）
 * 2. user_streaks：第一次 → 1/1；今天已打卡 → 不變；昨天有打卡 → +1；否則 → 重設為 1
 * 兩個寫入用 D1 batch 一次送出（同一個隱含交易）。
 *
 * 日期沿用原本的 Postgres CURRENT_DATE（資料庫時區 = UTC），所以預設 todayUtc()。
 */
import type { D1Like } from "./d1-compat";

export interface StreakData {
  current_streak: number;
  longest_streak: number;
}

export function todayUtc(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function yesterdayOf(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** 純邏輯：給定現有 streak 列，算出新的 streak 與是否要寫入 */
export function nextStreak(
  existing: { current_streak: number; longest_streak: number; last_checkin_date: string | null } | null,
  today: string,
): { streak: StreakData; write: "insert" | "update" | "none" } {
  if (!existing) return { streak: { current_streak: 1, longest_streak: 1 }, write: "insert" };
  if (existing.last_checkin_date === today) {
    return { streak: { current_streak: existing.current_streak, longest_streak: existing.longest_streak }, write: "none" };
  }
  if (existing.last_checkin_date === yesterdayOf(today)) {
    const cur = existing.current_streak + 1;
    return { streak: { current_streak: cur, longest_streak: Math.max(existing.longest_streak, cur) }, write: "update" };
  }
  return { streak: { current_streak: 1, longest_streak: existing.longest_streak }, write: "update" };
}

export async function recordCheckin(db: D1Like, userId: string, today: string = todayUtc()): Promise<StreakData> {
  const existing = await db
    .prepare("SELECT current_streak, longest_streak, last_checkin_date FROM user_streaks WHERE user_id = ?")
    .bind(userId)
    .first<{ current_streak: number; longest_streak: number; last_checkin_date: string | null }>();

  const { streak, write } = nextStreak(existing, today);
  const now = new Date().toISOString();

  const statements = [
    db
      .prepare(
        `INSERT INTO daily_checkins (id, user_id, checkin_date, activity_count) VALUES (?, ?, ?, 1)
         ON CONFLICT (user_id, checkin_date) DO UPDATE SET activity_count = daily_checkins.activity_count + 1`,
      )
      .bind(crypto.randomUUID(), userId, today),
  ];
  if (write === "insert") {
    statements.push(
      db
        .prepare("INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_checkin_date, updated_at) VALUES (?, ?, ?, ?, ?)")
        .bind(userId, streak.current_streak, streak.longest_streak, today, now),
    );
  } else if (write === "update") {
    statements.push(
      db
        .prepare("UPDATE user_streaks SET current_streak = ?, longest_streak = ?, last_checkin_date = ?, updated_at = ? WHERE user_id = ?")
        .bind(streak.current_streak, streak.longest_streak, today, now, userId),
    );
  }
  await db.batch(statements);
  return streak;
}
