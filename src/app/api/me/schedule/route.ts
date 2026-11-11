export const runtime = "edge";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-server";
import { getDb } from "@/lib/db";

const NO_STORE = { headers: { "Cache-Control": "no-store" } };
const ITEM_KEYS = ["subject", "activityType", "activityId", "activityName", "icon", "href"] as const;

/** GET /api/me/schedule → [{ day_of_week, activities }] */
export async function GET(request: Request) {
  const session = await getSessionUser(request);
  if (!session) return NextResponse.json([], { status: 401, ...NO_STORE });
  const { data } = await getDb().from("weekly_schedules").select("day_of_week, activities").eq("user_id", session.id);
  return NextResponse.json(data ?? [], NO_STORE);
}

/** PUT /api/me/schedule  body { dayOfWeek: 0-6, activities: ScheduleItem[] } → upsert 那一天 */
export async function PUT(request: Request) {
  const session = await getSessionUser(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, ...NO_STORE });
  let body: { dayOfWeek?: unknown; activities?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400, ...NO_STORE }); }

  const day = body.dayOfWeek;
  if (typeof day !== "number" || !Number.isInteger(day) || day < 0 || day > 6) return NextResponse.json({ error: "Invalid day" }, { status: 400, ...NO_STORE });
  if (!Array.isArray(body.activities) || body.activities.length > 50) return NextResponse.json({ error: "Invalid activities" }, { status: 400, ...NO_STORE });
  const activities = body.activities.map((raw) => {
    const item: Record<string, string> = {};
    const r = (raw ?? {}) as Record<string, unknown>;
    for (const k of ITEM_KEYS) item[k] = typeof r[k] === "string" ? (r[k] as string).slice(0, 300) : "";
    return item;
  });

  const { error } = await getDb().from("weekly_schedules").upsert(
    { user_id: session.id, day_of_week: day, activities, updated_at: new Date().toISOString() },
    { onConflict: "user_id,day_of_week" },
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500, ...NO_STORE });
  return NextResponse.json({ ok: true }, NO_STORE);
}

/** DELETE /api/me/schedule?day=N → 刪那一天 */
export async function DELETE(request: Request) {
  const session = await getSessionUser(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, ...NO_STORE });
  const day = parseInt(new URL(request.url).searchParams.get("day") ?? "", 10);
  if (!Number.isInteger(day) || day < 0 || day > 6) return NextResponse.json({ error: "Invalid day" }, { status: 400, ...NO_STORE });
  const { error } = await getDb().from("weekly_schedules").delete().eq("user_id", session.id).eq("day_of_week", day);
  if (error) return NextResponse.json({ error: error.message }, { status: 500, ...NO_STORE });
  return NextResponse.json({ ok: true }, NO_STORE);
}
