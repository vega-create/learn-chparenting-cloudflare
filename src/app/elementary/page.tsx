import { UNITS } from "@/data/elementary";
import type { Metadata } from "next";
import Link from "next/link";
import SubjectVisitTracker from "@/components/SubjectVisitTracker";

export const metadata: Metadata = {
  title: "全民英檢初級免費練習 | 單字・文法・聽力・閱讀・模擬考 | learn.chparenting.com",
  description: "免費全民英檢初級線上練習，包含 2000+ 單字、文法解析、聽力訓練、閱讀理解、模擬測驗、口說練習。適合國小中高年級，不用花補習費也能準備英檢。",
  alternates: { canonical: "https://learn.chparenting.com/elementary" },
};

export default function ElementaryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <SubjectVisitTracker subject="gept" />
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🌱</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">GEPT 初級</h1>
        <p className="text-slate-500">國中畢業程度 · 2000 單字 · 聽說讀寫 + 文法</p>
      </div>

      <div className="grid gap-4 mb-8">
        {UNITS.map((u) => (
          <Link key={u.id} href={`/elementary/unit/${u.id}`}
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
        <Link href="/elementary/speaking"
          className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200 hover-lift no-underline text-center">
          <div className="text-3xl mb-2">🎙️</div>
          <div className="font-bold text-slate-800">口說訓練</div>
          <div className="text-sm text-slate-500 mt-1">發音、跟讀、朗讀、問答</div>
        </Link>
        <Link href="/elementary/writing"
          className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-200 hover-lift no-underline text-center">
          <div className="text-3xl mb-2">✍️</div>
          <div className="font-bold text-slate-800">寫作練習</div>
          <div className="text-sm text-slate-500 mt-1">句子重組、翻譯、段落排序</div>
        </Link>
        <Link href="/elementary/game"
          className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 hover-lift no-underline text-center">
          <div className="text-3xl mb-2">🎮</div>
          <div className="font-bold text-slate-800">綜合遊戲練習</div>
          <div className="text-sm text-slate-500 mt-1">用遊戲複習全部單元</div>
        </Link>
        <Link href="/elementary/mock-test"
          className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover-lift no-underline text-center">
          <div className="text-3xl mb-2">📝</div>
          <div className="font-bold text-slate-800">模擬測驗</div>
          <div className="text-sm text-slate-500 mt-1">仿正式考試格式</div>
        </Link>
      </div>
    </div>
  );
}
