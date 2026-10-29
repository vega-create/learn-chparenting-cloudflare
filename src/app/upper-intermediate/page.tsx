import { UI_UNITS as UNITS } from "@/data/upper-intermediate";
import type { Metadata } from "next";
import Link from "next/link";
import { GeptLevelNav } from "@/components/GeptLevelNav";

export const metadata: Metadata = {
  title: "全民英檢中高級免費練習 | 8000+ 單字・進階文法・模擬考 | learn.chparenting.com",
  description: "全民英檢中高級免費線上題庫：40 個主題單元，進階單字附發音、複雜句型與文法、長篇聽力、學術閱讀，另有單字遊戲、口說錄音、寫作練習與計時模擬測驗。適合高中生與進階英文學習者備考，不用註冊、手機平板都能用。",
  alternates: { canonical: "https://learn.chparenting.com/upper-intermediate" },
};

export default function ElementaryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-5 text-center">
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">全民英檢中高級免費練習</h1>
        <p className="text-slate-600">大學畢業程度 · 約 8000 單字 · 40 個主題單元，選一個單元或模式就能開始，不用註冊。</p>
      </header>

      <GeptLevelNav level="upper-intermediate" />

      <h2 className="text-lg font-bold text-slate-800 mb-3">主題單元</h2>
      <div className="grid gap-4 mb-8">
        {UNITS.map((u) => (
          <Link key={u.id} href={`/upper-intermediate/unit/${u.id}`}
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
    </div>
  );
}
