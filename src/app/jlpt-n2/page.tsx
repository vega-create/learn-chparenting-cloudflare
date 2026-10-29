import { N2_UNITS } from "@/data/jlpt-n2";
import type { Metadata } from "next";
import { JlptLevelBody } from "@/components/JlptLevelBody";

export const metadata: Metadata = {
  title: "JLPT N2 日文檢定免費練習 | 進階單字・文法・聽力 | learn.chparenting.com",
  description: "JLPT N2 免費線上題庫：20 個主題單元（商業、醫療、法律、環境等），進階單字附發音、文法重點、長篇聽力與閱讀理解，另有計時模擬測驗與寫作練習，每單元附常見卡點說明。適合準備 N2 的學習者，不用註冊、手機平板都能用。",
  alternates: { canonical: "https://learn.chparenting.com/jlpt-n2" },
};

export default function JlptN2Page() {
  return (
    <JlptLevelBody
      level="n2"
      units={N2_UNITS}
      eyebrow="日文學習"
      title="JLPT N2 上級"
      desc={<>上級日文 · {N2_UNITS.reduce((sum, u) => sum + u.vocab.length, 0)}+ 單字 · 聽說讀寫完整練習。選一個單元或模式就能開始，不用註冊。</>}
      about={
        <>
          <p className="text-[#52616B] leading-relaxed mb-3">N2 接近日常與職場可用的程度，閱讀文章較長、文法細節多。適合已通過 N3、想挑戰上級的學習者。題庫共 {N2_UNITS.length} 個主題單元，單字附發音，搭配文法重點、聽力與閱讀練習，另有單字遊戲、口說、寫作與計時模擬測驗，每單元附陪伴說明。</p>
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
