import type { Metadata } from "next";
import NewsletterCTA from "@/components/NewsletterCTA";
import DailyChallenge from "@/components/DailyChallenge";
import PracticeCounter from "@/components/PracticeCounter";
import HomeSearch from "@/components/HomeSearch";
import { buildSearchIndex } from "@/lib/search-index";
import { getPostBySlug } from "@/lib/blog";
import UpdateTicker from "@/components/UpdateTicker";
import OnboardingTutorial from "@/components/OnboardingTutorial";
import WeeklyEnglishCard from "@/components/WeeklyEnglish";

export const metadata: Metadata = {
  title: "Learn.chparenting.com 親子多元學習平台 | 華人家庭免費英文・數學・閱讀・注音・AI 工具",
  description: "Learn.chparenting.com 是大人小孩都能用的免費多元學習平台，想自學或陪孩子一起練都適合。整合英文（全民英檢 GEPT 初級到中高級）、日文（JLPT N5-N1）、數學、閱讀、注音、AI 工具與親子共學資源，協助家長陪伴孩子自主學習。",
  alternates: { canonical: "https://learn.chparenting.com" },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://learn.chparenting.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "親子多元學習平台",
  description: "Learn.chparenting.com 是專為華人家庭打造的免費親子多元學習平台，整合英文、數學、閱讀、注音、AI 工具與親子共學資源，協助家長陪伴孩子自主學習。",
  url: SITE_URL,
  publisher: {
    "@type": "Organization",
    name: "智慧媽咪國際有限公司 Mommy Wisdom International LTD.",
    url: "https://aimommywisdom.com",
  },
};

const SUBJECTS = [
  { title: "英文與英檢", desc: "初級・中級・中高級", href: "/elementary", icon: "📘", tint: "bg-rose-50" },
  { title: "日文學習", desc: "五十音・N5–N1", href: "/jlpt-n5", icon: "⛩️", tint: "bg-red-50" },
  { title: "國語與閱讀", desc: "注音・成語・閱讀", href: "/chinese-lang", icon: "📖", tint: "bg-orange-50" },
  { title: "數學練習", desc: "運算・幾何・應用題", href: "/math", icon: "🔢", tint: "bg-sky-50" },
  { title: "邏輯與教育遊戲", desc: "推理・記憶・程式，21 款", href: "/board-games", icon: "🧩", tint: "bg-emerald-50" },
  { title: "打字與鍵盤", desc: "中英文打字・鍵盤入門", href: "/typing-game", icon: "⌨️", tint: "bg-indigo-50" },
  { title: "歷史與地理", desc: "台灣・亞洲・世界", href: "/history-geo", icon: "🌏", tint: "bg-teal-50" },
  { title: "音樂與樂理", desc: "入門・基礎・進階", href: "/music", icon: "🎵", tint: "bg-pink-50" },
  { title: "兒童理財", desc: "金錢觀念・儲蓄・預算", href: "/finance", icon: "💰", tint: "bg-amber-50" },
];

const FEATURED = [
  { title: "英檢中級模擬測驗", href: "/intermediate/mock-test", icon: "📝" },
  { title: "英檢初級題庫", href: "/elementary", icon: "📘" },
  { title: "日文五十音", href: "/jlpt-n5/gojuon", icon: "あ" },
  { title: "九九乘法", href: "/math/times-table", icon: "✖️" },
  { title: "成語練習", href: "/chinese-lang/idiom-practice", icon: "🏮" },
  { title: "鍵盤位置", href: "/typing-game/keyboard", icon: "🖐️" },
];

const GUIDE_POSTS = [
  { label: "成人自學", slug: "jlpt-n3-self-study" },
  { label: "親子共學", slug: "how-to-help-kids-learn-english" },
  { label: "考試準備", slug: "mock-test-strategy" },
];

export default function HomePage() {
  const searchIndex = buildSearchIndex();
  const guides = GUIDE_POSTS.map((g) => ({ ...g, post: getPostBySlug(g.slug) })).filter((g) => g.post);

  return (
    <div className="bg-[#FAF8F5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 最新消息跑馬燈（必留；內容在 src/data/site-updates.ts 與 exam-dates.ts） */}
      <UpdateTicker />
      <OnboardingTutorial />

      {/* 主視覺：簡短，讓科目留在第一屏 */}
      <section className="max-w-6xl mx-auto px-4 pt-6 pb-5 md:pt-12 md:pb-8">
        <h1 className="text-[28px] leading-snug md:text-5xl font-black text-[#263238] mb-3">
          大人小孩都能練，<br className="md:hidden" /><span className="text-[#E65E83]">一起學更多。</span>
        </h1>
        <p className="text-[15px] md:text-lg text-[#52616B] leading-relaxed mb-2 max-w-2xl">
          想為自己學點新東西，也想陪孩子一起練習？<br className="hidden md:inline" />
          從英文、日文到國語、數學與動腦遊戲，找到適合的內容，照自己的步調開始。
        </p>
        <p className="text-sm text-[#52616B] mb-5">免費使用，不需註冊即可開始。</p>
        <div className="flex gap-2 md:gap-3">
          <a href="#subjects" className="inline-flex items-center gap-2 h-11 md:h-12 px-5 md:px-6 rounded-xl bg-[#2457A7] text-white font-bold no-underline hover:opacity-90">找練習</a>
          <a href="/parent-guide" className="inline-flex items-center gap-2 h-11 md:h-12 px-4 md:px-6 rounded-xl border border-[#2457A7] bg-white text-[#2457A7] font-bold no-underline hover:bg-blue-50">看看怎麼陪孩子學</a>
        </div>
      </section>

      {/* 搜尋 */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <HomeSearch index={searchIndex} />
      </section>

      {/* 九個主分類 */}
      <section id="subjects" className="max-w-6xl mx-auto px-4 pb-10 scroll-mt-20">
        <h2 className="text-xl md:text-2xl font-bold text-[#263238] mb-4 border-l-4 border-[#E65E83] pl-3">今天想練什麼？</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {SUBJECTS.map((s) => (
            <a key={s.href} href={s.href}
              className="group flex items-center gap-2.5 md:gap-4 p-3 md:p-5 bg-white rounded-2xl border border-slate-200 no-underline hover:border-[#E65E83] hover:shadow-md transition">
              <span className={`w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-xl ${s.tint} flex items-center justify-center text-xl md:text-3xl`} aria-hidden="true">{s.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-[#263238] text-[15px] md:text-lg">{s.title}</span>
                <span className="hidden md:block text-sm text-[#52616B]">{s.desc}</span>
              </span>
              <span className="hidden md:inline text-slate-300 group-hover:text-[#E65E83]" aria-hidden="true">›</span>
            </a>
          ))}
        </div>
      </section>

      {/* 精選練習 */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <h2 className="text-xl md:text-2xl font-bold text-[#263238] mb-4 border-l-4 border-[#E65E83] pl-3">精選練習</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {FEATURED.map((f) => (
            <a key={f.href} href={f.href}
              className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 no-underline text-[#263238] font-semibold text-sm hover:border-[#2457A7] hover:text-[#2457A7]">
              <span className="text-xl" aria-hidden="true">{f.icon}</span>
              <span>{f.title}</span>
            </a>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <PracticeCounter />
        </div>
      </section>

      {/* 每天練一點：每週一句＋今日挑戰 */}
      <section className="pb-4">
        <h2 className="max-w-4xl mx-auto px-4 text-xl md:text-2xl font-bold text-[#263238] border-l-4 border-[#E65E83] pl-3 ml-4 md:ml-auto">每天練一點</h2>
        <WeeklyEnglishCard />
        <DailyChallenge />
      </section>

      {/* 學習方法與陪伴指南 */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#263238] border-l-4 border-[#E65E83] pl-3">學習方法與陪伴指南</h2>
          <a href="/blog" className="text-sm font-semibold text-[#2457A7] no-underline">全部文章 ›</a>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {guides.map(({ label, post }) => (
            <a key={post!.slug} href={`/blog/${post!.slug}`}
              className="block p-5 bg-white rounded-2xl border border-slate-200 no-underline hover:border-[#E65E83] hover:shadow-md transition">
              <span className="text-xs font-bold text-[#E65E83]">{label}</span>
              <h3 className="mt-1 mb-2 text-base font-bold text-[#263238] leading-snug">{post!.title}</h3>
              <p className="text-sm text-[#52616B] leading-relaxed line-clamp-3 m-0">{post!.description}</p>
              {post!.readingTime && <p className="mt-2 mb-0 text-xs text-slate-500">閱讀約 {post!.readingTime} 分鐘</p>}
            </a>
          ))}
        </div>
      </section>

      {/* 電子報 */}
      <NewsletterCTA />
    </div>
  );
}
