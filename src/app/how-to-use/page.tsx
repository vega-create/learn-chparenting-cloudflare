import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "使用說明 | learn.chparenting.com 免費親子學習平台",
  description: "3 步驟快速上手親子多元學習平台：選擇級別、進入單元、開始學習。包含口說錄音、聽力測驗、模擬考試完整教學。",
  alternates: { canonical: "https://learn.chparenting.com/how-to-use" },
};

export default function HowToUsePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="text-5xl mb-3">🚀</div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">3 步驟開始學習</h1>
        <p className="text-slate-500">免費、不用註冊、任何裝置都能用</p>
      </div>

      {/* 3 Quick Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {[
          { n: "1", icon: "📚", title: "選擇級別", desc: "在首頁選「英檢初級 / 中級 / 中高級」或「日文 N1~N5」", color: "bg-blue-50 border-blue-200" },
          { n: "2", icon: "🎯", title: "點任一單元", desc: "進入後上方有 6 個分頁：單字→文法→聽力→閱讀→練習→測驗", color: "bg-emerald-50 border-emerald-200" },
          { n: "3", icon: "▶️", title: "開始學習", desc: "點 🔊 聽發音、點麥克風跟讀、做題目，依自己節奏進行", color: "bg-pink-50 border-pink-200" },
        ].map(s => (
          <div key={s.n} className={`rounded-2xl p-6 border-2 ${s.color} text-center`}>
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-lg font-black text-slate-700 border-2 border-slate-300 mb-3">
              {s.n}
            </div>
            <div className="text-4xl mb-2">{s.icon}</div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{s.title}</h3>
            <p className="text-sm text-slate-600 leading-6">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* 6 Tabs in Unit */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-2">📖 每個單元裡有什麼？</h2>
        <p className="text-slate-500 text-sm mb-6">進入單元後，上方分頁切換不同學習內容</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { icon: "📖", title: "單字", desc: "點 🔊 聽真人發音，點卡片看例句" },
            { icon: "📝", title: "文法", desc: "重點文法+例句解說" },
            { icon: "🎙️", title: "口說", desc: "跟讀練習，麥克風錄音AI評分" },
            { icon: "🎧", title: "聽力", desc: "聽真人發音回答題目，可重複播" },
            { icon: "📗", title: "閱讀", desc: "文章+理解題，有「🔊 聽文章」功能" },
            { icon: "✏️", title: "測驗", desc: "綜合測驗題，答完立刻看結果" },
          ].map(t => (
            <div key={t.title} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-2xl mb-1">{t.icon}</div>
              <p className="font-bold text-slate-800 text-sm mb-1">{t.title}</p>
              <p className="text-xs text-slate-500 leading-5">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Speaking Practice Guide */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 md:p-8 border border-rose-200 mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-2">🎙️ 口說錄音怎麼用？</h2>
        <p className="text-slate-500 text-sm mb-6">使用瀏覽器麥克風錄音，AI 比對發音給分</p>
        <div className="space-y-3">
          {[
            { n: "1", text: "點 🔊 聽標準發音，注意語調節奏" },
            { n: "2", text: "點麥克風 🎤 開始錄音，跟著大聲念出來" },
            { n: "3", text: "唸完後系統自動停止，給你分數（綠色=念對，紅色=要再加強）" },
            { n: "4", text: "可以反覆練習，目標是 90% 以上！" },
          ].map(s => (
            <div key={s.n} className="flex gap-3 items-start bg-white/70 rounded-xl p-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-rose-400 text-white font-bold flex items-center justify-center text-sm">{s.n}</span>
              <span className="text-sm text-slate-700 pt-1">{s.text}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-amber-100 rounded-xl border border-amber-200 text-xs text-amber-800">
          💡 <strong>小技巧：</strong>在安靜環境練習、嘴巴離麥克風 20-30 公分、一口氣念完整句不要停頓太久。
        </div>
      </div>

      {/* 4 Extra Features */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">🎮 額外練習功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: "🎙️", title: "口說訓練", color: "bg-pink-50 border-pink-200", desc: "全部單元的綜合口說練習，含發音、跟讀、朗讀、AI 對話問答" },
            { icon: "✍️", title: "寫作練習", color: "bg-violet-50 border-violet-200", desc: "4 種題型：句子重組、中翻英、段落排序、引導式寫作" },
            { icon: "🎮", title: "綜合遊戲", color: "bg-amber-50 border-amber-200", desc: "用遊戲方式複習所有單元，含拼字、聽力、配對等" },
            { icon: "📋", title: "模擬測驗", color: "bg-blue-50 border-blue-200", desc: "比照英檢正式格式，含聽力、閱讀，完整計分對答" },
          ].map(f => (
            <div key={f.title} className={`rounded-xl p-4 border-2 ${f.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{f.icon}</span>
                <span className="font-bold text-slate-800">{f.title}</span>
              </div>
              <p className="text-sm text-slate-600 leading-6">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Quality Notice */}
      <div className="bg-emerald-50 rounded-2xl p-6 md:p-8 border border-emerald-200 mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-2">🎤 真人配音</h2>
        <p className="text-slate-600 leading-7 text-sm">
          英檢的所有單字、例句、聽力、閱讀都使用 <strong>ElevenLabs AI 真人配音</strong>（女聲、教育風格）。
          發音清晰自然，比一般電子音標準。任何瀏覽器都能正常播放。
        </p>
      </div>

      {/* Parents Notes */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 md:p-8 border border-amber-200 mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4">👨‍👩‍👧 給家長</h2>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="flex gap-2"><span>🔑</span><span><strong>答案是家長專區：</strong>練習題答案要點「🔑 查看答案」並確認是家長，孩子才不會直接看到。</span></div>
          <div className="flex gap-2"><span>📥</span><span><strong>練習單 PDF：</strong>下載的 PDF 只有題目，可以放心讓孩子寫。</span></div>
          <div className="flex gap-2"><span>📚</span><span><strong>陪伴指南：</strong>每個單元都有「家長陪伴指南」，告訴你重點和怎麼陪孩子學。</span></div>
          <div className="flex gap-2"><span>🔄</span><span><strong>反覆練習：</strong>學語言本來就需要重複，多鼓勵少批評。</span></div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-slate-500 mb-4">不需要註冊、不用付費，現在就開始！</p>
        <a href="/elementary" className="inline-block px-8 py-4 bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-2xl font-bold text-lg hover:from-rose-500 hover:to-pink-500 transition no-underline shadow-lg">
          🚀 開始學習 →
        </a>
      </div>
    </div>
  );
}
