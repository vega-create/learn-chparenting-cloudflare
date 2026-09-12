import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "關於全民英檢學習工具 | 親子多元學習平台",
  description: "免費全民英檢學習工具：初級、中級、中高級共 94 個主題單元，單字附發音、文法教學、聽力閱讀練習、7 種單字遊戲、口說錄音、寫作四種題型與計時模擬測驗，每單元附家長陪伴說明。不用註冊、不用付費，手機平板都能用。",
  alternates: { canonical: "https://learn.chparenting.com/gept/about" },
};

export default function GeptAboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">📘</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">全民英檢學習工具</h1>
        <p className="text-slate-500">一個媽媽想讓孩子快樂學英文的小小計畫</p>
      </div>

      {/* Story */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">📘 為什麼做這個工具？</h2>
        <p className="text-slate-600 leading-7 mb-4">
          身為兩個孩子的媽媽，我一直在想：有沒有辦法讓孩子準備英檢的時候，
          不只是背單字、寫考卷，而是能用更輕鬆有趣的方式來練習？
        </p>
        <p className="text-slate-600 leading-7 mb-4">
          於是我決定自己動手做！運用數位行銷和網站開發的專長，打造了這個<strong>完全免費</strong>的英檢學習工具。
          這裡有單字卡、聽力跟讀、閱讀練習、小遊戲和模擬測驗，
          希望讓孩子可以隨時隨地、用自己的節奏來練習英文。
        </p>
        <p className="text-slate-600 leading-7">
          這個工具還在持續進化中 🚀
          如果你有任何「要是能加這個功能就好了！」的想法，非常歡迎告訴我們！
        </p>
      </div>

      {/* Features */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">✨ 功能特色</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="text-2xl mb-2">📖</div>
            <div className="font-bold text-slate-800 mb-1">初級 20 + 中級 34 + 中高級 40 單元</div>
            <div className="text-sm text-slate-500">超過 8,000 個單字，涵蓋英檢初級到中高級範圍</div>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
            <div className="text-2xl mb-2">🎧</div>
            <div className="font-bold text-slate-800 mb-1">聽力 + 跟讀練習</div>
            <div className="text-sm text-slate-500">可調速度、無限重複，練到聽懂為止</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="text-2xl mb-2">🎮</div>
            <div className="font-bold text-slate-800 mb-1">7 種學習小遊戲</div>
            <div className="text-sm text-slate-500">單字配對、拼字、聽寫…邊玩邊記</div>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
            <div className="text-2xl mb-2">📝</div>
            <div className="font-bold text-slate-800 mb-1">全英文模擬測驗</div>
            <div className="text-sm text-slate-500">比照正式英檢格式，聽力 + 文法 + 閱讀</div>
          </div>
          <div className="p-4 rounded-xl bg-pink-50 border border-pink-100">
            <div className="text-2xl mb-2">🎙️</div>
            <div className="font-bold text-slate-800 mb-1">口說練習中心</div>
            <div className="text-sm text-slate-500">語音辨識，即時聽自己的發音練習</div>
          </div>
          <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
            <div className="text-2xl mb-2">✍️</div>
            <div className="font-bold text-slate-800 mb-1">寫作練習</div>
            <div className="text-sm text-slate-500">句子重組、中翻英、段落排序、引導式寫作</div>
          </div>
        </div>
        <div className="mt-4 p-4 rounded-xl bg-pink-50 border border-pink-100 text-center">
          <span className="text-lg">💰</span>
          <span className="font-bold text-slate-800 ml-2">完全免費，不用註冊就能使用！</span>
        </div>
      </div>

      {/* Level Guide */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">📊 級別指南</h2>
        <div className="space-y-3">
          {[
            { level: "初級 Elementary", emoji: "🌱", href: "/elementary", desc: "國中畢業程度・約 2,000 單字・20 單元", color: "bg-blue-50 border-blue-100" },
            { level: "中級 Intermediate", emoji: "⚡", href: "/intermediate", desc: "高中畢業程度・約 5,000 單字・34 單元", color: "bg-emerald-50 border-emerald-100" },
            { level: "中高級 Upper-Intermediate", emoji: "🔥", href: "/upper-intermediate", desc: "大學程度・約 8,000 單字・40 單元", color: "bg-purple-50 border-purple-100" },
          ].map(l => (
            <a key={l.href} href={l.href} className={`flex items-center gap-4 p-4 rounded-xl ${l.color} border hover:shadow-md transition no-underline`}>
              <span className="text-3xl">{l.emoji}</span>
              <div>
                <div className="font-bold text-slate-800">{l.level}</div>
                <div className="text-sm text-slate-500">{l.desc}</div>
              </div>
              <span className="ml-auto text-slate-400">→</span>
            </a>
          ))}
        </div>
      </div>

      {/* Back to platform */}
      <div className="text-center mt-8">
        <a href="/about" className="text-sm text-blue-600 hover:underline">← 回到平台關於頁面</a>
      </div>
    </div>
  );
}
