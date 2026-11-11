#!/usr/bin/env node
/**
 * 把 learn.chparenting.com 的資料從 Supabase（專案 lexcvc，多站共用，只讀）搬到 Cloudflare D1 `learn`。
 *
 *   node scripts/migrate-from-supabase.mjs <輸出資料夾> [--apply local|remote] [--skip-export]
 *
 *   <輸出資料夾>   含個資（email、auth users），請放專案外，例如 ~/learn-migration（不進 git）
 *   --apply local  寫進本機 D1（.wrangler/state，供 wrangler pages dev / next dev）
 *   --apply remote 寫進正式 D1，之後自動核對每張表筆數
 *   --skip-export  不重抓 Supabase，用資料夾裡已有的 *.json 重新產 data.sql
 *
 * 需要 .env.local（gitignore）裡的 SUPABASE_URL、SUPABASE_SERVICE_ROLE_KEY（只讀，不印出）。
 * 流程：PostgREST 分頁匯出 7 張表 + auth.users（admin API）→ data.sql（INSERT OR REPLACE，可重跑）→ wrangler d1 execute → 核對筆數。
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";

// ── 參數 ───────────────────────────────────────────────
const args = process.argv.slice(2);
const outDir = args.find((a) => !a.startsWith("--"));
const applyIdx = args.indexOf("--apply");
const applyTarget = applyIdx >= 0 ? args[applyIdx + 1] : null;
const skipExport = args.includes("--skip-export");
if (!outDir || (applyIdx >= 0 && !["local", "remote"].includes(applyTarget))) {
  console.error("用法：node scripts/migrate-from-supabase.mjs <輸出資料夾> [--apply local|remote] [--skip-export]");
  process.exit(2);
}
const OUT = resolve(outDir);
mkdirSync(OUT, { recursive: true });
const DB_NAME = "learn";
const PAGE = 1000;

// ── 表定義（D1 欄位；Supabase 多出的欄位會警告並略過）──────
const TABLES = [
  { name: "learning_activities", order: "id", cols: ["id", "user_id", "subject", "activity_type", "activity_id", "activity_name", "score", "max_score", "stars", "duration_seconds", "metadata", "completed_at"] },
  { name: "daily_checkins", order: "id", cols: ["id", "user_id", "checkin_date", "activity_count", "created_at"], optional: true },
  { name: "user_streaks", order: "user_id", cols: ["user_id", "current_streak", "longest_streak", "last_checkin_date", "updated_at"] },
  { name: "weekly_schedules", order: "id", cols: ["id", "user_id", "day_of_week", "activities", "updated_at"] },
  { name: "newsletter_subscribers", order: "id", cols: ["id", "email", "subscribed_at", "is_active", "source"] },
  { name: "daily_challenge_stats", order: "date,question_id", cols: ["date", "subject", "question_id", "total_attempts", "correct_attempts"] },
  { name: "practice_counts", order: "id", cols: ["id", "total", "updated_at"] },
];
const USERS_COLS = ["id", "email", "name", "avatar", "google_sub", "created_at", "last_login_at"];
const TS_COLS = new Set(["created_at", "last_login_at", "completed_at", "updated_at", "subscribed_at"]);
const DATE_COLS = new Set(["checkin_date", "last_checkin_date", "date"]);
const JSON_COLS = new Set(["metadata", "activities"]);
const BOOL_COLS = new Set(["is_active"]);
const USER_FK_TABLES = new Set(["learning_activities", "daily_checkins", "user_streaks", "weekly_schedules"]);

// ── 讀 .env.local（不印任何值）────────────────────────────
function loadEnv() {
  const env = { ...process.env };
  const p = resolve(".env.local");
  if (existsSync(p)) {
    for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !(m[1] in env)) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return env;
}

// ── Supabase 匯出 ──────────────────────────────────────
async function exportAll() {
  const env = loadEnv();
  const url = (env.SUPABASE_URL || "").replace(/\/$/, "");
  const key = env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !key) {
    console.error("缺 SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY。請先執行（不會印出內容）：");
    console.error("  { grep '^SUPABASE_URL=' ~/mommywisdom-tw/.env; grep '^SUPABASE_SERVICE_ROLE_KEY=' ~/mommywisdom-tw/.env; } >> .env.local");
    process.exit(2);
  }
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  const counts = {};

  for (const t of TABLES) {
    const rows = [];
    for (let from = 0; ; from += PAGE) {
      const res = await fetch(`${url}/rest/v1/${t.name}?select=*&order=${t.order}`, {
        headers: { ...headers, Range: `${from}-${from + PAGE - 1}`, Prefer: "count=exact" },
      });
      if (res.status === 404 && t.optional) { console.log(`- ${t.name}: Supabase 沒有這張表，略過`); break; }
      if (!res.ok && res.status !== 416) throw new Error(`${t.name} 匯出失敗 HTTP ${res.status}`);
      const page = res.status === 416 ? [] : await res.json();
      rows.push(...page);
      if (page.length < PAGE) break;
    }
    writeFileSync(join(OUT, `${t.name}.json`), JSON.stringify(rows, null, 1));
    counts[t.name] = rows.length;
    console.log(`- ${t.name}: ${rows.length} 筆`);
  }

  // auth.users（GoTrue admin API）
  const users = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${url}/auth/v1/admin/users?page=${page}&per_page=${PAGE}`, { headers });
    if (!res.ok) throw new Error(`auth users 匯出失敗 HTTP ${res.status}`);
    const j = await res.json();
    const list = j.users ?? [];
    users.push(...list);
    if (list.length < PAGE) break;
  }
  writeFileSync(join(OUT, "auth_users.json"), JSON.stringify(users, null, 1));
  counts.auth_users = users.length;
  console.log(`- auth.users: ${users.length} 筆（含其他站的使用者，稍後只挑 Google 或有學習紀錄的）`);
  writeFileSync(join(OUT, "manifest.json"), JSON.stringify({ exportedAt: new Date().toISOString(), counts }, null, 2));
}

// ── 轉成 D1 的 users 列 ──────────────────────────────────
function buildUsers(authUsers, referencedIds) {
  const out = [];
  let skipped = 0;
  for (const u of authUsers) {
    const identities = u.identities ?? [];
    const google = identities.find((i) => i.provider === "google");
    const isGoogle = !!google || u.app_metadata?.provider === "google";
    if (!isGoogle && !referencedIds.has(u.id)) { skipped++; continue; }
    const md = u.user_metadata ?? {};
    out.push({
      id: u.id,
      email: (u.email || google?.identity_data?.email || "").toLowerCase(),
      name: md.full_name || md.name || google?.identity_data?.full_name || google?.identity_data?.name || null,
      avatar: md.avatar_url || md.picture || google?.identity_data?.avatar_url || google?.identity_data?.picture || null,
      google_sub: google?.identity_data?.sub || google?.id || null,
      created_at: u.created_at,
      last_login_at: u.last_sign_in_at || null,
    });
  }
  const noEmail = out.filter((u) => !u.email).length;
  if (noEmail) console.warn(`! ${noEmail} 位使用者沒有 email，會略過（users.email NOT NULL）`);
  return { users: out.filter((u) => u.email), skipped };
}

// ── SQL 產生 ───────────────────────────────────────────
function lit(col, v) {
  if (v === null || v === undefined) return "NULL";
  if (TS_COLS.has(col)) { const d = new Date(v); return isNaN(d) ? "NULL" : `'${d.toISOString()}'`; }
  if (DATE_COLS.has(col)) return `'${String(v).slice(0, 10)}'`;
  if (BOOL_COLS.has(col)) return v ? "1" : "0";
  if (JSON_COLS.has(col)) return `'${(typeof v === "string" ? v : JSON.stringify(v)).replace(/'/g, "''")}'`;
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "NULL";
  if (typeof v === "boolean") return v ? "1" : "0";
  if (typeof v === "object") return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
  return `'${String(v).replace(/'/g, "''")}'`;
}
function insertSql(table, cols, row) {
  const present = cols.filter((c) => row[c] !== undefined);
  return `INSERT OR REPLACE INTO ${table} (${present.join(", ")}) VALUES (${present.map((c) => lit(c, row[c])).join(", ")});`;
}

function buildSql() {
  const read = (n) => (existsSync(join(OUT, `${n}.json`)) ? JSON.parse(readFileSync(join(OUT, `${n}.json`), "utf8")) : null);
  const data = Object.fromEntries(TABLES.map((t) => [t.name, read(t.name)]));
  const authUsers = read("auth_users") ?? [];

  const referencedIds = new Set();
  for (const t of TABLES) if (USER_FK_TABLES.has(t.name)) for (const r of data[t.name] ?? []) referencedIds.add(r.user_id);
  const { users, skipped } = buildUsers(authUsers, referencedIds);
  const userIds = new Set(users.map((u) => u.id));

  const lines = ["-- generated by scripts/migrate-from-supabase.mjs at " + new Date().toISOString(), "PRAGMA defer_foreign_keys = ON;"];
  const expected = { users: users.length };
  for (const u of users) lines.push(insertSql("users", USERS_COLS, u));
  console.log(`- users: ${users.length} 筆要匯入（略過非本站使用者 ${skipped} 位）`);

  for (const t of TABLES) {
    const rows = data[t.name];
    if (!rows) { console.log(`- ${t.name}: 沒有匯出檔，略過`); continue; }
    const extra = new Set();
    let orphans = 0;
    const seen = new Set();
    let dup = 0;
    for (const r of rows) {
      for (const k of Object.keys(r)) if (!t.cols.includes(k)) extra.add(k);
      if (USER_FK_TABLES.has(t.name) && !userIds.has(r.user_id)) { orphans++; continue; }
      const key = t.order.split(",").map((c) => r[c]).join("|");
      if (seen.has(key)) dup++;
      seen.add(key);
      lines.push(insertSql(t.name, t.cols, r));
    }
    expected[t.name] = seen.size;
    if (extra.size) console.warn(`! ${t.name}: Supabase 多出欄位 ${[...extra].join(", ")}（未搬）`);
    if (orphans) console.warn(`! ${t.name}: ${orphans} 筆的 user_id 不在 users 裡，略過`);
    if (dup) console.warn(`! ${t.name}: ${dup} 筆主鍵重複，INSERT OR REPLACE 後只會留最後一筆`);
    console.log(`- ${t.name}: ${rows.length} 筆 → 預期 D1 ${seen.size} 筆`);
  }
  const sqlPath = join(OUT, "data.sql");
  writeFileSync(sqlPath, lines.join("\n") + "\n");
  writeFileSync(join(OUT, "expected-counts.json"), JSON.stringify(expected, null, 2));
  console.log(`→ ${sqlPath}（${lines.length - 2} 筆 INSERT）`);
  return { sqlPath, expected };
}

// ── 套進 D1 並核對 ──────────────────────────────────────
function wrangler(argv) {
  const r = spawnSync("npx", ["wrangler", ...argv], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (r.status !== 0) throw new Error(`wrangler ${argv.slice(0, 3).join(" ")} 失敗：\n${(r.stderr || r.stdout).slice(-800)}`);
  return r.stdout;
}
function apply(sqlPath, expected, target) {
  const flag = target === "remote" ? "--remote" : "--local";
  console.log(`\n寫入 D1 ${DB_NAME}（${target}）...`);
  wrangler(["d1", "execute", DB_NAME, flag, "--file", sqlPath, "--yes"]);
  console.log("核對筆數：");
  let bad = 0;
  for (const [table, want] of Object.entries(expected)) {
    const out = wrangler(["d1", "execute", DB_NAME, flag, "--json", "--command", `SELECT COUNT(*) AS n FROM ${table}`]);
    const m = out.match(/\[\s*\{[\s\S]*\]\s*$/);
    const got = m ? JSON.parse(m[0])[0]?.results?.[0]?.n : undefined;
    const ok = got === want;
    const more = typeof got === "number" && got > want;
    if (!ok && !more) bad++;
    console.log(`  ${ok ? "✓" : more ? "!" : "✗"} ${table.padEnd(24)} Supabase ${String(want).padStart(5)}  D1 ${String(got).padStart(5)}${more ? "  （D1 比匯出多：D1 先前已有資料，例如網站已切換或本機測試）" : ""}`);
  }
  if (bad) { console.error(`\n✗ ${bad} 張表 D1 筆數少於匯出，請檢查上面的錯誤`); process.exit(1); }
  console.log("\n✓ 核對完成：每張表 D1 都有匯出的筆數");
}

// ── main ───────────────────────────────────────────────
if (!skipExport) await exportAll();
const { sqlPath, expected } = buildSql();
if (applyTarget) apply(sqlPath, expected, applyTarget);
else console.log("\n（沒帶 --apply，只產生 data.sql。加 --apply local 或 --apply remote 寫進 D1）");
