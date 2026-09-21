#!/usr/bin/env node
// 排程發文：把 src/content/blog-scheduled/ 裡 date 已到的文章複製進 src/content/blog/。
// 在 prebuild 最前面跑，所以 blog 列表、sitemap、llms.txt、content-dates 全部不用改。
// 複製出來的檔案沒有 git 歷史，content-dates 會用建置當下的時間當 lastmod——剛好就是上架日，
// IndexNow 也會因此把它當成「最近 3 天變動」送出。
//   --due-today：只回報「今天有沒有文章到期」（給排程 workflow 判斷要不要部署），exit 0 = 有。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src/content/blog-scheduled");
const DST = path.join(ROOT, "src/content/blog");
const today = process.env.PUBLISH_DATE || new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" });
const checkOnly = process.argv.includes("--due-today");

const files = fs.existsSync(SRC) ? fs.readdirSync(SRC).filter((f) => f.endsWith(".md")) : [];
let dueToday = 0, copied = 0;
for (const f of files) {
  const { data } = matter(fs.readFileSync(path.join(SRC, f), "utf8"));
  const date = String(data.date || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { console.log(`[scheduled] ⚠️ ${f} 沒有合法的 date，略過`); continue; }
  if (date === today) dueToday++;
  if (checkOnly || date > today) continue;
  if (!fs.existsSync(path.join(DST, f))) { fs.copyFileSync(path.join(SRC, f), path.join(DST, f)); copied++; console.log(`[scheduled] 上架 ${f}（${date}）`); }
}
if (checkOnly) { console.log(`[scheduled] ${today} 到期 ${dueToday} 篇`); process.exit(dueToday ? 0 : 1); }
console.log(`[scheduled] 排程 ${files.length} 篇，本次上架 ${copied} 篇（今天 ${today}）`);
