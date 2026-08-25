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

let gitDateCount = 0;

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
    if (git) gitDateCount++;
    dates.push(git ? new Date(git) : fs.statSync(abs).mtime);
  }
  if (!dates.length) return null;
  return new Date(Math.max(...dates.map((d) => d.getTime()))).toISOString();
}

const dates = {};
function set(route, ...sources) {
  const d = newestDate(...sources);
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

// Cloudflare Pages builds from a clone with no usable history, so `git log`
// returns nothing and every date above is really just checkout time. Writing
// that would clobber the committed dates with one uniform timestamp — worse
// than the file we already have. Keep the committed copy instead.
if (gitDateCount === 0 && fs.existsSync(OUT)) {
  const existing = Object.keys(JSON.parse(fs.readFileSync(OUT, "utf8"))).length;
  console.log(
    `[content-dates] git history unavailable — keeping committed dates (${existing} routes). ` +
    `Run this locally and commit the result to refresh them.`,
  );
  process.exit(0);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(sorted, null, 2) + "\n");
console.log(`[content-dates] wrote ${Object.keys(sorted).length} routes, ${distinct} distinct dates → ${path.relative(ROOT, OUT)}`);
