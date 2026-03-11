import { INTER_UNITS as UNITS } from "@/data/intermediate";
import type { Metadata } from "next";
import Link from "next/link";
import { ToolIntroSection } from "@/components/ToolIntroSection";
import { ToolStructuredData } from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "GEPT 中級免費練習題庫｜全民英檢中級線上測驗 - learn.chparenting.com",
  description: "免費 GEPT 全民英檢中級線上練習，涵蓋單字、文法、聽力、閱讀完整題庫。適合國中生、高中生備考，每單元附練習單 PDF 可下載。",
  keywords: ["GEPT中級", "全民英檢中級", "英檢中級練習", "英檢中級題庫", "GEPT中級免費"],
  openGraph: {
    title: "GEPT 中級免費練習題庫｜全民英檢中級線上測驗",
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
        name="GEPT 中級免費練習題庫"
        description="專為備考 GEPT 全民英檢中級設計的免費線上練習平台，適合國中生、高中生"
        url="https://learn.chparenting.com/intermediate/"
        educationalLevel="國中"
        subject="英語"
      />
      <ToolIntroSection
        badge="免費線上練習"
        title="GEPT 中級免費練習題庫"
        description="專為備考 GEPT 全民英檢中級設計的免費線上練習平台，適合國中生、高中生使用。題庫涵蓋中級程度的單字、文法、聽力、閱讀，完整對應英檢中級考試範圍。每個單元可下載練習單 PDF，搭配線上練習反覆熟悉題型。不需要帳號，免費直接開始。"
        highlights={[
          "中級程度單字、文法、聽力、閱讀",
          "每單元附練習單 PDF 免費下載",
          "完整對應 GEPT 中級考試範圍",
          "不需要帳號，免費直接練習",
        ]}
      />
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">⚡</div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">GEPT 中級</h2>
        <p className="text-slate-500">高中畢業程度 · 5000 單字 · 聽說讀寫 + 文法</p>
      </div>

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/intermediate/speaking"
          className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200 hover-lift no-underline text-center">
          <div className="text-3xl mb-2">🎙️</div>
          <div className="font-bold text-slate-800">口說訓練</div>
          <div className="text-sm text-slate-500 mt-1">發音、跟讀、朗讀、問答</div>
        </Link>
        <Link href="/intermediate/writing"
          className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-200 hover-lift no-underline text-center">
          <div className="text-3xl mb-2">✍️</div>
          <div className="font-bold text-slate-800">寫作練習</div>
          <div className="text-sm text-slate-500 mt-1">句子重組、翻譯、段落排序</div>
        </Link>
        <Link href="/intermediate/game"
          className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 hover-lift no-underline text-center">
          <div className="text-3xl mb-2">🎮</div>
          <div className="font-bold text-slate-800">綜合遊戲練習</div>
          <div className="text-sm text-slate-500 mt-1">用遊戲複習全部單元</div>
        </Link>
        <Link href="/intermediate/mock-test"
          className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover-lift no-underline text-center">
          <div className="text-3xl mb-2">📝</div>
          <div className="font-bold text-slate-800">模擬測驗</div>
          <div className="text-sm text-slate-500 mt-1">仿正式考試格式</div>
        </Link>
      </div>
    </div>
  );
}
