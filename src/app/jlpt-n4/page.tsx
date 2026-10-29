import { N4_UNITS } from "@/data/jlpt-n4";
import type { Metadata } from "next";
import { JlptLevelBody } from "@/components/JlptLevelBody";

export const metadata: Metadata = {
  title: "JLPT N4 日文檢定免費練習 | 單字・文法・聽力・模擬考 | learn.chparenting.com",
  description: "JLPT N4 免費線上題庫：20 個主題單元，て形、比較句型、敬語稱呼等 N4 關鍵文法，單字附發音，聽力、閱讀與計時模擬測驗，每單元附家長陪伴說明與常見卡點。適合已有 N5 基礎的學習者，不用註冊、手機平板都能用。",
  alternates: { canonical: "https://learn.chparenting.com/jlpt-n4" },
};

export default function JlptN4Page() {
  return (
    <JlptLevelBody
      level="n4"
      units={N4_UNITS}
      eyebrow="日文學習"
      title="JLPT N4 基礎"
      desc={<>基礎日文 · {N4_UNITS.reduce((sum, u) => sum + u.vocab.length, 0)}+ 單字 · 聽說讀寫完整練習。選一個單元或模式就能開始，不用註冊。</>}
      about={
        <>
          <p className="text-[#52616B] leading-relaxed mb-3">N4 在 N5 之後，加入て形、比較句型、敬語稱呼等關鍵文法。適合已有 N5 基礎、想再往上一級的大人或孩子。題庫共 {N4_UNITS.length} 個主題單元，單字附發音，搭配文法重點、聽力與閱讀練習，另有單字遊戲、口說、寫作與計時模擬測驗，每單元附陪伴說明。</p>
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
