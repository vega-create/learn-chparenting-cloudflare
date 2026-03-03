import type { Metadata } from "next";
import Link from "next/link";
import { HISTORY_GEO_REGIONS, getTotalQuestionCount } from "@/data/history-geo";
import SubjectVisitTracker from "@/components/SubjectVisitTracker";

export const metadata: Metadata = {
  title: "免費歷史地理練習 | 台灣・亞洲・世界 | learn.chparenting.com",
  description:
    "免費歷史地理線上練習，涵蓋台灣歷史地理文化、亞洲歷史地理、世界歷史地理文化。互動式選擇題即時回饋，適合國小高年級到國中。",
  alternates: { canonical: "https://learn.chparenting.com/history-geo" },
};

export default function HistoryGeoPage() {
  const total = getTotalQuestionCount();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SubjectVisitTracker subject="history-geo" />
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float">🌏</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">歷史地理</h1>
        <p className="text-slate-500">
          台灣 · 亞洲 · 世界 — 歷史、地理、文化
        </p>
        <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-sm text-emerald-600 font-medium">
          📚 {total}+ 題免費練習
        </div>
      </div>

      {/* 學習方式 */}
      <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 mb-8">
        <h2 className="font-bold text-slate-800 mb-2">📖 學習方式</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm text-slate-600">
          <div className="flex gap-2">
            <span className="text-emerald-500 font-bold">1.</span>選擇<strong>地區範圍</strong>，從台灣到世界
          </div>
          <div className="flex gap-2">
            <span className="text-emerald-500 font-bold">2.</span>做<strong>互動練習</strong>，每題都有詳解
          </div>
          <div className="flex gap-2">
            <span className="text-emerald-500 font-bold">3.</span>學習<strong>歷史文化</strong>，拓展國際視野
          </div>
        </div>
      </div>

      {/* 區域卡片 */}
      <div className="space-y-6">
        {HISTORY_GEO_REGIONS.map((region) => {
          const qCount = region.topics.reduce(
            (s, t) =>
              s +
              t.questions.length +
              (t.readings?.reduce((rs, r) => rs + r.questions.length, 0) ?? 0),
            0
          );
          return (
            <Link
              key={region.id}
              href={`/history-geo/${region.id}`}
              className="block bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover-lift no-underline transition-all hover:shadow-lg"
            >
              <div
                className={`bg-gradient-to-r ${region.color} p-5 text-white`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{region.icon}</span>
                  <div>
                    <div className="text-xl font-bold">{region.title}</div>
                    <div className="text-sm opacity-80">
                      {region.topics.length} 個主題 · {qCount} 題練習
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex gap-2 flex-wrap">
                  {region.topics.map((t) => (
                    <span
                      key={t.id}
                      className="text-xs px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200"
                    >
                      {t.icon} {t.title}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <a
          href="/"
          className="text-sm text-emerald-500 hover:underline no-underline"
        >
          ← 回到首頁
        </a>
      </div>
    </div>
  );
}
