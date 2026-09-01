#!/usr/bin/env node
// Generates src/data/content-dates.json — a map of route path → ISO date of the
// last real content change, used by src/app/sitemap.ts for <lastmod>.
//
// Why this exists: sitemap.ts used to emit `new Date()` for every URL, so all
// ~350 entries shared one build timestamp. Google treats an obviously
// machine-stamped lastmod as unreliable and ignores it, which left us with no
// way to signal that a page had actually changed.
//
// The JSON is committed so CI always has usable dates even when the build
// runs on a shallow clone with no git history.
//
// Runs automatically before `next build` (see "prebuild" in package.json).

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "src/data/content-dates.json");

/** Last git commit date for a file, or null when git can't tell us. */
function gitDate(relPath) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", relPath], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}

const seenGitDates = new Set();

/**
 * Newest date across the given repo-relative paths; skips ones that don't exist.
 *
 * mtime is only a sane fallback on a working checkout. On a CI clone every file
 * is written at checkout time, so mtime there would collapse all ~350 routes
 * onto one timestamp — exactly the unusable lastmod this script exists to avoid.
 * The caller guards against that by refusing to write when git gave us nothing.
 */
function newestDate(...relPaths) {
  const dates = [];
  for (const rel of relPaths) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) continue;
    const git = gitDate(rel);
    if (git) seenGitDates.add(git);
    dates.push(git ? new Date(git) : fs.statSync(abs).mtime);
  }
  if (!dates.length) return null;
  return new Date(Math.max(...dates.map((d) => d.getTime()))).toISOString();
}

/**
 * 每個路由額外要納入的「渲染來源」。
 *
 * 原本 set() 只吃資料檔與 page.tsx，但 2026-08-29 那批伺服器端內容是加在
 * src/components/seo/ 的元件與部分 layout.tsx 裡，資料檔完全沒動。結果 60 多頁
 * 內容大幅改變，lastmod 卻仍停在 2-3 月——Google 收不到「這頁變了」的訊號，
 * 正好是最需要被重新檢索的那批頁面。
 *
 * 因此把負責渲染該路由主要內容的元件也算進來：元件改了，日期就會動。
 */
const RENDER_SOURCES = [
  [/^\/(elementary|intermediate|upper-intermediate|jlpt-n[1-5])\/unit\/\d+$/,
    ["src/components/seo/UnitSEOContent.tsx", "src/lib/unit-guides.ts"]],
  [/^\/(elementary|intermediate|upper-intermediate|jlpt-n[1-5])\/writing$/,
    ["src/components/seo/WritingSEO.tsx"]],
  [/^\/board-games\/[a-z-]+$/, ["src/components/seo/BoardGameSEO.tsx", "src/data/board-games.ts"]],
  [/^\/math\/[a-z-]+$/, ["src/components/seo/MathTopicSEO.tsx"]],
  [/^\/finance\/[a-z-]+$/, ["src/components/seo/FinanceModuleSEO.tsx", "src/data/finance/seo.ts"]],
  [/^\/music\/[a-z]+\/[a-z-]+$/, ["src/components/seo/MusicTopicSEO.tsx"]],
  [/^\/history-geo\/[a-z]+\/[a-z-]+$/,
    ["src/components/seo/HistGeoSEOContent.tsx", "src/components/seo/PracticeTopicSEO.tsx"]],
  [/^\/chinese-lang\/[a-z]+\/[a-z-]+$/,
    ["src/components/seo/ChineseLangSEOContent.tsx", "src/components/seo/PracticeTopicSEO.tsx"]],
];

function renderSourcesFor(route) {
  const extra = [];
  for (const [re, files] of RENDER_SOURCES) if (re.test(route)) extra.push(...files);
  return extra.filter((f) => fs.existsSync(path.join(ROOT, f)));
}

const dates = {};
function set(route, ...sources) {
  const d = newestDate(...sources, ...renderSourcesFor(route));
  if (d) dates[route] = d;
}

// ── Platform pages ────────────────────────────────────────────────────────────
set("/", "src/app/page.tsx");
for (const p of ["about", "how-to-use", "faq", "achievements", "exam-info", "parent-guide"]) {
  set(`/${p}`, `src/app/${p}/page.tsx`);
}

// ── Blog ──────────────────────────────────────────────────────────────────────
const BLOG_DIR = path.join(ROOT, "src/content/blog");
if (fs.existsSync(BLOG_DIR)) {
  const posts = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  for (const file of posts) {
    set(`/blog/${file.replace(/\.md$/, "")}`, `src/content/blog/${file}`);
  }
  set("/blog", ...posts.map((f) => `src/content/blog/${f}`));
}

// ── GEPT + JLPT levels ────────────────────────────────────────────────────────
// [route segment, level data file, unit dir, unit filename prefix, unit count]
const LEVELS = [
  ["elementary", "src/data/elementary.ts", "src/data/units", "unit", 20],
  ["intermediate", "src/data/intermediate.ts", "src/data/intermediate-units", "iunit", 34],
  ["upper-intermediate", "src/data/upper-intermediate.ts", "src/data/upper-intermediate-units", "uiunit", 40],
  ["jlpt-n5", "src/data/jlpt-n5.ts", "src/data/jlpt-n5-units", "n5unit", 20],
  ["jlpt-n4", "src/data/jlpt-n4.ts", "src/data/jlpt-n4-units", "n4unit", 20],
  ["jlpt-n3", "src/data/jlpt-n3.ts", "src/data/jlpt-n3-units", "n3unit", 20],
  ["jlpt-n2", "src/data/jlpt-n2.ts", "src/data/jlpt-n2-units", "n2unit", 20],
  ["jlpt-n1", "src/data/jlpt-n1.ts", "src/data/jlpt-n1-units", "n1unit", 20],
];

for (const [level, levelFile, unitDir, prefix, count] of LEVELS) {
  const unitFiles = [];
  for (let i = 1; i <= count; i++) {
    const rel = `${unitDir}/${prefix}${i}.ts`;
    if (fs.existsSync(path.join(ROOT, rel))) unitFiles.push(rel);
    set(`/${level}/unit/${i}`, rel, levelFile);
  }
  // The level hub lists every unit, so it changes whenever any unit does.
  set(`/${level}`, levelFile, ...unitFiles);
  for (const sub of ["game", "speaking", "mock-test", "writing"]) {
    set(`/${level}/${sub}`, `src/app/${level}/${sub}/page.tsx`, levelFile);
  }
}
set("/jlpt-n5/gojuon", "src/app/jlpt-n5/gojuon/page.tsx", "src/data/jlpt-n5.ts");

// ── Board games & typing ──────────────────────────────────────────────────────
const BG_DIR = path.join(ROOT, "src/app/board-games");
if (fs.existsSync(BG_DIR)) {
  const games = fs
    .readdirSync(BG_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
  for (const g of games) set(`/board-games/${g}`, `src/app/board-games/${g}/page.tsx`);
  set("/board-games", "src/app/board-games/page.tsx", ...games.map((g) => `src/app/board-games/${g}/page.tsx`));
}
set("/typing-game", "src/app/typing-game/page.tsx", "src/data/typing");

// ── Topic sections (math / finance / chinese-lang / history-geo / music) ───────
// Each is a hub plus one page per topic; topic content lives under src/data/<section>.
const SECTIONS = [
  ["math", "src/data/math/topics.ts", "src/data/math/topics",
    ["basic-arithmetic", "fractions", "decimals", "percentages", "geometry", "intro-algebra", "word-problems", "time-measurement"]],
  ["finance", "src/data/finance/modules.ts", "src/data/finance/modules",
    ["money-basics", "needs-vs-wants", "savings-calculator", "allowance-budget", "red-envelope", "expense-tracker"]],
];
for (const [section, indexFile, topicDir, topics] of SECTIONS) {
  const topicFiles = [];
  for (const t of topics) {
    const rel = `${topicDir}/${t}.ts`;
    if (fs.existsSync(path.join(ROOT, rel))) topicFiles.push(rel);
    set(`/${section}/${t}`, rel, indexFile);
  }
  set(`/${section}`, indexFile, ...topicFiles);
}

// Nested sections: /<section>/<group>/<topic>
const NESTED = [
  ["chinese-lang", [
    ["lower", ["zhuyin", "characters", "vocabulary", "reading"]],
    ["middle", ["idioms", "reading", "writing"]],
    ["high", ["idioms", "reading", "grammar"]],
  ]],
  ["history-geo", [
    ["taiwan", ["taiwan-history", "taiwan-geography", "taiwan-culture"]],
    ["asia", ["asia-history", "asia-geography"]],
    ["world", ["world-history", "world-geography", "world-culture"]],
  ]],
  ["music", [
    ["intro", ["notes", "rhythm", "pitch"]],
    ["basic", ["scales", "intervals", "dynamics"]],
    ["advanced", ["chords", "form", "knowledge"]],
  ]],
];
for (const [section, groups] of NESTED) {
  const indexFile = `src/data/${section}/index.ts`;
  const allFiles = [];
  for (const [group, topics] of groups) {
    const groupFiles = [];
    for (const t of topics) {
      const rel = `src/data/${section}/${group}/${t}.ts`;
      if (fs.existsSync(path.join(ROOT, rel))) groupFiles.push(rel);
      set(`/${section}/${group}/${t}`, rel, indexFile);
    }
    set(`/${section}/${group}`, `src/data/${section}/${group}`, indexFile, ...groupFiles);
    allFiles.push(...groupFiles);
  }
  set(`/${section}`, indexFile, ...allFiles);
}

const sorted = Object.fromEntries(Object.entries(dates).sort(([a], [b]) => a.localeCompare(b)));
const distinct = new Set(Object.values(sorted)).size;

// Without real history there is nothing to derive dates from: a shallow clone
// resolves every file to the HEAD commit, and with no git at all we fall back to
// checkout mtime. Either way the result is one uniform timestamp — worse than
// the dates already committed, so keep those instead of clobbering them.
// The workflow checks out with fetch-depth: 0 so this should not trigger in CI.
if (seenGitDates.size <= 1 && fs.existsSync(OUT)) {
  const existing = JSON.parse(fs.readFileSync(OUT, "utf8"));
  const existingDistinct = new Set(Object.values(existing)).size;
  if (existingDistinct > seenGitDates.size) {
    console.warn(
      `[content-dates] only ${seenGitDates.size} distinct git date(s) available — ` +
      `keeping the committed dates (${Object.keys(existing).length} routes, ` +
      `${existingDistinct} distinct). Check that the checkout has full history.`,
    );
    process.exit(0);
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(sorted, null, 2) + "\n");
console.log(`[content-dates] wrote ${Object.keys(sorted).length} routes, ${distinct} distinct dates → ${path.relative(ROOT, OUT)}`);
