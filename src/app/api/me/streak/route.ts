export const runtime = "edge";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-server";
import { getDb } from "@/lib/db";

/** GET /api/me/streak → { current_streak, longest_streak } 或 null */
export async function GET(request: Request) {
  const session = await getSessionUser(request);
  const headers = { "Cache-Control": "no-store" };
  if (!session) return NextResponse.json(null, { status: 401, headers });
  const { data } = await getDb()
    .from("user_streaks")
    .select("current_streak, longest_streak")
    .eq("user_id", session.id)
    .maybeSingle();
  return NextResponse.json(data ?? null, { headers });
}
