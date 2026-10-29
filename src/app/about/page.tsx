import type { Metadata } from "next";
import SubjectIcon, { type SubjectIconName } from "@/components/SubjectIcon";
import InfoIcon, { type InfoIconName } from "@/components/InfoPageIcons";
import { SectionTitle } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "關於我們 | learn.chparenting.com 免費親子學習平台",
  description: "learn.chparenting.com 是一位媽媽為了陪自己的孩子準備英檢而做的免費學習平台，後來加上日檢、數學、國語、樂理、桌遊與理財。全部免費、不用註冊、沒有付費牆，希望每個孩子都能不靠補習費把基礎練好。",
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

const BELIEFS: { icon: InfoIconName; title: string; text: string }[] = [
  { icon: "heart", title: "免費使用", text: "好的學習資源，不該只有付得起補習費的家庭才能擁有。" },
  { icon: "sprout", title: "按自己的步調學", text: "每個孩子都值得用自己的步調，快樂地學習和成長。" },
  { icon: "bulb", title: "保持好奇心", text: "學習不該是壓力，而是一段充滿好奇心的探索旅程。" },
  { icon: "users", title: "家長輕鬆陪伴", text: "家長陪伴孩子學習的時光，是最珍貴的親子時刻。" },
];

const MAIN_TOOLS: { href: string; icon: SubjectIconName; name: string; desc: string }[] = [
  { href: "/elementary", icon: "book", name: "全民英檢 GEPT", desc: "94 單元 · 8,000+ 單字 · 初級到中高級 · 聽說讀寫完整練習" },
  { href: "/jlpt-n5", icon: "torii", name: "JLPT 日文檢定", desc: "N5～N1 全 5 級 · 100 單元 · 五十音到進階 · 聽說讀寫 · 模擬測驗" },
  { href: "/board-games", icon: "brain", name: "教育桌遊", desc: "21 款遊戲 · 邏輯推理 · 程式概念 · 記憶力 · 數學 · 圍棋 · 跳棋" },
];

const MORE_TOOLS: { href: string; icon: SubjectIconName | InfoIconName; sub?: boolean; name: string }[] = [
  { href: "/chinese-lang", icon: "reading", sub: true, name: "國語學習" },
  { href: "/math", icon: "calculator", sub: true, name: "數學練習" },
  { href: "/history-geo", icon: "globe", sub: true, name: "歷史地理" },
  { href: "/typing-game", icon: "keyboard", sub: true, name: "打字練習" },
  { href: "/music", icon: "music", sub: true, name: "樂理基礎" },
  { href: "/finance", icon: "coins", sub: true, name: "兒童理財" },
  { href: "/parent-guide", icon: "users", name: "陪伴指南" },
  { href: "/achievements", icon: "trophy", name: "學習成就" },
  { href: "/exam-info", icon: "calendar", name: "報考資訊" },
];

export default function AboutPage() {
  return (
    <div className="bg-white pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-6xl mx-auto px-4 pt-6 md:pt-8">
        {/* ─── Hero ─── */}
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden grid md:grid-cols-2 mb-8">
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <div className="text-sm font-bold text-[#E65E83] mb-2">關於這個平台・一位媽媽的小小心願</div>
            <h1 className="text-[28px] md:text-[40px] font-black text-[#263238] leading-tight m-0">
              一位媽媽，<br />想讓孩子多一個<br /><span className="text-[#E65E83]">好用的學習工具。</span>
            </h1>
            <p className="text-[#52616B] mt-4 mb-6 leading-relaxed">
              從自己孩子的英檢練習開始，後來加上日檢、數學、打字、桌遊與理財。全部免費，不管大人小孩，只要有興趣都可以一起學習。
            </p>
            <div>
              <a href="/#subjects" className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-[#2457A7] text-white font-bold no-underline hover:bg-[#1d4a8f]">
                探索學習內容 <InfoIcon name="arrow" size={16} />
              </a>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/pages/parent-guide.webp" alt="" className="w-full h-56 md:h-full object-cover bg-white" />
        </section>

        {/* ─── Origin Story ─── */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 mb-8 grid lg:grid-cols-[1fr_300px] gap-8">
          <div>
            <SectionTitle>為什麼做這個網站？</SectionTitle>
            <div className="text-[#52616B] leading-8">
              <p className="mb-3">身為兩個孩子的媽媽，平常身兼數職外，對小孩的教育一直很關心。</p>
              <p className="mb-3">平常已經有線上與老師的課程學習，但深知語言需要多練習的我。</p>
              <p className="mb-3">想要幫自己的孩子找一個好用的英檢練習工具。</p>
              <p className="mb-3">內容可以是包含：聽、說、讀、寫。</p>
              <p className="mb-3">
                市面上的資源很多與我想要的有落差，有的介面也太複雜。
                身為一個有網站開發能力的媽媽，我想：<strong className="text-[#263238]">「不如自己做一個吧。」</strong>
              </p>
              <p className="mb-3">
                做著做著，從英檢變成了日檢，又加了桌遊、數學、打字、理財⋯⋯
                每多做一個功能，就會想到：<em>「其他家庭的孩子可能也需要吧？」</em>
              </p>
              <p className="mb-3 text-[#263238] font-medium">
                如果這些工具能幫到更多的孩子，讓他們在家也能快樂地學習，那就太好了。
                所以，我決定讓這個平台<strong className="text-[#E65E83]">完全免費</strong>。
              </p>
              <p className="m-0 text-[#263238] font-medium">
                不管大人小孩，只要有興趣都可以一起學習。
              </p>
            </div>
          </div>
          <aside className="flex flex-col gap-4">
            <div className="rounded-2xl bg-[#FDECF1] p-6 text-[#263238] leading-8">
              <p className="m-0">
                如果這個網站對你的孩子有一點點幫助，那就是我做這一切最開心的事了。
              </p>
            </div>
            <div className="border-t border-slate-200 pt-4">
              <p className="text-sm text-[#52616B] m-0">這個平台由</p>
              <p className="font-bold text-[#263238] my-0.5">智慧媽咪國際有限公司</p>
              <p className="text-sm text-[#52616B] mb-2">製作與維護。我們是一個小小的團隊，相信科技可以讓學習變得更有趣、更容易取得。</p>
              <a href="/author/vega-lin" className="inline-flex items-center gap-1 text-sm font-bold text-[#2457A7] no-underline hover:underline">
                認識創辦人 <InfoIcon name="arrow" size={14} />
              </a>
            </div>
          </aside>
        </section>

        {/* ─── Beliefs ─── */}
        <section className="mb-8">
          <SectionTitle>我們相信</SectionTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {BELIEFS.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl border border-slate-200 p-5">
                <span className="w-11 h-11 rounded-full bg-[#FDECF1] text-[#E65E83] flex items-center justify-center mb-3">
                  <InfoIcon name={b.icon} size={22} />
                </span>
                <h3 className="font-bold text-[#263238] text-base m-0 mb-1.5">{b.title}</h3>
                <p className="text-sm text-[#52616B] leading-relaxed m-0">{b.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Current Tools ─── */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-7 mb-8">
          <SectionTitle>目前提供的學習工具</SectionTitle>
          <div className="space-y-3 mb-4">
            {MAIN_TOOLS.map((t) => (
              <a key={t.href} href={t.href} className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-[#2457A7] transition no-underline">
                <span className="text-[#E65E83]"><SubjectIcon name={t.icon} size={32} /></span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#263238]">{t.name}</div>
                  <div className="text-sm text-[#52616B]">{t.desc}</div>
                </div>
                <InfoIcon name="arrow" size={16} className="text-[#52616B] group-hover:text-[#2457A7]" />
              </a>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MORE_TOOLS.map((t) => (
              <a key={t.href} href={t.href} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#2457A7] transition no-underline">
                <span className="text-[#2457A7]">
                  {t.sub ? <SubjectIcon name={t.icon as SubjectIconName} size={24} /> : <InfoIcon name={t.icon as InfoIconName} size={22} />}
                </span>
                <span className="font-bold text-sm text-[#263238]">{t.name}</span>
              </a>
            ))}
          </div>
        </section>

        {/* ─── Company links ─── */}
        <section className="mb-8">
          <SectionTitle>關於我們</SectionTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="https://aimommywisdom.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#2457A7] transition no-underline flex-1">
              <div>
                <div className="font-bold text-[#263238] text-sm">AI Mommy Wisdom</div>
                <div className="text-xs text-[#52616B]">智慧媽咪官網</div>
              </div>
              <InfoIcon name="external" size={16} className="ml-auto text-[#52616B]" />
            </a>
            <a href="https://chparenting.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#2457A7] transition no-underline flex-1">
              <div>
                <div className="font-bold text-[#263238] text-sm">CH Parenting</div>
                <div className="text-xs text-[#52616B]">親子教養分享</div>
              </div>
              <InfoIcon name="external" size={16} className="ml-auto text-[#52616B]" />
            </a>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <div className="bg-[#FDECF1] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
          <span className="hidden md:flex w-14 h-14 shrink-0 rounded-full bg-white text-[#E65E83] items-center justify-center">
            <SubjectIcon name="book" size={28} />
          </span>
          <div className="flex-1">
            <p className="text-xl font-bold text-[#263238] m-0">有任何建議、回饋，或只是想說聲加油</p>
            <p className="text-[#52616B] mt-1 mb-0">都歡迎聯繫我們。</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="https://aimommywisdom.com" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-3 border border-[#2457A7] text-[#2457A7] bg-white rounded-xl font-bold text-sm hover:bg-[#F4F7FB] transition no-underline">
              前往官網聯繫
            </a>
            <a href="/#subjects"
              className="inline-flex items-center gap-1.5 px-5 py-3 bg-[#2457A7] text-white rounded-xl font-bold text-sm hover:bg-[#1d4a8f] transition no-underline">
              探索學習內容 <InfoIcon name="arrow" size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
