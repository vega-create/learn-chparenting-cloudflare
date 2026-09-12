#!/usr/bin/env node
// 把最近有變動的頁面提交給 IndexNow（Bing / Yahoo / DuckDuckGo / Ecosia 共用索引）。
//
// 為什麼要有這支：learn 的搜尋流量六成五來自 Bing 系索引，但過去只放了金鑰檔
// （public/<key>.txt）而沒有任何程式在提交網址，新頁面得等 Bing 自己爬到。
// 在部署之後跑這支，變動的頁面幾小時內就能進索引。
//
// 選頁方式：src/data/content-dates.json 的日期（各路由最後一次真實內容變動）
// 在 INDEXNOW_DAYS 天內者。prebuild 會先重算這個檔，所以本次 push 改到的頁面
// 一定在裡面。失敗只印訊息不擋部署（workflow 用 continue-on-error）。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HOST = "learn.chparenting.com";
const KEY = "eaba7a414a18bb24b472bd8618967eae"; // public/<KEY>.txt 已上線
const DAYS = Number(process.env.INDEXNOW_DAYS || 3);
const DRY = process.argv.includes("--dry-run");

const dates = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/content-dates.json"), "utf8"));
const since = Date.now() - DAYS * 86400e3;
const routes = Object.entries(dates)
  .filter(([, d]) => new Date(d).getTime() >= since)
  .map(([r]) => r);
const extra = (process.env.INDEXNOW_URLS || "").split(",").map((s) => s.trim()).filter(Boolean);
const urlList = [...new Set([...routes.map((r) => `https://${HOST}${r}`), ...extra])].slice(0, 10000);

if (!urlList.length) { console.log(`[indexnow] 最近 ${DAYS} 天沒有變動的頁面，略過`); process.exit(0); }
console.log(`[indexnow] 準備提交 ${urlList.length} 個網址（最近 ${DAYS} 天）：`);
urlList.slice(0, 20).forEach((u) => console.log("  " + u));
if (urlList.length > 20) console.log(`  … 另 ${urlList.length - 20} 個`);
if (DRY) process.exit(0);

const body = { host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList };
try {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(body),
  });
  console.log(`[indexnow] HTTP ${res.status} ${res.statusText}`);
  // 200 = 已接收；202 = 已接收、金鑰待驗證；其他狀態印出內容方便排查
  if (res.status !== 200 && res.status !== 202) console.log(await res.text());
} catch (e) { console.log("[indexnow] 提交失敗（不影響部署）：", e.message); }
