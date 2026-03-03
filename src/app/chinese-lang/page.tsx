import type { Metadata } from "next";
import Link from "next/link";
import { CHINESE_GRADES, getTotalQuestionCount } from "@/data/chinese-lang";

export const metadata: Metadata = {
  title: "免費國小國語練習 | 注音・生字・成語・閱讀 | learn.chparenting.com",
  description:
    "免費國小國語線上練習，包含注音符號、生字筆畫、詞語造句、成語典故、閱讀理解、修辭文法。低中高年級完整涵蓋，互動式題目即時回饋。",
  alternates: { canonical: "https://learn.chparenting.com/chinese-lang" },
};

export default function ChineseLangPage() {
  const total = getTotalQuestionCount();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float">📝</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">國語學習</h1>
        <p className="text-slate-500">
          注音 · 生字 · 成語 · 閱讀 — 小一到小六
        </p>
        <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-sm text-orange-600 font-medium">
          📚 {total}+ 題免費練習
        </div>
      </div>

      {/* 學習方式 */}
      <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200 mb-8">
        <h2 className="font-bold text-slate-800 mb-2">📖 學習方式</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm text-slate-600">
          <div className="flex gap-2">
            <span className="text-orange-500 font-bold">1.</span>選擇<strong>年級程度</strong>，找到適合的主題
          </div>
          <div className="flex gap-2">
            <span className="text-orange-500 font-bold">2.</span>做<strong>互動練習</strong>，每題都有詳解
          </div>
          <div className="flex gap-2">
            <span className="text-orange-500 font-bold">3.</span>挑戰<strong>閱讀理解</strong>，訓練分析能力
          </div>
        </div>
      </div>

      {/* 年級卡片 */}
      <div className="space-y-6">
        {CHINESE_GRADES.map((grade) => {
          const qCount = grade.topics.reduce(
            (s, t) =>
              s +
              t.questions.length +
              (t.readings?.reduce((rs, r) => rs + r.questions.length, 0) ?? 0),
            0
          );
          return (
            <Link
              key={grade.id}
              href={`/chinese-lang/${grade.id}`}
              className="block bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover-lift no-underline transition-all hover:shadow-lg"
            >
              <div
                className={`bg-gradient-to-r ${grade.color} p-5 text-white`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{grade.icon}</span>
                  <div>
                    <div className="text-xl font-bold">{grade.title}</div>
                    <div className="text-sm opacity-80">
                      {grade.topics.length} 個主題 · {qCount} 題練習
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex gap-2 flex-wrap">
                  {grade.topics.map((t) => (
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
          className="text-sm text-orange-500 hover:underline no-underline"
        >
          ← 回到首頁
        </a>
      </div>
    </div>
  );
}
