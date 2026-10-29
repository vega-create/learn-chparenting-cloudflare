import { UNITS } from "@/data/elementary";
import UnitPhotoCard from "@/components/UnitPhotoCard";
import { unitImage } from "@/data/unit-images";
import type { Metadata } from "next";
import { GeptLevelNav } from "@/components/GeptLevelNav";
import SubjectVisitTracker from "@/components/SubjectVisitTracker";
import { GeptExamBanner } from "@/components/GeptExamBanner";
import { ToolStructuredData } from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "全民英檢初級題庫｜GEPT 初級免費線上練習（單字・聽力・模擬測驗） - learn.chparenting.com",
  description: "全民英檢初級免費線上題庫：20 個主題單元，單字附發音、文法重點、聽力與閱讀練習，另有單字遊戲、口說錄音、寫作四種題型與計時模擬測驗，每單元附家長陪伴說明與練習單 PDF。適合國小高年級到國中備考，不用註冊。",
  keywords: ["GEPT初級", "全民英檢初級", "英檢初級練習", "國小英檢", "GEPT初級題庫", "英檢免費練習"],
  openGraph: {
    title: "全民英檢初級題庫｜GEPT 初級免費線上練習",
    description: "免費 GEPT 全民英檢初級線上練習，涵蓋單字、文法、聽力、閱讀完整題庫。適合國小 5-6 年級備考。",
    url: "https://learn.chparenting.com/elementary/",
    siteName: "learn.chparenting.com",
    locale: "zh_TW",
    type: "website",
  },
  alternates: { canonical: "https://learn.chparenting.com/elementary" },
};

export default function ElementaryPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ToolStructuredData
        name="全民英檢初級題庫｜GEPT 初級免費線上練習"
        description="專為國小 5-6 年級備考 GEPT 全民英檢初級設計的免費線上練習平台"
        url="https://learn.chparenting.com/elementary/"
        educationalLevel="國小"
        subject="英語"
      />
      <SubjectVisitTracker subject="gept" />
      <header className="mb-5">
        <div className="text-sm font-bold text-[#E65E83] mb-1">英文與英檢</div>
        <h1 className="text-[26px] md:text-4xl font-black text-[#263238] mb-2">全民英檢初級免費練習</h1>
        <p className="text-[15px] md:text-lg text-[#52616B]">國中畢業程度 · 約 2000 單字 · 20 個主題單元，選一個單元或模式就能開始，不用註冊。</p>
      </header>

      <GeptLevelNav level="elementary" />

      <GeptExamBanner level="elementary" />

      <h2 className="text-xl md:text-2xl font-bold text-[#263238] border-l-4 border-[#E65E83] pl-3 mb-4">主題單元</h2>
      <div className="grid md:grid-cols-2 gap-3 mb-8">
        {UNITS.map((u) => (
          <UnitPhotoCard key={u.id} href={`/elementary/unit/${u.id}`}
            unitLabel={`Unit ${u.id}`} title={u.title} color={u.color}
            meta={`${u.vocab.length} 單字 · ${u.grammar.length} 文法 · ${u.listening.length + (Array.isArray(u.reading) ? u.reading.reduce((sum, r) => sum + r.questions.length, 0) : u.reading.questions.length) + u.quiz.length} 題練習`}
            image={unitImage("elementary", u.id)} icon={u.icon} />
        ))}
      </div>

      <section className="mt-10 p-6 bg-white rounded-2xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-2">關於這個題庫</h2>
        <p className="text-slate-600 leading-relaxed mb-3">給準備 GEPT 全民英檢初級的人免費練習：國小高年級、國中生，或想重新打好英文基礎的大人都適用。題庫涵蓋單字、文法、聽力、閱讀四大題型，完整對應英檢初級考試範圍。每個單元練習完成後，可下載練習單 PDF 在紙上再練一次，線上線下搭配，學習效果更好。不需要帳號，免費直接開始練習。</p>
        <ul className="space-y-1 text-sm text-slate-700 list-none p-0 m-0">
          <li>✓ 單字、文法、聽力、閱讀完整題型</li>
          <li>✓ 每單元附練習單 PDF 免費下載</li>
          <li>✓ 手機、平板、電腦都能使用</li>
          <li>✓ 不需要帳號，免費直接練習</li>
        </ul>
      </section>
    </div>
  );
}
