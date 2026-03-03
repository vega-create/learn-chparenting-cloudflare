"use client";
import { usePathname } from "next/navigation";

// Segments that don't have their own page — render as text, not links
const NON_LINKABLE = new Set(["answers", "guide"]);

const ROUTE_LABELS: Record<string, string> = {
  "": "首頁",
  "elementary": "初級英檢",
  "intermediate": "中級英檢",
  "upper-intermediate": "中高級英檢",
  "answers": "答案",
  "game": "遊戲練習",
  "mock-test": "模擬測驗",
  "speaking": "口說練習",
  "writing": "寫作練習",
  "unit": "單元",
  "about": "關於我們",
  "how-to-use": "使用說明",
  "faq": "常見問題",
  "login": "登入",
  "dashboard": "學習紀錄",
  "gept": "全民英檢",
  "jlpt-n5": "JLPT N5",
  "jlpt-n4": "JLPT N4",
  "jlpt-n3": "JLPT N3",
  "jlpt-n2": "JLPT N2",
  "jlpt-n1": "JLPT N1",
  "gojuon": "五十音",
  "typing-game": "打字練習",
  "board-games": "教育桌遊",
  "go-game": "圍棋",
  "chinese-checkers": "跳棋",
  "math": "數學練習",
  "basic-arithmetic": "基礎運算",
  "fractions": "分數",
  "decimals": "小數",
  "percentages": "百分比",
  "geometry": "幾何",
  "intro-algebra": "代數入門",
  "word-problems": "應用題",
  "time-measurement": "時間與計量",
  "chinese-lang": "國語學習",
  "lower": "低年級",
  "middle": "中年級",
  "high": "高年級",
  "zhuyin": "注音符號",
  "characters": "國字練習",
  "vocabulary": "詞語練習",
  "idioms": "成語練習",
  "grammar": "修辭文法",
  "history-geo": "歷史地理",
  "taiwan": "台灣篇",
  "taiwan-history": "台灣歷史",
  "taiwan-geography": "台灣地理",
  "taiwan-culture": "台灣文化",
  "asia": "亞洲篇",
  "asia-history": "亞洲歷史",
  "asia-geography": "亞洲地理",
  "world": "世界篇",
  "world-history": "世界歷史",
  "world-geography": "世界地理",
  "world-culture": "世界文化",
  "music": "樂理基礎",
  "intro": "入門篇",
  "notes": "音符與休止符",
  "rhythm": "節拍與拍號",
  "pitch": "音高與譜號",
  "scales": "音階與調性",
  "intervals": "音程",
  "dynamics": "力度與速度記號",
  "chords": "和弦",
  "form": "曲式結構",
  "knowledge": "音樂常識",
  "finance": "兒童理財",
  "money-basics": "認識金錢",
  "needs-vs-wants": "需要 vs 想要",
  "savings-calculator": "儲蓄計算機",
  "allowance-budget": "零用錢分配",
  "red-envelope": "紅包理財",
  "expense-tracker": "記帳小達人",
  "schedule": "學習計畫",
  "records": "學習紀錄",
};

interface BreadcrumbItem {
  label: string;
  href: string;
  noLink?: boolean;
}

function buildCrumbs(pathname: string): BreadcrumbItem[] {
  if (pathname === "/") return [];

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: BreadcrumbItem[] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const href = "/" + segments.slice(0, i + 1).join("/");

    // Unit detail pages: show "Unit X"
    if (segments[i - 1] === "unit" && /^\d+$/.test(seg)) {
      crumbs.push({ label: `Unit ${seg}`, href });
    } else if (seg === "unit") {
      // Skip the "unit" segment itself — we show "Unit X" instead
      continue;
    } else if (/^unit-\d+$/.test(seg)) {
      // Answer pages: /elementary/answers/unit-01 → "第1單元"
      const num = parseInt(seg.replace("unit-", ""), 10);
      crumbs.push({ label: `第${num}單元`, href });
    } else {
      crumbs.push({ label: ROUTE_LABELS[seg] || seg, href, noLink: NON_LINKABLE.has(seg) });
    }
  }

  return crumbs;
}

export default function Breadcrumb() {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname);

  if (crumbs.length === 0) return null;

  const SITE_URL = "https://learn.chparenting.com";

  // BreadcrumbList JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首頁", item: SITE_URL },
      ...crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: c.label,
        item: `${SITE_URL}${c.href}`,
      })),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="breadcrumb" className="max-w-6xl mx-auto px-4 py-3">
        <ol className="flex items-center gap-1 text-sm text-slate-400 flex-wrap">
          <li>
            <a href="/" className="hover:text-rose-400 transition no-underline">首頁</a>
          </li>
          {crumbs.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1">
              <span className="text-slate-300">/</span>
              {i === crumbs.length - 1 || c.noLink ? (
                <span className={i === crumbs.length - 1 ? "text-slate-600 font-medium" : ""}>{c.label}</span>
              ) : (
                <a href={c.href} className="hover:text-rose-400 transition no-underline">{c.label}</a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
