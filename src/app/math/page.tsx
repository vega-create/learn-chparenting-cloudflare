import type { Metadata } from "next";
import Link from "next/link";
import { MATH_TOPICS } from "@/data/math/topics";
import SubjectVisitTracker from "@/components/SubjectVisitTracker";
import { ToolIntroSection } from "@/components/ToolIntroSection";
import { ToolStructuredData } from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "國小數學免費練習｜四則運算線上練習題 - learn.chparenting.com",
  description: "免費國小數學線上練習，涵蓋四則運算、應用題、闖關模式。適合國小 1-6 年級，遊戲化學習讓孩子愛上數學。",
  keywords: ["國小數學練習", "四則運算練習", "國小數學題庫", "數學免費練習", "小學數學"],
  openGraph: {
    title: "國小數學免費練習｜四則運算線上練習題",
    description: "免費國小數學線上練習，涵蓋四則運算、應用題、闖關模式。遊戲化學習讓孩子愛上數學。",
    url: "https://learn.chparenting.com/math/",
    siteName: "learn.chparenting.com",
    locale: "zh_TW",
    type: "website",
  },
  alternates: { canonical: "https://learn.chparenting.com/math" },
};

const GRADE_GROUPS = [
  { label: "🌱 基礎（國小 1-3 年級）", ids: ["basic-arithmetic", "time-measurement"] },
  { label: "🌿 進階（國小 3-5 年級）", ids: ["fractions", "decimals", "geometry", "word-problems"] },
  { label: "🌳 挑戰（國小 5 年級～國中）", ids: ["percentages", "intro-algebra"] },
];

export default function MathPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <ToolStructuredData
        name="國小數學免費線上練習"
        description="專為國小生設計的免費數學練習平台，涵蓋四則運算和應用題"
        url="https://learn.chparenting.com/math/"
        educationalLevel="國小"
        subject="數學"
      />
      <SubjectVisitTracker subject="math" />
      <ToolIntroSection
        badge="免費數學練習"
        title="國小數學免費線上練習｜四則運算題庫"
        description="專為國小生設計的免費數學練習平台，涵蓋加減乘除四則運算和應用題。闖關模式讓孩子越練越有成就感，不像傳統測驗那麼枯燥。適合每天做完功課後當作小複習，也可以用來加強比較弱的單元。"
        highlights={[
          "四則運算、應用題完整題型",
          "闖關模式，練習更有動力",
          "適合國小 1-6 年級",
          "不需要帳號，免費直接練習",
        ]}
      />
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float">🔢</div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">數學練習</h2>
        <p className="text-slate-500">觀念教學 · 互動練習 · 限時挑戰 — 從基礎到進階</p>
      </div>

      {/* How to use */}
      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 mb-8">
        <h2 className="font-bold text-slate-800 mb-2">📖 學習方式</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm text-slate-600">
          <div className="flex gap-2"><span className="text-amber-500 font-bold">1.</span>先看<strong>觀念教學</strong>，理解原理和範例</div>
          <div className="flex gap-2"><span className="text-amber-500 font-bold">2.</span>做<strong>互動練習</strong>，每題都有詳解</div>
          <div className="flex gap-2"><span className="text-amber-500 font-bold">3.</span>挑戰<strong>限時計算</strong>，訓練速度和準確</div>
        </div>
      </div>

      {/* Topics by grade */}
      <div className="space-y-8">
        {GRADE_GROUPS.map((group) => (
          <div key={group.label}>
            <h2 className="text-xl font-bold text-slate-800 mb-4">{group.label}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.ids.map((id) => {
                const t = MATH_TOPICS.find((x) => x.id === id);
                if (!t) return null;
                return (
                  <Link key={t.id} href={`/math/${t.id}`}
                    className={`bg-white rounded-2xl overflow-hidden border ${t.border} shadow-sm hover-lift no-underline`}>
                    <div className={`bg-gradient-to-r ${t.color} p-4 text-white`}>
                      <div className="text-3xl mb-1">{t.icon}</div>
                      <div className="text-lg font-bold">{t.title}</div>
                      <div className="text-sm opacity-80">{t.grade}</div>
                    </div>
                    <div className="p-4">
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">📖 {t.concepts.length} 個觀念</span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-600">✏️ {t.practices.length} 題練習</span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-600">⏱️ 限時挑戰</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <a href="/" className="text-sm text-amber-500 hover:underline no-underline">← 回到首頁</a>
      </div>
    </div>
  );
}
