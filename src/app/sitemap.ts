import { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/blog";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://learn.chparenting.com";

function unitIds(count: number) {
  return Array.from({ length: count }, (_, i) => i + 1);
}

function levelPages(level: string, unitCount: number, priority: number) {
  return [
    { url: `${BASE}/${level}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority },
    ...unitIds(unitCount).map(id => ({
      url: `${BASE}/${level}/unit/${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: priority - 0.1,
    })),
    { url: `${BASE}/${level}/game`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: priority - 0.1 },
    { url: `${BASE}/${level}/speaking`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: priority - 0.1 },
    { url: `${BASE}/${level}/mock-test`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: priority - 0.1 },
    { url: `${BASE}/${level}/writing`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: priority - 0.1 },
  ];
}

const BOARD_GAMES = [
  "pattern-master", "mini-sudoku", "sequence-quest",
  "code-path", "logic-gates", "loop-builder",
  "memory-match", "memory-sequence",
  "color-tap", "whack-a-mole",
  "math-rush", "speed-sort",
  "word-chain", "word-search",
  "maze-runner", "emoji-puzzle",
  "go-game", "chinese-checkers",
];

const MATH_TOPICS = [
  "basic-arithmetic", "fractions", "decimals", "percentages",
  "geometry", "intro-algebra", "word-problems", "time-measurement",
];

const FINANCE_MODULES = [
  "money-basics", "needs-vs-wants", "savings-calculator",
  "allowance-budget", "red-envelope", "expense-tracker",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Platform pages
    { url: BASE, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/how-to-use`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/achievements`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/exam-info`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/parent-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },

    // Blog
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    ...getAllSlugs().map(slug => ({
      url: `${BASE}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    // GEPT levels
    ...levelPages("elementary", 20, 0.9),
    ...levelPages("intermediate", 34, 0.8),
    ...levelPages("upper-intermediate", 40, 0.8),

    // JLPT levels
    ...levelPages("jlpt-n5", 20, 0.8),
    { url: `${BASE}/jlpt-n5/gojuon`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    ...levelPages("jlpt-n4", 20, 0.8),
    ...levelPages("jlpt-n3", 20, 0.8),
    ...levelPages("jlpt-n2", 20, 0.7),
    ...levelPages("jlpt-n1", 20, 0.7),

    // Board games
    { url: `${BASE}/board-games`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    ...BOARD_GAMES.map(id => ({
      url: `${BASE}/board-games/${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),

    // Typing game
    { url: `${BASE}/typing-game`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },

    // Math section
    { url: `${BASE}/math`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    ...MATH_TOPICS.map(id => ({
      url: `${BASE}/math/${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    // Finance section
    { url: `${BASE}/finance`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    ...FINANCE_MODULES.map(id => ({
      url: `${BASE}/finance/${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    // Chinese language section
    { url: `${BASE}/chinese-lang`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    ...["lower", "middle", "high"].map(id => ({
      url: `${BASE}/chinese-lang/${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    // History & geography section
    { url: `${BASE}/history-geo`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    ...["taiwan", "asia", "world"].map(id => ({
      url: `${BASE}/history-geo/${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    // Music section
    { url: `${BASE}/music`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    ...["intro", "basic", "advanced"].map(id => ({
      url: `${BASE}/music/${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
