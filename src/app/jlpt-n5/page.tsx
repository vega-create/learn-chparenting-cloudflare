import { N5_UNITS } from "@/data/jlpt-n5";
import type { Metadata } from "next";
import Link from "next/link";
import SubjectVisitTracker from "@/components/SubjectVisitTracker";
import { ToolIntroSection } from "@/components/ToolIntroSection";
import { ToolStructuredData } from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "日文免費練習｜JLPT N5 線上題庫 - learn.chparenting.com",
  description: "免費日文線上練習，從五十音到 JLPT N5 單字、文法完整題庫。適合兒童和初學者入門，邊玩邊學日文最有效。",
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolStructuredData
        name="日文免費線上練習 JLPT N5"
        description="專為日文初學者和兒童設計的免費日文練習平台，從五十音到 JLPT N5"
        url="https://learn.chparenting.com/jlpt-n5/"
        educationalLevel="初學者"
        subject="日語"
      />
      <SubjectVisitTracker subject="jlpt" />
      <ToolIntroSection
        badge="免費日文練習"
        title="日文免費線上練習｜JLPT N5 入門題庫"
        description="專為日文初學者和兒童設計的免費日文練習平台。從五十音發音開始，到 JLPT N5 單字和文法，循序漸進學習。遊戲化的練習方式讓孩子在玩中學，不枯燥不壓力。適合想讓孩子接觸日文、或自己想從零開始學日文的家長使用。"
        highlights={[
          "五十音、N5 單字、文法完整練習",
          "遊戲化學習，孩子不排斥",
          "手機、平板、電腦都能使用",
          "不需要帳號，免費直接練習",
        ]}
      />
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🇯🇵</div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">JLPT N5 入門</h2>
        <p className="text-slate-500">基礎日文 · {N5_UNITS.reduce((sum, u) => sum + u.vocab.length, 0)}+ 單字 · 聽說讀寫完整練習</p>
      </div>

      {/* 五十音 Special Card */}
      <Link href="/jlpt-n5/gojuon"
        className="flex items-center gap-4 p-5 mb-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200 shadow-sm hover-lift no-underline">
        <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center text-3xl flex-shrink-0">あ</div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-red-500 mb-0.5">入門必修</div>
          <div className="text-lg font-bold text-slate-800">五十音 · 平假名 & 片假名</div>
          <div className="text-sm text-slate-400">互動學習表 · 發音練習 · 假名測驗</div>
        </div>
        <span className="text-red-300 text-xl">→</span>
      </Link>

      <div className="grid gap-4 mb-8">
        {N5_UNITS.map((u) => (
          <Link key={u.id} href={`/jlpt-n5/unit/${u.id}`}
            className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover-lift no-underline">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: u.color + "15" }}>{u.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold mb-0.5" style={{ color: u.color }}>Unit {u.id}</div>
              <div className="text-lg font-bold text-slate-800">{u.title}</div>
              <div className="text-sm text-slate-400">{u.titleJa} · {u.vocab.length} 單字 · {u.grammar.length} 文法</div>
            </div>
            <span className="text-slate-300 text-xl">→</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/jlpt-n5/speaking"
          className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200 hover-lift no-underline text-center">
          <div className="text-3xl mb-2">🎙️</div>
          <div className="font-bold text-slate-800">口說訓練</div>
          <div className="text-sm text-slate-500 mt-1">發音、跟讀、朗讀</div>
        </Link>
        <Link href="/jlpt-n5/writing"
          className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-200 hover-lift no-underline text-center">
          <div className="text-3xl mb-2">✍️</div>
          <div className="font-bold text-slate-800">寫作練習</div>
          <div className="text-sm text-slate-500 mt-1">句子重組、翻譯</div>
        </Link>
        <Link href="/jlpt-n5/game"
          className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 hover-lift no-underline text-center">
          <div className="text-3xl mb-2">🎮</div>
          <div className="font-bold text-slate-800">綜合遊戲</div>
          <div className="text-sm text-slate-500 mt-1">用遊戲複習全部單元</div>
        </Link>
        <Link href="/jlpt-n5/mock-test"
          className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover-lift no-underline text-center">
          <div className="text-3xl mb-2">📝</div>
          <div className="font-bold text-slate-800">模擬測驗</div>
          <div className="text-sm text-slate-500 mt-1">仿 JLPT 正式考試</div>
        </Link>
      </div>
    </div>
  );
}
