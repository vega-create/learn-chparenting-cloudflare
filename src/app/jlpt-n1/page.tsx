import { N1_UNITS } from "@/data/jlpt-n1";
import type { Metadata } from "next";
import { JlptLevelBody } from "@/components/JlptLevelBody";

export const metadata: Metadata = {
  title: "JLPT N1 日文檢定免費練習 | 高級單字・文法・聽力 | learn.chparenting.com",
  description: "JLPT N1 免費線上題庫：20 個主題單元（媒體、全球化、比較文化等），高級單字附發音、文法、學術聽力與進階閱讀，另有計時模擬測驗與寫作練習，每單元附常見卡點說明。適合日文高級學習者備考 N1，不用註冊、手機平板都能用。",
  alternates: { canonical: "https://learn.chparenting.com/jlpt-n1" },
};

export default function JlptN1Page() {
  return (
    <JlptLevelBody
      level="n1"
      units={N1_UNITS}
      eyebrow="日文學習"
      title="JLPT N1 最上級"
      desc={<>最上級日文 · {N1_UNITS.reduce((sum, u) => sum + u.vocab.length, 0)}+ 單字 · 聽說讀寫完整練習。選一個單元或模式就能開始，不用註冊。</>}
      about={
        <>
          <p className="text-[#52616B] leading-relaxed mb-3">N1 是日本語能力試驗最高級，涵蓋抽象議題的閱讀、細膩的文法區別與自然語速的聽力。適合準備最高級檢定的學習者。題庫共 {N1_UNITS.length} 個主題單元，單字附發音，搭配文法重點、聽力與閱讀練習，另有單字遊戲、口說、寫作與計時模擬測驗，每單元附陪伴說明。</p>
          <ul className="space-y-1 text-sm text-[#263238] list-none p-0 m-0">
            <li>✓ 單字、文法、聽力、閱讀完整題型</li>
            <li>✓ 手機、平板、電腦都能使用</li>
            <li>✓ 不需要帳號，免費直接練習</li>
          </ul>
        </>
      }
    />
  );
}
