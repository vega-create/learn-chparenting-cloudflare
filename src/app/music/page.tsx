import type { Metadata } from "next";
import Link from "next/link";
import { MUSIC_LEVELS, getTotalQuestionCount } from "@/data/music";

export const metadata: Metadata = {
  title: "免費樂理基礎練習 | 音符・音階・和弦・音樂常識 | learn.chparenting.com",
  description:
    "免費樂理基礎線上練習，涵蓋音符休止符、節拍拍號、音高譜號、音階調性、音程和弦、曲式結構、音樂常識。互動式選擇題即時回饋。",
  alternates: { canonical: "https://learn.chparenting.com/music" },
};

export default function MusicPage() {
  const total = getTotalQuestionCount();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float">🎵</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">樂理基礎</h1>
        <p className="text-slate-500">
          音符 · 節拍 · 音階 · 和弦 — 從入門到進階
        </p>
        <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-sm text-pink-600 font-medium">
          🎶 {total}+ 題免費練習
        </div>
      </div>

      {/* 學習方式 */}
      <div className="bg-pink-50 rounded-2xl p-6 border border-pink-200 mb-8">
        <h2 className="font-bold text-slate-800 mb-2">🎼 學習方式</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm text-slate-600">
          <div className="flex gap-2">
            <span className="text-pink-500 font-bold">1.</span>選擇<strong>程度等級</strong>，從入門開始
          </div>
          <div className="flex gap-2">
            <span className="text-pink-500 font-bold">2.</span>做<strong>互動練習</strong>，每題都有詳解
          </div>
          <div className="flex gap-2">
            <span className="text-pink-500 font-bold">3.</span>循序漸進，<strong>建立樂理基礎</strong>
          </div>
        </div>
      </div>

      {/* 等級卡片 */}
      <div className="space-y-6">
        {MUSIC_LEVELS.map((level) => {
          const qCount = level.topics.reduce((s, t) => s + t.questions.length, 0);
          return (
            <Link
              key={level.id}
              href={`/music/${level.id}`}
              className="block bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover-lift no-underline transition-all hover:shadow-lg"
            >
              <div
                className={`bg-gradient-to-r ${level.color} p-5 text-white`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{level.icon}</span>
                  <div>
                    <div className="text-xl font-bold">{level.title}</div>
                    <div className="text-sm opacity-80">
                      {level.topics.length} 個主題 · {qCount} 題練習
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex gap-2 flex-wrap">
                  {level.topics.map((t) => (
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
          className="text-sm text-pink-500 hover:underline no-underline"
        >
          ← 回到首頁
        </a>
      </div>
    </div>
  );
}
