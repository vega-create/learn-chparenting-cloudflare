/**
 * 簽章 cookie 工具（WebCrypto HMAC-SHA256，edge runtime 可用）。
 * 格式：base64url(JSON payload) + "." + base64url(HMAC)
 * 不 import Next / Cloudflare 模組，方便 node:test 直接測。
 */

export const SESSION_COOKIE = "learn_session";
export const OAUTH_COOKIE = "learn_oauth";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 天

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
}
export interface SessionPayload extends SessionUser {
  iat: number; // epoch seconds
  exp: number;
}

const enc = new TextEncoder();

export function base64url(bytes: ArrayBuffer | Uint8Array | string): string {
  const u8 = typeof bytes === "string" ? enc.encode(bytes) : bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (const b of u8) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function base64urlDecodeToString(s: string): string {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (s.length % 4)) % 4);
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(u8);
}

export function randomToken(bytes = 32): string {
  const u8 = new Uint8Array(bytes);
  crypto.getRandomValues(u8);
  return base64url(u8);
}

export async function sha256base64url(input: string): Promise<string> {
  return base64url(await crypto.subtle.digest("SHA-256", enc.encode(input)));
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function signPayload(payload: unknown, secret: string): Promise<string> {
  const body = base64url(JSON.stringify(payload));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(secret), enc.encode(body));
  return `${body}.${base64url(sig)}`;
}

/** 驗章失敗或格式不對回傳 null；不檢查 exp（由呼叫端決定） */
export async function verifyToken<T = unknown>(token: string | undefined | null, secret: string): Promise<T | null> {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  let sigBytes: Uint8Array<ArrayBuffer>;
  try {
    const b64 = sig.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (sig.length % 4)) % 4);
    const bin = atob(b64);
    sigBytes = new Uint8Array(new ArrayBuffer(bin.length));
    for (let i = 0; i < bin.length; i++) sigBytes[i] = bin.charCodeAt(i);
  } catch {
    return null;
  }
  const ok = await crypto.subtle.verify("HMAC", await hmacKey(secret), sigBytes, enc.encode(body));
  if (!ok) return null;
  try {
    return JSON.parse(base64urlDecodeToString(body)) as T;
  } catch {
    return null;
  }
}

export async function createSessionToken(user: SessionUser, secret: string, now: Date = new Date()): Promise<string> {
  const iat = Math.floor(now.getTime() / 1000);
  const payload: SessionPayload = { ...user, iat, exp: iat + SESSION_TTL_SECONDS };
  return signPayload(payload, secret);
}

/** 回傳有效（簽章正確且未過期）的 session，否則 null */
export async function readSession(token: string | undefined | null, secret: string, now: Date = new Date()): Promise<SessionPayload | null> {
  const p = await verifyToken<SessionPayload>(token, secret);
  if (!p || typeof p.id !== "string" || typeof p.exp !== "number") return null;
  if (p.exp * 1000 <= now.getTime()) return null;
  return p;
}

export function parseCookies(header: string | null | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
}
