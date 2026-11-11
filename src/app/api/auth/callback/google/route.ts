export const runtime = "edge";
import { NextResponse } from "next/server";
import { getSecret } from "@/lib/db";
import { upsertUserFromGoogle, type GoogleProfile } from "@/lib/auth-server";
import { OAUTH_COOKIE, SESSION_COOKIE, SESSION_TTL_SECONDS, createSessionToken, parseCookies, verifyToken } from "@/lib/session";

/**
 * GET /api/auth/callback/google?code=...&state=...
 * Google 導回來：驗 state → 換 token → 取 userinfo → 對應 users 表 → 發 session cookie → 回 /dashboard
 * 任何失敗都導回 /login?error=...，不留半套狀態。
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const fail = (code: string) => {
    const res = NextResponse.redirect(new URL(`/login?error=${code}`, url.origin), 302);
    res.cookies.set(OAUTH_COOKIE, "", { path: "/api/auth", maxAge: 0 });
    return res;
  };

  const secret = getSecret("AUTH_SECRET");
  const clientId = getSecret("GOOGLE_CLIENT_ID");
  const clientSecret = getSecret("GOOGLE_CLIENT_SECRET");
  if (!secret || !clientId || !clientSecret) return fail("not_configured");

  if (url.searchParams.get("error")) return fail("denied");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) return fail("missing_code");

  const cookies = parseCookies(request.headers.get("cookie"));
  const oauth = await verifyToken<{ state: string; verifier: string; next: string; exp: number }>(cookies[OAUTH_COOKIE], secret);
  if (!oauth || oauth.state !== state || oauth.exp * 1000 < Date.now()) return fail("bad_state");

  // 換 token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${url.origin}/api/auth/callback/google`,
      grant_type: "authorization_code",
      code_verifier: oauth.verifier,
    }),
  });
  if (!tokenRes.ok) {
    console.error("google token exchange failed", tokenRes.status, (await tokenRes.text()).slice(0, 200));
    return fail("token");
  }
  const token = (await tokenRes.json()) as { access_token?: string };
  if (!token.access_token) return fail("token");

  // 取個人資料（sub / email / name / picture）
  const infoRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (!infoRes.ok) return fail("userinfo");
  const profile = (await infoRes.json()) as GoogleProfile;
  if (!profile.sub || !profile.email || profile.email_verified === false) return fail("userinfo");

  let user;
  try {
    user = await upsertUserFromGoogle(profile);
  } catch (e) {
    console.error("upsertUserFromGoogle failed", e);
    return fail("db");
  }

  const res = NextResponse.redirect(new URL(oauth.next || "/dashboard", url.origin), 302);
  res.cookies.set(SESSION_COOKIE, await createSessionToken(user, secret), {
    httpOnly: true,
    secure: url.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  res.cookies.set(OAUTH_COOKIE, "", { path: "/api/auth", maxAge: 0 });
  return res;
}
