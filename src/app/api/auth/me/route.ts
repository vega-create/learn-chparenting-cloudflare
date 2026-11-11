export const runtime = "edge";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-server";

/** GET /api/auth/me → { user: { id, email, name, avatar } | null } */
export async function GET(request: Request) {
  const s = await getSessionUser(request);
  const user = s ? { id: s.id, email: s.email, name: s.name, avatar: s.avatar } : null;
  return NextResponse.json({ user }, { headers: { "Cache-Control": "no-store" } });
}
