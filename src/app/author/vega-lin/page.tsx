import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { SectionTitle } from "@/components/PageHeader";
import InfoIcon, { type InfoIconName } from "@/components/InfoPageIcons";

const AUTHOR = {
  id: "https://learn.chparenting.com/author/vega-lin#person",
  url: "https://learn.chparenting.com/author/vega-lin",
  name: "薇佳媽媽",
  nameEn: "Vega",
  photo: "https://character.chparenting.com/src/img/author.jpg",
} as const;

export const metadata: Metadata = {
  title: "薇佳媽媽（Vega）｜平台創辦人與文章作者 | learn.chparenting.com",
  description:
    "薇佳媽媽（Vega），兩個國小孩子的媽媽，曾任英語補教與國小代課教師，東海大學數位創新碩士學程畢業。為了陪自己的孩子準備英檢做了這個平台，後來開放給所有家長。",
  alternates: { canonical: AUTHOR.url },
};

/**
 * 作者頁。站上 34 篇文章此前只署名品牌代號「Mommy Wisdom」，沒有連到任何人物頁，
 * BlogPosting 的 author 也只是一個沒有 @id 的名字。這一頁讓文章、layout 的
 * Organization.founder、以及每篇 BlogPosting.author 都指向同一個 Person @id。
 *
 * 內容只寫 Vega 本人提供的背景，不添加任何她沒說的資歷或年數。
 * 2026-09：作者資料與主站／冒險英語／品格站統一（同一張照片、同一份資歷與 sameAs），
 * 讓搜尋引擎把四個網站的作者認成同一個人。東吳日文系是 learn 才需要交代的背景，保留。
 */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": AUTHOR.id,
  name: AUTHOR.name,
  alternateName: [AUTHOR.nameEn, "Vega Lin", "薇佳媽咪"],
  url: AUTHOR.url,
  image: AUTHOR.photo,
  email: "mailto:hello@chparenting.com",
  description: "兩個國小孩子的媽媽，數位創新碩士，用故事陪孩子練習好品格",
  jobTitle: "創辦人",
  worksFor: { "@type": "Organization", name: "智慧媽咪國際有限公司", url: "https://chparenting.com/" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "東海大學數位創新碩士學程" },
    { "@type": "CollegeOrUniversity", name: "東吳大學", department: "日本語文學系" },
  ],
  hasCredential: [
    { "@type": "EducationalOccupationalCredential", name: "經濟部 iPAS AI 應用規劃師（初級）", recognizedBy: { "@type": "Organization", name: "經濟部產業人才能力鑑定" } },
    { "@type": "EducationalOccupationalCredential", name: "資策會 生成式 AI 能力認證", recognizedBy: { "@type": "Organization", name: "資訊工業策進會" } },
  ],
  knowsAbout: ["品格教育", "親子教育", "兒童英語教學", "數位創新", "生成式 AI", "全民英檢 GEPT", "日文檢定 JLPT"],
  sameAs: [
    "https://chparenting.com/",
    "https://english.chparenting.com/",
    "https://learn.chparenting.com/",
    "https://character.chparenting.com/about/",
    "https://www.instagram.com/vega_balancelife",
    "https://www.facebook.com/MomLifeRecoveryLab",
  ],
};

const BACKGROUND: { icon: InfoIconName; strong: string; rest?: string }[] = [
  { icon: "book", strong: "東吳大學日本語文學系畢業。", rest: "站上 JLPT N5 到 N1 的單元和陪伴說明，底子是從這裡來的。" },
  { icon: "book", strong: "東海大學數位創新碩士學程（碩士）畢業。", rest: "整個平台從題庫到互動練習，都是自己動手做的。" },
  { icon: "check", strong: "經濟部 iPAS AI 應用規劃師（初級）、資策會 生成式 AI 能力認證。" },
  { icon: "target", strong: "7 年數位行銷經驗。" },
  { icon: "pen", strong: "曾任英語補習班教師、國小代課教師。", rest: "各單元「孩子最常卡在哪」那些筆記不是查來的，是一屆一屆學生教會我的。" },
  { icon: "heart", strong: "心靈諮詢相關領域七年。", rest: "所以陪讀建議裡常常寫「先問孩子怎麼想」，而不是急著糾正——那是在諮詢工作裡養成的習慣。" },
  { icon: "home", strong: "智慧媽咪國際有限公司負責人。", rest: "這個平台由公司營運，但內容全部免費。" },
];

export default function AuthorPage() {
  const posts = getAllPosts();
  const link = "text-[#2457A7] font-medium hover:underline";

  return (
    <div className="bg-white pb-12">
      <div className="max-w-4xl mx-auto px-4 pt-6 md:pt-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />

        <nav className="text-sm text-[#52616B] mb-6" aria-label="breadcrumb">
          <Link href="/" className="hover:text-[#263238] no-underline">首頁</Link>
          <span className="mx-2">›</span>
          <span className="text-[#263238]">作者</span>
        </nav>

        <header className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 mb-6">
          <p className="text-sm text-[#E65E83] font-bold mb-3">平台創辦人・文章作者</p>
          <div className="flex items-center gap-5 mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={AUTHOR.photo} alt="薇佳媽媽（Vega）" width={96} height={96} className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border border-slate-200 shrink-0" />
            <div className="min-w-0">
              <h1 className="text-[26px] md:text-3xl font-black text-[#263238] mb-1">
                {AUTHOR.name}<span className="text-[#52616B] font-normal text-xl md:text-2xl">（{AUTHOR.nameEn}）</span>
              </h1>
              <p className="text-[#52616B] text-sm m-0">兩個國小孩子的媽媽，數位創新碩士，用故事陪孩子練習好品格</p>
            </div>
          </div>
          <p className="text-[#52616B] leading-relaxed mb-3">
            薇佳媽媽（Vega），兩個國小孩子的媽媽（五年級、一年級）。曾任英語補教與國小代課教師，7 年數位行銷經驗，
            東海大學數位創新碩士學程畢業。經營 chparenting 親子網站、冒險英語兒童美語自學平台，以及「原來會這樣！」品格互動繪本。
          </p>
          <p className="text-[#263238] text-lg leading-relaxed m-0">
            這個平台原本是為了陪自己的孩子準備英檢做的，後來想，既然做了，就開放給所有需要的家長——免費、不用註冊、練習單直接印。
            站上的文章，還有每個單元裡的「老師的話」，都是我自己寫的。
          </p>
        </header>

        <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 mb-6">
          <SectionTitle>背景</SectionTitle>
          <ul className="list-none p-0 m-0 space-y-3 text-[#52616B] leading-relaxed">
            {BACKGROUND.map((b) => (
              <li key={b.strong} className="flex gap-3">
                <span className="shrink-0 w-8 h-8 rounded-lg bg-[#FDECF1] text-[#E65E83] flex items-center justify-center"><InfoIcon name={b.icon} size={16} /></span>
                <span className="pt-1"><strong className="text-[#263238]">{b.strong}</strong>{b.rest}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 mb-6">
          <SectionTitle>為什麼做這個平台</SectionTitle>
          <p className="text-[#52616B] leading-relaxed mb-3">
            我自己的孩子要考英檢的時候，找不到一個中文介面、免費、又能讓國小生自己操作的練習工具。
            官方題庫夠權威，但沒有陪讀的視角；補習班有進度，但費用不低。
            所以先做給自己的孩子用，做著做著，就開放了。
          </p>
          <p className="text-[#52616B] leading-relaxed m-0">
            我在意的從來不是把孩子交給一個工具。我在意的是親子之間的教育——家長知道今天陪什麼、怎麼陪、要多久，孩子才不會是一個人在學。
            這也是為什麼每個單元都有「家長陪伴指南」，而不只是題目。
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 mb-6">
          <SectionTitle>其他地方找到我</SectionTitle>
          <ul className="list-none p-0 m-0 space-y-2 text-sm text-[#52616B]">
            <li><a href="https://chparenting.com/about/" className={link}>媽媽生活復原力 Lab（chparenting.com）</a> — 育兒、情緒與親子關係的文章</li>
            <li><a href="https://english.chparenting.com/" className={link}>Adventure English 冒險英語</a> — 兒童美語互動自學平台</li>
            <li><a href="https://character.chparenting.com/" className={link}>「原來會這樣！」品格互動繪本</a> — 用羊毛氈 3D 故事陪孩子練習好品格</li>
            <li>聯絡：<a href="mailto:hello@chparenting.com" className={link}>hello@chparenting.com</a></li>
            <li><a href="https://www.instagram.com/vega_balancelife" className={link} rel="me">Instagram</a>・<a href="https://www.facebook.com/MomLifeRecoveryLab" className={link} rel="me">Facebook</a></li>
          </ul>
          <p className="text-[#52616B] leading-relaxed mt-4 mb-0 text-sm">
            我也經營「原來會這樣！」品格互動繪本，用羊毛氈 3D 故事陪孩子練習好品格：
            <a href="https://character.chparenting.com/" className="text-[#2457A7] hover:underline font-bold">看更多</a>
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
          <SectionTitle>文章（{posts.length} 篇）</SectionTitle>
          <ul className="list-none p-0 m-0 divide-y divide-slate-100">
            {posts.map((p) => (
              <li key={p.slug} className="flex flex-col sm:flex-row gap-0.5 sm:gap-4 py-2.5 text-sm">
                <time className="shrink-0 text-[#52616B] tabular-nums" dateTime={p.date}>{p.date}</time>
                <Link href={`/blog/${p.slug}`} className="text-[#263238] hover:text-[#2457A7] no-underline hover:underline">{p.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
