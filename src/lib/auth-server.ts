/**
 * 伺服器端登入狀態（edge runtime）。
 * - 從 cookie 讀 session（簽章 + 到期檢查）
 * - Google OAuth 登入後把使用者對應到 users 表（先比 google_sub，再比 email；都沒有就建新列）
 */
import { getD1, getSecret } from "./db";
import { parseCookies, readSession, SESSION_COOKIE, type SessionPayload, type SessionUser } from "./session";

export async function getSessionUser(request: Request): Promise<SessionPayload | null> {
  const secret = getSecret("AUTH_SECRET");
  if (!secret) return null;
  const cookies = parseCookies(request.headers.get("cookie"));
  return readSession(cookies[SESSION_COOKIE], secret);
}

export interface GoogleProfile {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  google_sub: string | null;
}

/** 以 Google 資料找或建使用者；回傳 session 要放的欄位 */
export async function upsertUserFromGoogle(profile: GoogleProfile): Promise<SessionUser> {
  const db = getD1();
  if (!db) throw new Error("D1 binding DB not available");
  const email = profile.email.trim().toLowerCase();
  const name = profile.name?.trim() || null;
  const avatar = profile.picture || null;
  const now = new Date().toISOString();

  const existing =
    (await db.prepare("SELECT id, email, name, avatar, google_sub FROM users WHERE google_sub = ?").bind(profile.sub).first<UserRow>()) ??
    (await db.prepare("SELECT id, email, name, avatar, google_sub FROM users WHERE email = ?").bind(email).first<UserRow>());

  if (existing) {
    await db
      .prepare("UPDATE users SET email = ?, name = ?, avatar = ?, google_sub = ?, last_login_at = ? WHERE id = ?")
      .bind(email, name ?? existing.name, avatar ?? existing.avatar, profile.sub, now, existing.id)
      .run();
    return { id: existing.id, email, name: name ?? existing.name, avatar: avatar ?? existing.avatar };
  }

  const id = crypto.randomUUID();
  await db
    .prepare("INSERT INTO users (id, email, name, avatar, google_sub, created_at, last_login_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .bind(id, email, name, avatar, profile.sub, now, now)
    .run();
  return { id, email, name, avatar };
}
