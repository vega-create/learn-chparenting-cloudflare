export const runtime = "edge";
import { NextResponse } from "next/server";
import { getSecret } from "@/lib/db";
import { OAUTH_COOKIE, randomToken, sha256base64url, signPayload } from "@/lib/session";

/**
 * GET /api/auth/login?next=/dashboard
 * 產生 state + PKCE，存進簽章 cookie（10 分鐘），導去 Google 同意畫面。
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const clientId = getSecret("GOOGLE_CLIENT_ID");
  const secret = getSecret("AUTH_SECRET");
  if (!clientId || !secret) {
    return NextResponse.redirect(new URL("/login?error=not_configured", url.origin));
  }

  const nextParam = url.searchParams.get("next") || "/dashboard";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/dashboard";
  const state = randomToken(24);
  const verifier = randomToken(48);
  const challenge = await sha256base64url(verifier);
  const redirectUri = `${url.origin}/api/auth/callback/google`;

  const google = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  google.searchParams.set("client_id", clientId);
  google.searchParams.set("redirect_uri", redirectUri);
  google.searchParams.set("response_type", "code");
  google.searchParams.set("scope", "openid email profile");
  google.searchParams.set("state", state);
  google.searchParams.set("code_challenge", challenge);
  google.searchParams.set("code_challenge_method", "S256");
  google.searchParams.set("prompt", "select_account"); // 每個孩子選自己的帳號

  const res = NextResponse.redirect(google.toString(), 302);
  res.cookies.set(OAUTH_COOKIE, await signPayload({ state, verifier, next, exp: Math.floor(Date.now() / 1000) + 600 }, secret), {
    httpOnly: true,
    secure: url.protocol === "https:",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 600,
  });
  return res;
}
