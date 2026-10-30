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
import ShareSite from "@/components/ShareSite";
import SubjectIcon, { type SubjectIconName } from "@/components/SubjectIcon";

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

const SUBJECTS: { title: string; desc: string; href: string; icon: SubjectIconName; color: string }[] = [
  { title: "英文與英檢", desc: "初級・中級・中高級", href: "/elementary", icon: "book", color: "text-[#E65E83]" },
  { title: "日文學習", desc: "五十音・N5–N1", href: "/jlpt-n5", icon: "torii", color: "text-[#E0566F]" },
  { title: "國語與閱讀", desc: "注音・成語・閱讀", href: "/chinese-lang", icon: "reading", color: "text-[#F08A3E]" },
  { title: "數學練習", desc: "運算・幾何・應用題", href: "/math", icon: "calculator", color: "text-[#3B82C4]" },
  { title: "邏輯與教育遊戲", desc: "推理・記憶・程式，21 款", href: "/board-games", icon: "brain", color: "text-[#2BA58E]" },
  { title: "打字與鍵盤", desc: "中英文打字・鍵盤入門", href: "/typing-game", icon: "keyboard", color: "text-[#7C5CD6]" },
  { title: "歷史與地理", desc: "台灣・亞洲・世界", href: "/history-geo", icon: "globe", color: "text-[#1F9A7A]" },
  { title: "音樂與樂理", desc: "入門・基礎・進階", href: "/music", icon: "music", color: "text-[#9B5BD1]" },
  { title: "兒童理財", desc: "金錢觀念・儲蓄・預算", href: "/finance", icon: "coins", color: "text-[#E3A21A]" },
];

const HERO_PHOTOS = [
  { src: "/images/home/hero-adult-jp.webp", label: "日文", sub: "自己學", tag: "bg-[#E65E83]" },
  { src: "/images/home/hero-adult-en.webp", label: "英文", sub: "自己學", tag: "bg-[#2457A7]" },
  { src: "/images/home/hero-family.webp", label: "親子共學", sub: "一起練習", tag: "bg-[#2BA58E]" },
];

const FEATURED = [
  { title: "英檢中級模擬練習", href: "/intermediate/mock-test", img: "/images/home/feat-mock.webp" },
  { title: "日文五十音", href: "/jlpt-n5/gojuon", img: "/images/home/feat-kana.webp" },
  { title: "九九乘法", href: "/math/times-table", img: "/images/home/feat-times.webp" },
  { title: "鍵盤位置", href: "/typing-game/keyboard", img: "/images/home/feat-keyboard.webp" },
];

const GUIDE_POSTS = [
  { label: "成人自學", slug: "jlpt-n3-self-study", img: "/images/home/guide-adult.webp" },
  { label: "親子共學", slug: "how-to-help-kids-learn-english", img: "/images/home/guide-family.webp" },
  { label: "考試準備", slug: "mock-test-strategy", img: "/images/home/guide-exam.webp" },
];

export default function HomePage() {
  const searchIndex = buildSearchIndex();
  const guides = GUIDE_POSTS.map((g) => ({ ...g, post: getPostBySlug(g.slug) })).filter((g) => g.post);

  return (
    <div className="">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 最新消息跑馬燈（必留；內容在 src/data/site-updates.ts 與 exam-dates.ts） */}
      <UpdateTicker />
      <OnboardingTutorial />

      {/* 主視覺：左文案、右三張照片（大人自學／親子共學） */}
      <section>
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-6 md:pt-10 md:pb-10 grid md:grid-cols-[1fr_1.15fr] gap-6 md:gap-8 items-center">
          <div>
            <h1 className="text-[28px] leading-snug md:text-[30px] lg:text-[35px] md:leading-tight font-black text-[#263238] mb-3">
              大人小孩都能練，<br className="md:hidden" /><span className="text-[#E65E83] whitespace-nowrap">一起學更多。</span>
            </h1>
            <p className="text-[15px] md:text-lg text-[#52616B] leading-relaxed mb-2">
              想為自己學點新東西，也想陪孩子一起練習？<br className="hidden md:inline" />
              從英文、日文到國語、數學與動腦遊戲，找到適合的內容，照自己的步調開始。
            </p>
            <p className="text-sm text-[#52616B] mb-5">免費使用，不需註冊即可開始。</p>
            <div className="flex gap-2 md:gap-3">
              <a href="#subjects" className="inline-flex items-center gap-2 h-11 md:h-12 px-5 md:px-7 rounded-xl bg-[#2457A7] text-white font-bold no-underline hover:opacity-90">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                找練習
              </a>
              <a href="/parent-guide" className="inline-flex items-center gap-2 h-11 md:h-12 px-4 md:px-6 rounded-xl border border-[#2457A7] bg-white text-[#2457A7] font-bold no-underline hover:bg-blue-50">看看怎麼陪孩子學</a>
            </div>
            <div className="mt-4"><ShareSite /></div>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {HERO_PHOTOS.map((p) => (
              <div key={p.src} className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt="" className="w-full h-full object-cover" loading="eager" />
                <span className={`absolute left-1/2 -translate-x-1/2 bottom-2 md:bottom-3 ${p.tag} text-white text-center rounded-lg px-2 md:px-3 py-1 leading-tight shadow-sm whitespace-nowrap`}>
                  <span className="block text-xs md:text-sm font-bold">{p.label}</span>
                  <span className="block text-[10px] md:text-xs opacity-90">— {p.sub} —</span>
                </span>
              </div>
            ))}
          </div>
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
              <span className={`w-10 h-10 md:w-14 md:h-14 shrink-0 flex items-center justify-center ${s.color}`}><SubjectIcon name={s.icon} size={40} /></span>
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {FEATURED.map((f) => (
            <a key={f.href} href={f.href}
              className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden no-underline hover:shadow-md transition">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.img} alt="" loading="lazy" className="w-full aspect-[3/2] object-cover" />
              <span className="flex items-center justify-between px-3 md:px-4 py-3 font-bold text-sm md:text-base text-[#263238] group-hover:text-[#2457A7]">
                {f.title}<span aria-hidden="true">›</span>
              </span>
            </a>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <PracticeCounter />
        </div>
      </section>

      {/* 每天練一點（每週一句）＋今日挑戰：兩欄並排，各自有標題 */}
      <section className="max-w-6xl mx-auto px-4 pb-4 grid lg:grid-cols-2 gap-6 [&_section]:max-w-none [&_section]:p-0 [&_section]:m-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#263238] mb-4 border-l-4 border-[#E65E83] pl-3">每天練一點</h2>
          <WeeklyEnglishCard />
        </div>
        <div>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-[#263238] border-l-4 border-[#E65E83] pl-3">今日挑戰</h2>
            <a href="/board-games" className="text-sm font-semibold text-[#2457A7] no-underline">更多挑戰 →</a>
          </div>
          <DailyChallenge />
        </div>
      </section>

      {/* 學習方法與陪伴指南 */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#263238] border-l-4 border-[#E65E83] pl-3">學習方法與陪伴指南</h2>
          <a href="/blog" className="text-sm font-semibold text-[#2457A7] no-underline">全部文章 ›</a>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {guides.map(({ label, post, img }) => (
            <a key={post!.slug} href={`/blog/${post!.slug}`}
              className="flex gap-3 p-3 bg-white rounded-2xl border border-slate-200 no-underline hover:border-[#E65E83] hover:shadow-md transition">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" loading="lazy" className="w-28 md:w-32 aspect-[4/3] object-cover rounded-xl shrink-0 self-start" />
              <span className="min-w-0">
                <span className="text-xs font-bold text-[#E65E83]">{label}</span>
                <span className="block mt-1 text-[15px] font-bold text-[#263238] leading-snug line-clamp-3">{post!.title}</span>
                {post!.readingTime && <span className="block mt-1.5 text-xs text-slate-500">閱讀約 {post!.readingTime} 分鐘</span>}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* 電子報 */}
      <NewsletterCTA />
    </div>
  );
}
