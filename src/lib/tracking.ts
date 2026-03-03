import { createClient, isSupabaseConfigured } from "./supabase";

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

// ── Core Functions ─────────────────────────────────────────

/** Track a completed learning activity + update streak. No-ops if not logged in. */
export async function trackActivity(params: TrackActivityParams): Promise<StreakData | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createClient();
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Insert learning activity
  await supabase.from("learning_activities").insert({
    user_id: user.id,
    subject: params.subject,
    activity_type: params.activityType,
    activity_id: params.activityId,
    activity_name: params.activityName,
    score: params.score ?? null,
    max_score: params.maxScore ?? null,
    stars: params.stars ?? null,
    duration_seconds: params.durationSeconds ?? null,
    metadata: params.metadata ?? {},
  });

  // Update daily check-in + streak
  const { data } = await supabase.rpc("record_checkin", { p_user_id: user.id });
  return data as StreakData | null;
}

/** Get current streak data */
export async function getStreak(): Promise<StreakData | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createClient();
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_streaks")
    .select("current_streak, longest_streak")
    .eq("user_id", user.id)
    .single();

  return data as StreakData | null;
}

/** Get today's completed activities */
export async function getTodayActivities(): Promise<LearningActivity[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  if (!supabase) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("learning_activities")
    .select("*")
    .eq("user_id", user.id)
    .gte("completed_at", `${today}T00:00:00`)
    .lte("completed_at", `${today}T23:59:59`)
    .order("completed_at", { ascending: false });

  return (data ?? []) as LearningActivity[];
}

/** Get recent activities */
export async function getRecentActivities(limit = 5): Promise<LearningActivity[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  if (!supabase) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("learning_activities")
    .select("*")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as LearningActivity[];
}

/** Get this week's stats */
export async function getWeekStats(): Promise<{ count: number; avgScore: number; subjects: string[] }> {
  if (!isSupabaseConfigured()) return { count: 0, avgScore: 0, subjects: [] };
  const supabase = createClient();
  if (!supabase) return { count: 0, avgScore: 0, subjects: [] };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { count: 0, avgScore: 0, subjects: [] };

  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  const weekStart = monday.toISOString().split("T")[0];

  const { data } = await supabase
    .from("learning_activities")
    .select("score, max_score, subject")
    .eq("user_id", user.id)
    .gte("completed_at", `${weekStart}T00:00:00`);

  const records = data ?? [];
  const scored = records.filter((r) => r.score != null && r.max_score != null && r.max_score > 0);
  const avgScore = scored.length > 0
    ? Math.round(scored.reduce((sum, r) => sum + (r.score! / r.max_score!) * 100, 0) / scored.length)
    : 0;
  const subjects = Array.from(new Set(records.map((r) => r.subject)));

  return { count: records.length, avgScore, subjects };
}

/** Get paginated learning records with filters */
export async function getLearningRecords(
  page = 0,
  perPage = 20,
  filters?: { subject?: string; dateFrom?: string; dateTo?: string }
): Promise<{ records: LearningActivity[]; total: number }> {
  if (!isSupabaseConfigured()) return { records: [], total: 0 };
  const supabase = createClient();
  if (!supabase) return { records: [], total: 0 };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { records: [], total: 0 };

  let query = supabase
    .from("learning_activities")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .range(page * perPage, (page + 1) * perPage - 1);

  if (filters?.subject) query = query.eq("subject", filters.subject);
  if (filters?.dateFrom) query = query.gte("completed_at", `${filters.dateFrom}T00:00:00`);
  if (filters?.dateTo) query = query.lte("completed_at", `${filters.dateTo}T23:59:59`);

  const { data, count } = await query;
  return { records: (data ?? []) as LearningActivity[], total: count ?? 0 };
}
