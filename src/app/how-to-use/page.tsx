import type { Metadata } from "next";
import PageHeader, { SectionTitle } from "@/components/PageHeader";
import SubjectIcon from "@/components/SubjectIcon";
import InfoIcon, { type InfoIconName } from "@/components/InfoPageIcons";

export const metadata: Metadata = {
  title: "使用說明 | learn.chparenting.com 免費親子學習平台",
  description: "learn.chparenting.com 使用說明：三步驟開始（選級別、進單元、做練習），單字發音怎麼聽、口說怎麼錄音、聽力與模擬測驗怎麼作答、家長陪伴指南在哪裡、進度怎麼保存。全部免費，不用註冊也能用。",
  alternates: { canonical: "https://learn.chparenting.com/how-to-use" },
};

const CARD = "bg-white rounded-2xl border border-slate-200";

const UNIT_TABS: { icon: InfoIconName; title: string; desc: string }[] = [
  { icon: "book", title: "單字", desc: "點 🔊 聽 AI 語音發音，點卡片看例句" },
  { icon: "pen", title: "文法", desc: "重點文法+例句解說" },
  { icon: "chat", title: "口說", desc: "跟讀練習，麥克風錄音AI評分" },
  { icon: "volume", title: "聽力", desc: "聽 AI 語音回答題目，可重複播" },
  { icon: "list", title: "閱讀", desc: "文章+理解題，有「🔊 聽文章」功能" },
  { icon: "check", title: "測驗", desc: "綜合測驗題，答完立刻看結果" },
];

const EXTRA: { icon: InfoIconName; title: string; desc: string }[] = [
  { icon: "chat", title: "口說訓練", desc: "全部單元的綜合口說練習，含發音、跟讀、朗讀、AI 對話問答" },
  { icon: "pen", title: "寫作練習", desc: "4 種題型：句子重組、中翻英、段落排序、引導式寫作" },
  { icon: "target", title: "綜合遊戲", desc: "用遊戲方式複習所有單元，含拼字、聽力、配對等" },
  { icon: "list", title: "模擬測驗", desc: "比照英檢正式格式，含聽力、閱讀，完整計分對答" },
];

const OTHER_TOOLS = [
  { title: "九九乘法練習", href: "/math/times-table",
    steps: ["基礎：選要練幾的乘法，照順序或打亂；進階、高階是多位數乘法，要用紙筆直式算", "輸入答案按確認；答錯的題目最後會再出一次"] },
  { title: "成語練習", href: "/chinese-lang/idiom-practice",
    steps: ["先選「基礎」或「進階」", "選玩法：成語填空、意思配對", "想用手寫：選「列印學習單」，按列印，解答在第二頁"] },
  { title: "鍵盤位置練習", href: "/typing-game/keyboard",
    steps: ["需要實體鍵盤（電腦，或接了鍵盤的平板）", "從第 1 階段「基準鍵」開始，畫面會告訴你用哪根手指", "正確率到 95% 再進下一個階段；可以切換成注音位置"] },
  { title: "教育桌遊（21 款）", href: "/board-games",
    steps: ["選一款遊戲，先看開始前的「遊戲規則」", "玩到一半忘記怎麼玩：按右下角的「❓ 怎麼玩」", "圍棋、數獨、踩地雷在開始前有圖解"] },
];

const PARENT_NOTES: { icon: InfoIconName; title: string; text: string }[] = [
  { icon: "lock", title: "答案是家長專區：", text: "練習題答案要點「🔑 查看答案」並確認是家長，孩子才不會直接看到。" },
  { icon: "download", title: "練習單 PDF：", text: "下載的 PDF 只有題目，可以放心讓孩子寫。" },
  { icon: "users", title: "陪伴指南：", text: "每個單元都有「家長陪伴指南」，告訴你重點和怎麼陪孩子學。" },
  { icon: "sprout", title: "反覆練習：", text: "學語言本來就需要重複，多鼓勵少批評。" },
];

export default function HowToUsePage() {
  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="使用說明"
        title="3 步驟開始學習"
        desc="免費、不用註冊、任何裝置都能用"
      />

      <div className="max-w-6xl mx-auto px-4">
        {/* 3 Quick Steps */}
        <section className={`${CARD} grid md:grid-cols-3 md:divide-x divide-y md:divide-y-0 divide-slate-200 mb-10`}>
          <div className="p-5 md:p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-full bg-[#E65E83] text-white font-black text-lg flex items-center justify-center">1</span>
              <h2 className="text-xl font-bold text-[#263238] m-0">選擇級別</h2>
            </div>
            <p className="text-sm text-[#52616B] leading-relaxed mt-0 mb-4">在首頁選「英檢初級 / 中級 / 中高級」或「日文 N1~N5」</p>
            <div className="grid grid-cols-4 gap-2" aria-hidden="true">
              {(["book", "torii", "calculator", "globe"] as const).map((n) => (
                <span key={n} className="aspect-square rounded-xl bg-slate-50 border border-slate-200 text-[#E65E83] flex items-center justify-center"><SubjectIcon name={n} size={26} /></span>
              ))}
            </div>
          </div>
          <div className="p-5 md:p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-full bg-[#E65E83] text-white font-black text-lg flex items-center justify-center">2</span>
              <h2 className="text-xl font-bold text-[#263238] m-0">點任一單元</h2>
            </div>
            <p className="text-sm text-[#52616B] leading-relaxed mt-0 mb-4">進入後上方有 6 個分頁：單字→文法→聽力→閱讀→練習→測驗</p>
            <div className="flex flex-wrap gap-1.5" aria-hidden="true">
              {["單字", "文法", "聽力", "閱讀", "練習", "測驗"].map((l, i) => (
                <span key={l} className={`px-3 py-1.5 rounded-lg text-sm font-bold ${i === 0 ? "bg-[#FDECF1] text-[#C2416A]" : "bg-slate-50 border border-slate-200 text-[#52616B]"}`}>
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div className="p-5 md:p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-full bg-[#E65E83] text-white font-black text-lg flex items-center justify-center">3</span>
              <h2 className="text-xl font-bold text-[#263238] m-0">開始學習</h2>
            </div>
            <p className="text-sm text-[#52616B] leading-relaxed mt-0 mb-4">點 🔊 聽發音、點麥克風跟讀、做題目，依自己節奏進行</p>
            <div className="flex gap-2" aria-hidden="true">
              {(["volume", "chat", "check"] as const).map((n) => (
                <span key={n} className="flex-1 h-14 rounded-xl bg-[#EEF3FA] text-[#2457A7] flex items-center justify-center"><InfoIcon name={n} size={24} /></span>
              ))}
            </div>
          </div>
        </section>

        {/* 6 Tabs in Unit */}
        <section className="mb-10">
          <SectionTitle>每個單元裡有什麼？</SectionTitle>
          <p className="text-[#52616B] text-sm -mt-2 mb-4">進入單元後，上方分頁切換不同學習內容</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {UNIT_TABS.map((t) => (
              <div key={t.title} className={`${CARD} p-4 flex items-start gap-3`}>
                <span className="w-9 h-9 shrink-0 rounded-lg bg-[#FDECF1] text-[#E65E83] flex items-center justify-center"><InfoIcon name={t.icon} size={18} /></span>
                <div className="min-w-0">
                  <p className="font-bold text-[#263238] m-0 mb-0.5">{t.title}</p>
                  <p className="text-xs md:text-sm text-[#52616B] leading-5 m-0">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Speaking + AI voice */}
        <div className="grid lg:grid-cols-[3fr_2fr] gap-5 mb-10">
          <section className={`${CARD} p-5 md:p-7`}>
            <SectionTitle>口說錄音怎麼用？</SectionTitle>
            <p className="text-[#52616B] text-sm -mt-2 mb-4">使用瀏覽器麥克風錄音，AI 比對發音給分</p>
            <ol className="list-none p-0 m-0 space-y-2.5">
              {[
                "點 🔊 聽標準發音，注意語調節奏",
                "點麥克風 🎤 開始錄音，跟著大聲念出來",
                "唸完後系統自動停止，給你分數（綠色=念對，紅色=要再加強）",
                "可以反覆練習，目標是 90% 以上！",
              ].map((t, i) => (
                <li key={t} className="flex gap-3 items-start">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-[#FDECF1] text-[#C2416A] font-bold flex items-center justify-center text-sm">{i + 1}</span>
                  <span className="text-sm text-[#263238] pt-1">{t}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex items-start gap-2 p-3 bg-[#FFF8EC] rounded-xl border border-amber-100 text-sm text-[#52616B]">
              <InfoIcon name="bulb" size={18} className="text-amber-600 mt-px" />
              <span><strong className="text-[#263238]">小技巧：</strong>在安靜環境練習、嘴巴離麥克風 20-30 公分、一口氣念完整句不要停頓太久。</span>
            </div>
          </section>

          <div className="flex flex-col gap-5">
            <section className={`${CARD} p-5 md:p-6`}>
              <div className="flex items-center gap-2.5 mb-2">
                <InfoIcon name="volume" size={22} className="text-[#2457A7]" />
                <h2 className="text-lg font-bold text-[#263238] m-0">AI 語音</h2>
              </div>
              <p className="text-[#52616B] leading-7 text-sm m-0">
                英檢和日檢的單字、例句、聽力、閱讀都使用 <strong className="text-[#263238]">ElevenLabs AI 語音</strong>（女聲、教育風格），不是真人錄音。
                發音清晰自然，比一般電子音標準。任何瀏覽器都能正常播放。
              </p>
            </section>
            <section className={`${CARD} p-5 md:p-6`}>
              <div className="flex items-center gap-2.5 mb-3">
                <InfoIcon name="phone" size={22} className="text-[#2457A7]" />
                <h2 className="text-lg font-bold text-[#263238] m-0">在不同裝置上使用</h2>
              </div>
              <ul className="list-none p-0 m-0 space-y-2.5 text-sm text-[#52616B]">
                <li className="flex items-start gap-2.5"><InfoIcon name="phone" size={18} className="text-[#52616B] mt-px" /><span><strong className="text-[#263238]">手機與平板：</strong>支援手機、平板、電腦等各種裝置，手機版底部有專用導航列。</span></li>
                <li className="flex items-start gap-2.5"><InfoIcon name="keyboard" size={18} className="text-[#52616B] mt-px" /><span><strong className="text-[#263238]">實體鍵盤練習：</strong>鍵盤位置練習需要實體鍵盤（電腦，或接了鍵盤的平板）。</span></li>
              </ul>
            </section>
          </div>
        </div>

        {/* 4 Extra Features */}
        <section className="mb-10">
          <SectionTitle>額外練習功能</SectionTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {EXTRA.map((f) => (
              <div key={f.title} className={`${CARD} p-5`}>
                <span className="w-10 h-10 rounded-lg bg-[#EEF3FA] text-[#2457A7] flex items-center justify-center mb-3"><InfoIcon name={f.icon} size={20} /></span>
                <p className="font-bold text-[#263238] m-0 mb-1">{f.title}</p>
                <p className="text-sm text-[#52616B] leading-6 m-0">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 其他學習工具 */}
        <section className="mb-10">
          <SectionTitle>其他學習工具怎麼用？</SectionTitle>
          <p className="text-sm text-[#52616B] -mt-2 mb-4">這些工具都不用登入，打開就能用。每一頁下面都有更詳細的說明。</p>
          <div className="grid md:grid-cols-2 gap-3">
            {OTHER_TOOLS.map((f) => (
              <a key={f.title} href={f.href} className={`${CARD} group block p-5 no-underline hover:border-[#2457A7] transition`}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-bold text-[#263238]">{f.title}</span>
                  <InfoIcon name="arrow" size={16} className="text-[#52616B] group-hover:text-[#2457A7]" />
                </div>
                <ol className="list-decimal pl-5 m-0 space-y-1 text-sm text-[#52616B] leading-6">
                  {f.steps.map(s => <li key={s}>{s}</li>)}
                </ol>
              </a>
            ))}
          </div>
        </section>

        {/* Parents Notes */}
        <section className={`${CARD} p-5 md:p-7 mb-10`}>
          <SectionTitle>給家長</SectionTitle>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-[#52616B]">
            {PARENT_NOTES.map((n) => (
              <div key={n.title} className="flex gap-2.5 items-start p-3 rounded-xl bg-slate-50">
                <InfoIcon name={n.icon} size={18} className="text-[#E65E83] mt-px" />
                <span><strong className="text-[#263238]">{n.title}</strong>{n.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-[#FDECF1] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
          <span className="hidden md:flex w-14 h-14 shrink-0 rounded-full bg-white text-[#E65E83] items-center justify-center">
            <InfoIcon name="target" size={28} />
          </span>
          <div className="flex-1">
            <p className="text-xl font-bold text-[#263238] m-0">找到適合的練習</p>
            <p className="text-[#52616B] mt-1 mb-0">不需要註冊、不用付費，現在就開始！</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/elementary" className="inline-flex items-center gap-1.5 px-5 py-3 border border-[#2457A7] text-[#2457A7] bg-white rounded-xl font-bold text-sm hover:bg-[#F4F7FB] transition no-underline">
              開始學習
            </a>
            <a href="/#subjects" className="inline-flex items-center gap-1.5 px-5 py-3 bg-[#2457A7] text-white rounded-xl font-bold text-sm hover:bg-[#1d4a8f] transition no-underline">
              探索所有學習內容 <InfoIcon name="arrow" size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
