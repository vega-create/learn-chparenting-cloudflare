/**
 * 取得 Cloudflare 請求環境（D1 binding `DB`、secrets）。
 *
 * next-on-pages 在正式環境與 `next dev`（next.config.mjs 的 setupDevPlatform）都把
 * { env, cf, ctx } 放在 globalThis[Symbol.for("__cloudflare-request-context__")]，
 * 這裡直接讀那個 symbol，不 import @cloudflare/next-on-pages（避免拉進 workers-types 全域型別）。
 * 只能在 `export const runtime = "edge"` 的 route handler 裡呼叫。
 */
import { D1Client, type D1Like } from "./d1-compat";

export interface CfEnv {
  DB?: D1Like;
  AUTH_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  NEXT_PUBLIC_SITE_URL?: string;
  [key: string]: unknown;
}

const CF_CTX = Symbol.for("__cloudflare-request-context__");

export function getCfEnv(): CfEnv {
  const ctx = (globalThis as unknown as Record<symbol, { env?: CfEnv } | undefined>)[CF_CTX];
  return ctx?.env ?? {};
}

/** 先看 Cloudflare env（Pages secrets / .dev.vars），再退回 process.env（本機 .env.local） */
export function getSecret(name: "AUTH_SECRET" | "GOOGLE_CLIENT_ID" | "GOOGLE_CLIENT_SECRET"): string | undefined {
  const v = getCfEnv()[name];
  if (typeof v === "string" && v) return v;
  const p = process.env[name];
  return p && p.length ? p : undefined;
}

export function getD1(): D1Like | null {
  return getCfEnv().DB ?? null;
}

/** supabase-js 風格的 D1 client；沒有 binding 時每個查詢回傳 error.code = "NO_DB"（不會丟例外） */
export function getDb(): D1Client {
  return new D1Client(getD1());
}
