import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "關於我們 | learn.chparenting.com 免費親子學習平台",
  description: "一位媽媽因為想幫自己的孩子準備英檢，開始做了這個免費學習平台。希望每個孩子都能快樂學習，不用擔心補習費。",
  alternates: { canonical: "https://learn.chparenting.com/about" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "關於親子多元學習平台",
  url: "https://learn.chparenting.com/about",
  mainEntity: {
    "@type": "Organization",
    name: "智慧媽咪國際有限公司 Mommy Wisdom International LTD.",
    url: "https://aimommywisdom.com",
    description: "專注於數位行銷與教育科技，打造免費親子學習平台。",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ─── Header ─── */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🌸</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">關於這個平台</h1>
        <p className="text-rose-300 font-medium">一位媽媽的小小心願</p>
      </div>

      {/* ─── Origin Story ─── */}
      <div className="bg-gradient-to-b from-rose-50/60 to-orange-50/40 rounded-2xl p-8 border border-rose-200 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-5">💕 為什麼做這個網站？</h2>

        <div className="border-l-3 border-rose-200 pl-5 mb-5">
          <p className="text-slate-600 leading-8 mb-4">
            身為兩個孩子的媽媽，平常身兼數職外，對小孩的教育一直很關心。
          </p>
          <p className="text-slate-600 leading-8 mb-4">
            平常已經有線上與老師的課程學習，但深知語言需要多練習的我。
          </p>
          <p className="text-slate-600 leading-8 mb-4">
            想要幫自己的孩子找一個好用的英檢練習工具。
          </p>
          <p className="text-slate-600 leading-8 mb-4">
            內容可以是包含：聽、說、讀、寫。
          </p>
          <p className="text-slate-600 leading-8 mb-4">
            市面上的資源很多與我想要的有落差，有的介面也太複雜。
            身為一個有網站開發能力的媽媽，我想：<strong>「不如自己做一個吧。」</strong>
          </p>
          <p className="text-slate-600 leading-8 mb-4">
            做著做著，從英檢變成了日檢，又加了桌遊、數學、打字、理財⋯⋯
            每多做一個功能，就會想到：<em>「其他家庭的孩子可能也需要吧？」</em>
          </p>
          <p className="text-slate-700 leading-8 font-medium">
            如果這些工具能幫到更多的孩子，讓他們在家也能快樂地學習，那就太好了。
            所以，我決定讓這個平台<strong className="text-rose-400">完全免費</strong>。
          </p>
          <p className="text-slate-700 leading-8 font-medium">
            不管大人小孩，只要有興趣都可以一起學習。
          </p>
        </div>
      </div>

      {/* ─── Beliefs ─── */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-5">🌟 我們相信</h2>
        <div className="space-y-4">
          {[
            { icon: "🌈", text: "好的學習資源，不該只有付得起補習費的家庭才能擁有。" },
            { icon: "🧒", text: "每個孩子都值得用自己的步調，快樂地學習和成長。" },
            { icon: "🎮", text: "學習不該是壓力，而是一段充滿好奇心的探索旅程。" },
            { icon: "👨‍👩‍👧‍👦", text: "家長陪伴孩子學習的時光，是最珍貴的親子時刻。" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50">
              <span className="text-xl mt-0.5">{item.icon}</span>
              <p className="text-slate-600 leading-7">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Current Tools ─── */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-5">📚 目前提供的學習工具</h2>
        <div className="space-y-3">
          <a href="/elementary" className="flex items-center gap-4 p-4 rounded-xl bg-rose-50 border border-rose-100 hover:shadow-md transition no-underline">
            <span className="text-3xl">📘</span>
            <div>
              <div className="font-bold text-slate-800">全民英檢 GEPT</div>
              <div className="text-sm text-slate-500">94 單元 · 8,000+ 單字 · 初級到中高級 · 聽說讀寫完整練習</div>
            </div>
            <span className="ml-auto text-rose-300">→</span>
          </a>
          <a href="/jlpt-n5" className="flex items-center gap-4 p-4 rounded-xl bg-red-50 border border-red-100 hover:shadow-md transition no-underline">
            <span className="text-3xl">🇯🇵</span>
            <div>
              <div className="font-bold text-slate-800">JLPT 日文檢定</div>
              <div className="text-sm text-slate-500">N5～N1 全 5 級 · 100 單元 · 五十音到進階 · 聽說讀寫 · 模擬測驗</div>
            </div>
            <span className="ml-auto text-red-400">→</span>
          </a>
          <a href="/board-games" className="flex items-center gap-4 p-4 rounded-xl bg-orange-50 border border-orange-100 hover:shadow-md transition no-underline">
            <span className="text-3xl">🎲</span>
            <div>
              <div className="font-bold text-slate-800">教育桌遊</div>
              <div className="text-sm text-slate-500">18 款遊戲 · 邏輯推理 · 程式概念 · 記憶力 · 數學 · 圍棋 · 跳棋</div>
            </div>
            <span className="ml-auto text-orange-400">→</span>
          </a>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a href="/chinese-lang" className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100 hover:shadow-md transition no-underline">
              <span className="text-2xl">📝</span>
              <div className="font-bold text-sm text-slate-800">國語學習</div>
            </a>
            <a href="/math" className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100 hover:shadow-md transition no-underline">
              <span className="text-2xl">🔢</span>
              <div className="font-bold text-sm text-slate-800">數學練習</div>
            </a>
            <a href="/history-geo" className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 hover:shadow-md transition no-underline">
              <span className="text-2xl">🌏</span>
              <div className="font-bold text-sm text-slate-800">歷史地理</div>
            </a>
            <a href="/typing-game" className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 hover:shadow-md transition no-underline">
              <span className="text-2xl">⌨️</span>
              <div className="font-bold text-sm text-slate-800">打字練習</div>
            </a>
            <a href="/music" className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 border border-pink-100 hover:shadow-md transition no-underline">
              <span className="text-2xl">🎵</span>
              <div className="font-bold text-sm text-slate-800">樂理基礎</div>
            </a>
            <a href="/finance" className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 border border-purple-100 hover:shadow-md transition no-underline">
              <span className="text-2xl">💰</span>
              <div className="font-bold text-sm text-slate-800">兒童理財</div>
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            <a href="/parent-guide" className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100 hover:shadow-md transition no-underline">
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
              <div className="font-bold text-sm text-slate-800">陪伴指南</div>
            </a>
            <a href="/achievements" className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50 border border-yellow-100 hover:shadow-md transition no-underline">
              <span className="text-2xl">🏆</span>
              <div className="font-bold text-sm text-slate-800">學習成就</div>
            </a>
            <a href="/exam-info" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition no-underline">
              <span className="text-2xl">📋</span>
              <div className="font-bold text-sm text-slate-800">報考資訊</div>
            </a>
          </div>
        </div>
      </div>

      {/* ─── Company ─── */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">🏠 關於我們</h2>
        <p className="text-slate-600 leading-7 mb-4">
          這個平台由<strong>智慧媽咪國際有限公司</strong>製作與維護。
          我們是一個小小的團隊，相信科技可以讓學習變得更有趣、更容易取得。
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="https://aimommywisdom.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 hover:shadow-md transition no-underline flex-1">
            <span className="text-2xl">👶</span>
            <div>
              <div className="font-bold text-slate-800 text-sm">AI Mommy Wisdom</div>
              <div className="text-xs text-slate-500">智慧媽咪官網</div>
            </div>
            <span className="ml-auto text-rose-300">↗</span>
          </a>
          <a href="https://chparenting.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50 border border-slate-200 hover:shadow-md transition no-underline flex-1">
            <span className="text-2xl">👨‍👩‍👧</span>
            <div>
              <div className="font-bold text-slate-800 text-sm">CH Parenting</div>
              <div className="text-xs text-slate-500">親子教養分享</div>
            </div>
            <span className="ml-auto text-slate-400">↗</span>
          </a>
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl p-8 border border-rose-200 text-center">
        <div className="text-3xl mb-3">💕</div>
        <p className="text-slate-700 leading-8 mb-4">
          如果這個網站對你的孩子有一點點幫助，<br />
          那就是我做這一切最開心的事了。
        </p>
        <p className="text-sm text-slate-500 mb-5">
          有任何建議、回饋，或只是想說聲加油，都歡迎聯繫我們 ❤️
        </p>
        <a href="https://aimommywisdom.com" target="_blank" rel="noopener noreferrer"
          className="inline-block px-6 py-2.5 bg-rose-300 text-white rounded-xl font-semibold text-sm hover:bg-rose-400 transition no-underline">
          前往官網聯繫 →
        </a>
      </div>
    </div>
  );
}
