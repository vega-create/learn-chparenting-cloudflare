import { N5_UNITS } from "@/data/jlpt-n5";
import type { Metadata } from "next";
import { JlptLevelBody } from "@/components/JlptLevelBody";
import SubjectVisitTracker from "@/components/SubjectVisitTracker";
import { ToolStructuredData } from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "日文免費練習｜JLPT N5 線上題庫 - learn.chparenting.com",
  description: "JLPT N5 免費線上題庫：從五十音表開始，20 個主題單元的單字附發音、文法重點、聽力與練習題，每單元附給家長看的陪伴說明（今天練什麼、怎麼陪、常卡在哪）。適合兒童與零基礎初學者，不用註冊、手機就能練。",
  keywords: ["日文練習", "JLPT N5", "日文免費學習", "五十音練習", "兒童學日文", "N5題庫"],
  openGraph: {
    title: "日文免費練習｜JLPT N5 線上題庫",
    description: "免費日文線上練習，從五十音到 JLPT N5 單字、文法完整題庫。適合兒童和初學者入門。",
    url: "https://learn.chparenting.com/jlpt-n5/",
    siteName: "learn.chparenting.com",
    locale: "zh_TW",
    type: "website",
  },
  alternates: { canonical: "https://learn.chparenting.com/jlpt-n5" },
};

export default function JlptN5Page() {
  return (
    <>
      <ToolStructuredData
        name="日文免費線上練習 JLPT N5"
        description="專為日文初學者和兒童設計的免費日文練習平台，從五十音到 JLPT N5"
        url="https://learn.chparenting.com/jlpt-n5/"
        educationalLevel="初學者"
        subject="日語"
      />
      <SubjectVisitTracker subject="jlpt" />
      <JlptLevelBody
        level="n5"
        units={N5_UNITS}
        eyebrow="免費日文練習 · JLPT N5 入門"
        title="日文免費線上練習｜JLPT N5 入門題庫"
        desc={<>基礎日文 · {N5_UNITS.reduce((sum, u) => sum + u.vocab.length, 0)}+ 單字 · 聽說讀寫完整練習。從五十音開始，選一個單元就能練，不用註冊。</>}
        about={
          <>
            <p className="text-[#52616B] leading-relaxed mb-3">專為日文初學者和兒童設計的免費日文練習平台。從五十音發音開始，到 JLPT N5 單字和文法，循序漸進學習。遊戲化的練習方式讓孩子在玩中學，不枯燥不壓力。適合想讓孩子接觸日文、或自己想從零開始學日文的家長使用。</p>
            <ul className="space-y-1 text-sm text-[#263238] list-none p-0 m-0">
              <li>✓ 五十音、N5 單字、文法完整練習</li>
              <li>✓ 遊戲化學習，孩子不排斥</li>
              <li>✓ 手機、平板、電腦都能使用</li>
              <li>✓ 不需要帳號，免費直接練習</li>
            </ul>
          </>
        }
      />
    </>
  );
}
