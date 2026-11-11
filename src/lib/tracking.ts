/**
 * 學習紀錄（瀏覽器端）。所有讀寫都走 /api/me/*，由伺服器用 session cookie 認人、寫 D1。
 * 對外函式名稱與回傳型別和原本（直接打 Supabase）一樣，呼叫端不用改。
 */

// ── Types ──────────────────────────────────────────────────
export interface TrackActivityParams {
  subject: "gept" | "jlpt" | "board-game" | "math" | "finance" | "typing" | "chinese-lang" | "history-geo" | "music";
  activityType: "game" | "mock-test" | "quiz" | "challenge" | "speaking" | "writing" | "unit" | "module";
  activityId: string;
  activityName: string;
  score?: number;
  maxScore?: number;
  stars?: number;
  durationSeconds?: number;
  metadata?: Record<string, unknown>;
}

export interface StreakData {
  current_streak: number;
  longest_streak: number;
}

export interface LearningActivity {
  id: string;
  subject: string;
  activity_type: string;
  activity_id: string;
  activity_name: string;
  score: number | null;
  max_score: number | null;
  stars: number | null;
  duration_seconds: number | null;
  metadata: Record<string, unknown>;
  completed_at: string;
}

const FETCH_OPTS: RequestInit = { cache: "no-store", credentials: "same-origin" };

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, FETCH_OPTS);
    if (!res.ok) return null; // 401 = 未登入 → 呼叫端視為沒有資料
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type ListResult = { records: LearningActivity[]; total: number };

// ── Core Functions ─────────────────────────────────────────

/** Track a completed learning activity + update streak. No-ops if not logged in. */
export async function trackActivity(params: TrackActivityParams): Promise<StreakData | null> {
  try {
    const res = await fetch("/api/me/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      ...FETCH_OPTS,
    });
    if (!res.ok) return null;
    return (await res.json()) as StreakData;
  } catch {
    return null;
  }
}

/** Get current streak data */
export async function getStreak(): Promise<StreakData | null> {
  return getJson<StreakData | null>("/api/me/streak");
}

/** Get today's completed activities */
export async function getTodayActivities(): Promise<LearningActivity[]> {
  const today = new Date().toISOString().split("T")[0];
  const r = await getJson<ListResult>(`/api/me/activities?dateFrom=${today}&dateTo=${today}`);
  return r?.records ?? [];
}

/** Get recent activities */
export async function getRecentActivities(limit = 5): Promise<LearningActivity[]> {
  const r = await getJson<ListResult>(`/api/me/activities?limit=${limit}`);
  return r?.records ?? [];
}

/** Get this week's stats */
export async function getWeekStats(): Promise<{ count: number; avgScore: number; subjects: string[] }> {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  const weekStart = monday.toISOString().split("T")[0];

  const r = await getJson<{ records: { score: number | null; max_score: number | null; subject: string }[] }>(
    `/api/me/activities?select=score,max_score,subject&dateFrom=${weekStart}`,
  );
  const records = r?.records ?? [];
  const scored = records.filter((x) => x.score != null && x.max_score != null && x.max_score > 0);
  const avgScore = scored.length > 0
    ? Math.round(scored.reduce((sum, x) => sum + (x.score! / x.max_score!) * 100, 0) / scored.length)
    : 0;
  const subjects = Array.from(new Set(records.map((x) => x.subject)));

  return { count: records.length, avgScore, subjects };
}

/** Get paginated learning records with filters */
export async function getLearningRecords(
  page = 0,
  perPage = 20,
  filters?: { subject?: string; dateFrom?: string; dateTo?: string }
): Promise<{ records: LearningActivity[]; total: number }> {
  const p = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  if (filters?.subject) p.set("subject", filters.subject);
  if (filters?.dateFrom) p.set("dateFrom", filters.dateFrom);
  if (filters?.dateTo) p.set("dateTo", filters.dateTo);
  const r = await getJson<ListResult>(`/api/me/activities?${p.toString()}`);
  return { records: r?.records ?? [], total: r?.total ?? 0 };
}
