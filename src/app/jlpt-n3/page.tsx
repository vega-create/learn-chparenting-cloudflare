import { N3_UNITS } from "@/data/jlpt-n3";
import type { Metadata } from "next";
import { JlptLevelBody } from "@/components/JlptLevelBody";

export const metadata: Metadata = {
  title: "JLPT N3 日文檢定免費練習 | 中級單字・文法・聽力 | learn.chparenting.com",
  description: "JLPT N3 免費線上題庫：20 個主題單元的中級單字附發音、文法重點、聽力理解與閱讀測驗，另有單字遊戲、口說、寫作與計時模擬測驗，每單元附陪伴說明。適合從 N4 往上、準備 N3 的學習者，不用註冊、手機平板都能用。",
  alternates: { canonical: "https://learn.chparenting.com/jlpt-n3" },
};

export default function JlptN3Page() {
  return (
    <JlptLevelBody
      level="n3"
      units={N3_UNITS}
      eyebrow="日文學習"
      title="JLPT N3 中級"
      desc={<>中級日文 · {N3_UNITS.reduce((sum, u) => sum + u.vocab.length, 0)}+ 單字 · 聽說讀寫完整練習。選一個單元或模式就能開始，不用註冊。</>}
      about={
        <>
          <p className="text-[#52616B] leading-relaxed mb-3">N3 是從基礎跨到中級的一級，單字與文法量明顯增加，閱讀與聽力也開始需要理解較長的內容。適合從 N4 往上、準備 N3 的學習者。題庫共 {N3_UNITS.length} 個主題單元，單字附發音，搭配文法重點、聽力與閱讀練習，另有單字遊戲、口說、寫作與計時模擬測驗，每單元附陪伴說明。</p>
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
