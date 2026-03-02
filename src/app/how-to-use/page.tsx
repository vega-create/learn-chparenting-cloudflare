import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "使用說明 | learn.chparenting.com 免費親子學習平台",
  description: "了解如何使用親子多元學習平台的各項功能：電子書教學、練習題、遊戲、模擬測驗、口說練習和寫作練習的完整教學。",
  alternates: { canonical: "https://learn.chparenting.com/how-to-use" },
};

const FEATURES = [
  {
    icon: "📖",
    title: "電子書教學",
    color: "bg-blue-50 border-blue-100",
    steps: [
      "選擇你的級別（初級 / 中級 / 中高級）",
      "進入任一單元，上方有 6 個 Tab 可以切換",
      "從「單字」開始看，點擊單字可以聽發音",
      "接著看「文法」→「聽力」→「閱讀」依序學習",
    ],
  },
  {
    icon: "📝",
    title: "練習題",
    color: "bg-purple-50 border-purple-100",
    steps: [
      "在每個單元裡，切換到「練習」Tab",
      "題目會根據該單元的單字和文法出題",
      "答完立即看結果，答錯會顯示正確答案",
      "可以反覆練習，題目每次隨機排列",
    ],
  },
  {
    icon: "🎮",
    title: "遊戲練習",
    color: "bg-emerald-50 border-emerald-100",
    steps: [
      "在級別首頁點擊「遊戲」卡片",
      "共有 7 種遊戲：配對、拼字、聽寫等",
      "每種遊戲都能選擇要練習哪些單元的字",
      "有音效和計分，讓學習更像在玩遊戲！",
    ],
  },
  {
    icon: "📋",
    title: "模擬測驗",
    color: "bg-amber-50 border-amber-100",
    steps: [
      "在級別首頁點擊「模擬測驗」卡片",
      "測驗包含聽力、文法和閱讀三大部分",
      "比照正式英檢格式，全程計時",
      "考完才看答案，可以檢討每一題",
    ],
  },
  {
    icon: "🎙️",
    title: "口說練習",
    color: "bg-pink-50 border-pink-100",
    steps: [
      "在級別首頁點擊「口說」卡片",
      "系統會播放一段英文，你跟著唸",
      "使用語音辨識技術偵測你的發音",
      "可以調整速度，反覆練習到滿意",
    ],
  },
  {
    icon: "✍️",
    title: "寫作練習",
    color: "bg-violet-50 border-violet-100",
    steps: [
      "在級別首頁點擊「寫作練習」卡片",
      "有 4 種練習：句子重組、中翻英、段落排序、引導式寫作",
      "句子重組：點擊單字排出正確順序",
      "引導式寫作：看提示自由寫作，提交後可對照範文",
    ],
  },
];

export default function HowToUsePage() {
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "如何使用親子多元學習平台",
    description: "學習如何使用本平台的各項功能",
    step: FEATURES.map((f, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: f.title,
      text: f.steps.join("。"),
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />

      <div className="text-center mb-10">
        <div className="text-5xl mb-3">📋</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">使用說明</h1>
        <p className="text-slate-500">快速了解平台的各項功能</p>
      </div>

      {/* Feature Cards */}
      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        {FEATURES.map((f) => (
          <div key={f.title} className={`rounded-2xl p-6 border ${f.color}`}>
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">{f.title}</h3>
            <ol className="space-y-2">
              {f.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600">
                  <span className="shrink-0 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      {/* Learning Path */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">🗺️ 建議學習路徑</h2>
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          {[
            { icon: "📖", label: "單字" },
            { icon: "📐", label: "文法" },
            { icon: "🎧", label: "聽力" },
            { icon: "📄", label: "閱讀" },
            { icon: "📝", label: "練習" },
            { icon: "🎮", label: "遊戲" },
            { icon: "📋", label: "測驗" },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className="flex flex-col items-center bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
                <span className="text-xl mb-1">{step.icon}</span>
                <span className="font-medium text-slate-700">{step.label}</span>
              </div>
              {i < arr.length - 1 && <span className="text-blue-300 text-lg">→</span>}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-500 mt-4">
          按照這個順序學習效果最好，每天自由安排時間，不趕進度！
        </p>
      </div>

      {/* Tips for Parents */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">👨‍👩‍👧‍👦 給家長的小提示</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: "⏰", tip: "每天自由安排時間，少量多次比一次塞很久效果好" },
            { icon: "🎯", tip: "先設定小目標：每天 1 個單元或 10 個單字" },
            { icon: "👏", tip: "多鼓勵，少批評 — 讓孩子喜歡學習最重要" },
            { icon: "🤝", tip: "可以跟孩子一起玩遊戲區的小遊戲" },
            { icon: "📊", tip: "定期做模擬測驗，了解學習進度" },
            { icon: "🔄", tip: "反覆練習不丟臉，學語言本來就需要重複" },
          ].map(t => (
            <div key={t.tip} className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
              <span className="text-xl shrink-0">{t.icon}</span>
              <span className="text-sm text-slate-700">{t.tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Playback Notice */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-5">🔊 語音播放說明</h2>
        <p className="text-slate-600 leading-7 mb-4">
          本平台的英文與日文發音功能，使用瀏覽器內建的語音引擎。
          不同瀏覽器的語音品質會有所差異，建議參考以下說明：
        </p>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <span className="text-lg">🏆</span>
            <div>
              <p className="font-bold text-emerald-700 mb-1">Google Chrome（電腦版）— 最推薦</p>
              <p className="text-slate-500">使用 Google 自然語音引擎，英文與日文發音最自然、最接近真人。</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <span className="text-lg">👍</span>
            <div>
              <p className="font-bold text-blue-700 mb-1">Safari（Mac / iPhone / iPad）</p>
              <p className="text-slate-500">使用 Apple 內建語音（Samantha / Kyoko），品質不錯。iOS 裝置建議開啟「設定 → 輔助使用 → 語音內容」下載高品質語音。</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-lg">👌</span>
            <div>
              <p className="font-bold text-slate-700 mb-1">Microsoft Edge</p>
              <p className="text-slate-500">使用 Microsoft Natural 語音，品質也不錯。</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-bold text-amber-700 mb-1">Firefox / 其他瀏覽器</p>
              <p className="text-slate-500">語音品質較差，可能聽起來較機械。建議改用 Chrome 以獲得最佳體驗。</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pronunciation Tips */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-5">🎙️ 口說練習小技巧</h2>
        <p className="text-slate-600 leading-7 mb-4">
          口說練習使用瀏覽器的語音辨識功能，以下方法可以幫助你獲得更高的分數：
        </p>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-100">
            <span className="text-lg">🎧</span>
            <div>
              <p className="font-bold text-slate-700 mb-1">先聽再唸</p>
              <p className="text-slate-500">點「🔊 聽」按鈕聽標準發音，注意語調和節奏，再按麥克風錄音跟著唸。可以用「🐢 慢」按鈕放慢速度仔細聽。</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-100">
            <span className="text-lg">🔇</span>
            <div>
              <p className="font-bold text-slate-700 mb-1">安靜環境 + 靠近麥克風</p>
              <p className="text-slate-500">背景噪音會嚴重影響辨識。建議在安靜環境練習，嘴巴距離麥克風 20-30 公分，聲音清晰、不需大喊。</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-100">
            <span className="text-lg">🗣️</span>
            <div>
              <p className="font-bold text-slate-700 mb-1">完整唸完整句</p>
              <p className="text-slate-500">不要中途停頓太久，盡量一口氣完整唸完。如果中間停太久，語音辨識會以為你講完了。</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-100">
            <span className="text-lg">📱</span>
            <div>
              <p className="font-bold text-slate-700 mb-1">推薦使用 Chrome 瀏覽器</p>
              <p className="text-slate-500">Google Chrome 的語音辨識最準確（使用 Google 語音引擎）。Safari 和 Firefox 的辨識率較低，分數可能偏低。</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4">💡 使用小提示</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-100">
            <span className="text-lg">👧</span>
            <div>
              <p className="font-medium text-slate-700 mb-1">每位小朋友請用自己的 Google 帳號登入</p>
              <p className="text-slate-500">這樣每個孩子都有專屬的學習紀錄、進度追蹤和連續學習天數</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
            <span className="text-lg">📊</span>
            <div>
              <p className="font-medium text-slate-700 mb-1">登入後可以追蹤學習進度</p>
              <p className="text-slate-500">設定每週學習計畫、查看歷史紀錄、累積連續學習天數</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <span className="text-lg">🎉</span>
            <div>
              <p className="font-medium text-slate-700 mb-1">不登入也能使用所有功能</p>
              <p className="text-slate-500">登入只是多了進度追蹤，所有學習工具都是完全免費、隨時可用</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-10">
        <a href="/elementary" className="inline-block px-8 py-3 bg-rose-300 text-white rounded-xl font-bold text-lg hover:bg-rose-400 transition no-underline">
          開始學習 →
        </a>
      </div>
    </div>
  );
}
