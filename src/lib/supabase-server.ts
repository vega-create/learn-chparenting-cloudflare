// 舊名字保留，讓既有 API route 的 import 與查詢寫法一行都不用改。
// 實際上已經是 Cloudflare D1（見 src/lib/db.ts 與 src/lib/d1-compat.ts），Supabase 不再使用。
import { getDb } from "./db";

export async function createServerSupabaseClient() {
  return getDb();
}
