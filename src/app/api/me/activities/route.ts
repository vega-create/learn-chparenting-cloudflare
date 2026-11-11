export const runtime = "edge";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-server";
import { getD1, getDb } from "@/lib/db";
import { recordCheckin } from "@/lib/checkin";

const NO_STORE = { headers: { "Cache-Control": "no-store" } };
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SUBJECTS = new Set(["gept", "jlpt", "board-game", "math", "finance", "typing", "chinese-lang", "history-geo", "music"]);
const TYPES = new Set(["game", "mock-test", "quiz", "challenge", "speaking", "writing", "unit", "module"]);

/**
 * GET /api/me/activities?limit=5
 * GET /api/me/activities?page=0&perPage=20&subject=gept&dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD&select=score,max_score,subject
 * → { records, total }（只回自己的；取代原本 Supabase RLS）
 */
export async function GET(request: Request) {
  const session = await getSessionUser(request);
  if (!session) return NextResponse.json({ records: [], total: 0 }, { status: 401, ...NO_STORE });

  const p = new URL(request.url).searchParams;
  const cols = (p.get("select") || "*").replace(/[^A-Za-z0-9_,* ]/g, "") || "*";
  let q = getDb()
    .from("learning_activities")
    .select(cols, { count: "exact" })
    .eq("user_id", session.id)
    .order("completed_at", { ascending: false });

  const subject = p.get("subject");
  if (subject) q = q.eq("subject", subject.slice(0, 50));
  const dateFrom = p.get("dateFrom");
  if (dateFrom && DATE_RE.test(dateFrom)) q = q.gte("completed_at", `${dateFrom}T00:00:00`);
  const dateTo = p.get("dateTo");
  if (dateTo && DATE_RE.test(dateTo)) q = q.lte("completed_at", `${dateTo}T23:59:59.999Z`);

  const limit = Math.min(Math.max(parseInt(p.get("limit") || "0", 10) || 0, 0), 500);
  const perPage = Math.min(Math.max(parseInt(p.get("perPage") || "0", 10) || 0, 0), 200);
  const page = Math.max(parseInt(p.get("page") || "0", 10) || 0, 0);
  if (perPage > 0) q = q.range(page * perPage, (page + 1) * perPage - 1);
  else if (limit > 0) q = q.limit(limit);

  const { data, count, error } = await q;
  if (error) return NextResponse.json({ records: [], total: 0, error: error.message }, { status: 500, ...NO_STORE });
  return NextResponse.json({ records: data ?? [], total: count ?? 0 }, NO_STORE);
}

/**
 * POST /api/me/activities  body = TrackActivityParams（camelCase）
 * 寫一筆 learning_activities，再執行打卡／連續天數（原 record_checkin RPC）
 * → { current_streak, longest_streak }
 */
export async function POST(request: Request) {
  const session = await getSessionUser(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, ...NO_STORE });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400, ...NO_STORE }); }

  const str = (k: string, max: number) => (typeof body[k] === "string" && (body[k] as string).length > 0 && (body[k] as string).length <= max ? (body[k] as string) : null);
  const num = (k: string) => (typeof body[k] === "number" && Number.isFinite(body[k] as number) ? Math.round(body[k] as number) : null);

  const subject = str("subject", 30);
  const activityType = str("activityType", 30);
  const activityId = str("activityId", 200);
  const activityName = str("activityName", 200);
  if (!subject || !SUBJECTS.has(subject) || !activityType || !TYPES.has(activityType) || !activityId || !activityName) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400, ...NO_STORE });
  }
  const stars = num("stars");
  if (stars != null && (stars < 0 || stars > 3)) return NextResponse.json({ error: "Invalid stars" }, { status: 400, ...NO_STORE });
  let metadata: Record<string, unknown> = {};
  if (body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)) {
    metadata = body.metadata as Record<string, unknown>;
    if (JSON.stringify(metadata).length > 4000) return NextResponse.json({ error: "metadata too large" }, { status: 400, ...NO_STORE });
  }

  const db = getDb();
  const { error } = await db.from("learning_activities").insert({
    user_id: session.id,
    subject,
    activity_type: activityType,
    activity_id: activityId,
    activity_name: activityName,
    score: num("score"),
    max_score: num("maxScore"),
    stars,
    duration_seconds: num("durationSeconds"),
    metadata,
    completed_at: new Date().toISOString(),
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500, ...NO_STORE });

  const d1 = getD1();
  if (!d1) return NextResponse.json({ error: "No DB" }, { status: 500, ...NO_STORE });
  try {
    const streak = await recordCheckin(d1, session.id);
    return NextResponse.json(streak, NO_STORE);
  } catch (e) {
    console.error("recordCheckin failed", e);
    return NextResponse.json({ error: "checkin failed" }, { status: 500, ...NO_STORE });
  }
}
