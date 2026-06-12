import { Metadata } from "next";

/**
 * Shared SEO helpers for every /[level]/unit/[id] page.
 *
 * The original page.tsx was a one-liner that rendered a "use client"
 * ClientPage. Initial HTML was empty + zero metadata, which is why
 * Google Search Console reported 324 pages as
 *   「已檢索 - 目前尚未建立索引」(Crawled, currently not indexed)
 * — Google saw 8 levels × 20-40 units of near-identical thin pages.
 *
 * This module gives each page:
 *   1. A unique <title> + <description> via generateUnitMetadata().
 *   2. A canonical URL.
 *   3. A LearningResource JSON-LD payload via unitLearningResourceJsonLd().
 *
 * The companion server component (components/seo/UnitSEOContent.tsx)
 * renders ~500+ characters of unique text per unit using the unit's
 * own vocab/grammar data, so the initial HTML is no longer thin.
 */

const BASE = "https://learn.chparenting.com";

// ── Level metadata used by every level's page.tsx ────────────────────
export interface LevelInfo {
  slug:           string;  // "elementary"
  pathSegment:    string;  // "/elementary/unit"
  displayName:    string;  // "GEPT 初級"
  testFamily:     "GEPT" | "JLPT";
  cefr?:          string;  // "A2"
  language:       "en" | "ja";
  educationalLevel: string; // "Elementary" | "Intermediate" | "Beginner" | "Advanced" ...
  totalUnits:     number;
  longSummary:    string;  // 1-line description for OG / FAQ
}

export const LEVELS: Record<string, LevelInfo> = {
  "elementary":         { slug: "elementary",         pathSegment: "/elementary/unit",         displayName: "GEPT 初級",     testFamily: "GEPT", cefr: "A2", language: "en", educationalLevel: "Elementary",            totalUnits: 20, longSummary: "對應國中畢業英文程度，適合國小高年級到國中生" },
  "intermediate":       { slug: "intermediate",       pathSegment: "/intermediate/unit",       displayName: "GEPT 中級",     testFamily: "GEPT", cefr: "B1", language: "en", educationalLevel: "Intermediate",          totalUnits: 34, longSummary: "對應高中畢業英文程度，適合高中生與大專生" },
  "upper-intermediate": { slug: "upper-intermediate", pathSegment: "/upper-intermediate/unit", displayName: "GEPT 中高級",   testFamily: "GEPT", cefr: "B2", language: "en", educationalLevel: "UpperIntermediate",     totalUnits: 40, longSummary: "對應大學畢業英文程度，適合大專以上學習者" },
  "jlpt-n5":            { slug: "jlpt-n5",            pathSegment: "/jlpt-n5/unit",            displayName: "JLPT N5",       testFamily: "JLPT",             language: "ja", educationalLevel: "Beginner",              totalUnits: 20, longSummary: "JLPT 最入門等級，掌握 800 個基礎日文單字與基本文法" },
  "jlpt-n4":            { slug: "jlpt-n4",            pathSegment: "/jlpt-n4/unit",            displayName: "JLPT N4",       testFamily: "JLPT",             language: "ja", educationalLevel: "Beginner",              totalUnits: 20, longSummary: "JLPT 基礎等級，掌握 1,500 個常用日文單字與日常文法" },
  "jlpt-n3":            { slug: "jlpt-n3",            pathSegment: "/jlpt-n3/unit",            displayName: "JLPT N3",       testFamily: "JLPT",             language: "ja", educationalLevel: "Intermediate",          totalUnits: 20, longSummary: "JLPT 中級等級，掌握 3,750 個日文單字與進階文法句型" },
  "jlpt-n2":            { slug: "jlpt-n2",            pathSegment: "/jlpt-n2/unit",            displayName: "JLPT N2",       testFamily: "JLPT",             language: "ja", educationalLevel: "Advanced",              totalUnits: 20, longSummary: "JLPT 中高級，掌握 6,000 個日文單字與商用會話" },
  "jlpt-n1":            { slug: "jlpt-n1",            pathSegment: "/jlpt-n1/unit",            displayName: "JLPT N1",       testFamily: "JLPT",             language: "ja", educationalLevel: "Advanced",              totalUnits: 20, longSummary: "JLPT 最高等級，掌握 10,000 個日文單字與專業領域文章" },
};

// ── Minimal unit shape that satisfies both GEPT + JLPT data ───────────
export interface UnitSEOInput {
  id:        number;
  title:     string;
  titleJa?:  string;   // only JLPT units have this
  icon?:     string;
  vocabCount:    number;
  grammarCount:  number;
  listeningCount: number;
  /** First few vocab keywords — used in description for keyword density */
  vocabPreview: string[];
  /** First few grammar titles — used in description */
  grammarPreview: string[];
}

// ── generateMetadata helper ───────────────────────────────────────────
export function generateUnitMetadata(level: LevelInfo, unit: UnitSEOInput | undefined): Metadata {
  if (!unit) {
    return { title: `找不到單元 | ${level.displayName}` };
  }

  const titlePart = unit.titleJa
    ? `${unit.title}（${unit.titleJa}）`
    : unit.title;

  const title = `${level.displayName} Unit ${unit.id}：${titlePart}｜免費線上練習與單字表`;

  const vocabSnippet  = unit.vocabPreview.slice(0, 4).join("、");
  const grammarSnippet = unit.grammarPreview.slice(0, 2).join("、");

  const description = `${level.displayName} Unit ${unit.id}「${unit.title}」主題練習：${unit.vocabCount} 個重點單字（${vocabSnippet}…）、${unit.grammarCount} 個文法（${grammarSnippet}…）、${unit.listeningCount} 題聽力，含閱讀理解與測驗。免費線上練習，可下載練習單。`;

  const canonical = `${BASE}${level.pathSegment}/${unit.id}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "親子多元學習平台",
      type: "article",
      locale: level.language === "ja" ? "ja_JP" : "zh_TW",
      images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  };
}

// ── LearningResource JSON-LD ──────────────────────────────────────────
export function unitLearningResourceJsonLd(level: LevelInfo, unit: UnitSEOInput) {
  const url = `${BASE}${level.pathSegment}/${unit.id}`;
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": url,
    name: `${level.displayName} Unit ${unit.id}：${unit.title}`,
    url,
    inLanguage: level.language === "ja" ? "ja-JP" : "en",
    description: `${level.displayName}「${unit.title}」主題單元，含 ${unit.vocabCount} 個單字、${unit.grammarCount} 個文法重點、${unit.listeningCount} 題聽力練習。`,
    educationalLevel: level.educationalLevel,
    learningResourceType: "Lesson",
    teaches: unit.vocabPreview.slice(0, 6).join(", "),
    isPartOf: {
      "@type": "Course",
      name: `${level.displayName} 完整課程`,
      provider: {
        "@type": "Organization",
        name: "親子多元學習平台",
        url: BASE,
      },
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
  };
}
