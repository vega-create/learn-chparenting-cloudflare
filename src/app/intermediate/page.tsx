import { INTER_UNITS as UNITS } from "@/data/intermediate";
import type { Metadata } from "next";
import Link from "next/link";
import { GeptLevelNav } from "@/components/GeptLevelNav";
import { GeptExamBanner } from "@/components/GeptExamBanner";
import { ToolStructuredData } from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "全民英檢中級題庫｜GEPT 中級免費線上練習（單字・聽力・閱讀） - learn.chparenting.com",
  description: "全民英檢中級免費線上題庫：34 個主題單元，單字附發音與重音提示、文法、聽力與閱讀練習，另有單字遊戲、口說錄音、寫作四種題型與計時模擬測驗，每單元附家長陪伴說明與練習單 PDF。適合國中生、高中生備考，不用註冊。",
  keywords: ["GEPT中級", "全民英檢中級", "英檢中級練習", "英檢中級題庫", "GEPT中級免費"],
  openGraph: {
    title: "全民英檢中級題庫｜GEPT 中級免費線上練習",
    description: "免費 GEPT 全民英檢中級線上練習，涵蓋單字、文法、聽力、閱讀完整題庫。",
    url: "https://learn.chparenting.com/intermediate/",
    siteName: "learn.chparenting.com",
    locale: "zh_TW",
    type: "website",
  },
  alternates: { canonical: "https://learn.chparenting.com/intermediate" },
};

export default function ElementaryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolStructuredData
        name="全民英檢中級題庫｜GEPT 中級免費線上練習"
        description="專為備考 GEPT 全民英檢中級設計的免費線上練習平台，適合國中生、高中生"
        url="https://learn.chparenting.com/intermediate/"
        educationalLevel="國中"
        subject="英語"
      />
      <header className="mb-5 text-center">
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">全民英檢中級免費練習</h1>
        <p className="text-slate-600">高中畢業程度 · 約 5000 單字 · 34 個主題單元，選一個單元或模式就能開始，不用註冊。</p>
      </header>

      <GeptLevelNav level="intermediate" />

      <GeptExamBanner level="intermediate" />

      <h2 className="text-lg font-bold text-slate-800 mb-3">主題單元</h2>
      <div className="grid gap-4 mb-8">
        {UNITS.map((u) => (
          <Link key={u.id} href={`/intermediate/unit/${u.id}`}
            className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover-lift no-underline">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: u.color + "15" }}>{u.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold mb-0.5" style={{ color: u.color }}>Unit {u.id}</div>
              <div className="text-lg font-bold text-slate-800">{u.title}</div>
              <div className="text-sm text-slate-400">{u.vocab.length} 單字 · {u.grammar.length} 文法 · {u.listening.length + (Array.isArray(u.reading) ? u.reading.reduce((sum, r) => sum + r.questions.length, 0) : u.reading.questions.length) + u.quiz.length} 題練習</div>
            </div>
            <span className="text-slate-300 text-xl">→</span>
          </Link>
        ))}
      </div>

      <section className="mt-10 p-6 bg-white rounded-2xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-2">關於這個題庫</h2>
        <p className="text-slate-600 leading-relaxed mb-3">專為備考 GEPT 全民英檢中級設計的免費線上練習平台，適合國中生、高中生使用。題庫涵蓋中級程度的單字、文法、聽力、閱讀，完整對應英檢中級考試範圍。每個單元可下載練習單 PDF，搭配線上練習反覆熟悉題型。不需要帳號，免費直接開始。</p>
        <ul className="space-y-1 text-sm text-slate-700 list-none p-0 m-0">
          <li>✓ 中級程度單字、文法、聽力、閱讀</li>
          <li>✓ 每單元附練習單 PDF 免費下載</li>
          <li>✓ 完整對應 GEPT 中級考試範圍</li>
          <li>✓ 不需要帳號，免費直接練習</li>
        </ul>
      </section>
    </div>
  );
}
