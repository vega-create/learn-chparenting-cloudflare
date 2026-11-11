export const runtime = "edge";
import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

/** POST /api/auth/logout → 清掉 session cookie */
export async function POST() {
  const res = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
