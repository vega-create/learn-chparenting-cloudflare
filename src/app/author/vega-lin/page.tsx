import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

const AUTHOR = {
  id: "https://learn.chparenting.com/author/vega-lin#person",
  url: "https://learn.chparenting.com/author/vega-lin",
  name: "Vega Lin",
  nameZh: "薇佳媽咪",
} as const;

export const metadata: Metadata = {
  title: "Vega Lin（薇佳媽咪）｜平台創辦人與文章作者 | learn.chparenting.com",
  description:
    "東吳大學日文系畢業、東海大學數位創新碩士，多年補教業教學經驗，智慧媽咪國際負責人，兩個孩子的媽媽。為了陪自己的孩子準備英檢，做了這個免費的親子學習平台。",
  alternates: { canonical: AUTHOR.url },
};

/**
 * 作者頁。站上 34 篇文章此前只署名品牌代號「Mommy Wisdom」，沒有連到任何人物頁，
 * BlogPosting 的 author 也只是一個沒有 @id 的名字。這一頁讓文章、layout 的
 * Organization.founder、以及每篇 BlogPosting.author 都指向同一個 Person @id。
 *
 * 內容只寫 Vega 本人提供的背景，不添加任何她沒說的資歷或年數。
 */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": AUTHOR.id,
  name: AUTHOR.name,
  alternateName: AUTHOR.nameZh,
  url: AUTHOR.url,
  jobTitle: "創辦人",
  worksFor: { "@id": "https://learn.chparenting.com#organization" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "東吳大學", department: "日本語文學系" },
    { "@type": "CollegeOrUniversity", name: "東海大學", description: "數位創新碩士" },
  ],
  knowsAbout: ["日文教學", "全民英檢 GEPT", "日文檢定 JLPT", "親子教育", "兒童學習陪伴"],
  sameAs: [
    "https://chparenting.com/about/",
    "https://www.instagram.com/vega_balancelife",
    "https://www.facebook.com/MomLifeRecoveryLab",
  ],
};

export default function AuthorPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />

      <nav className="text-sm text-slate-400 mb-8" aria-label="breadcrumb">
        <Link href="/" className="hover:text-slate-600 no-underline">首頁</Link>
        <span className="mx-2">›</span>
        <span className="text-slate-600">作者</span>
      </nav>

      <header className="mb-10">
        <p className="text-sm text-rose-500 font-semibold mb-2">平台創辦人・文章作者</p>
        <h1 className="text-3xl font-black text-slate-800 mb-3">
          {AUTHOR.name}<span className="text-slate-400 font-normal text-2xl">（{AUTHOR.nameZh}）</span>
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          兩個孩子的媽媽。為了陪自己的孩子準備英檢，動手做了這個免費、不用註冊、練習單可以列印的學習平台。
          站上所有文章與各單元的「老師的話」都由我撰寫。
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-800 mb-4">背景</h2>
        <ul className="space-y-3 text-slate-700 leading-relaxed">
          <li className="flex gap-3"><span className="shrink-0">🎓</span><span><strong>東吳大學日本語文學系</strong>畢業——站上 JLPT N5 到 N1 的單元與陪伴說明，是從這裡的底子來的。</span></li>
          <li className="flex gap-3"><span className="shrink-0">🎓</span><span><strong>東海大學數位創新碩士</strong>——這個平台從題庫到互動練習都是自己開發的。</span></li>
          <li className="flex gap-3"><span className="shrink-0">📚</span><span><strong>多年補教業教學經驗</strong>——各單元「孩子最常卡在哪」那些筆記，是實際教過才知道的。</span></li>
          <li className="flex gap-3"><span className="shrink-0">💛</span><span><strong>心靈諮詢相關領域 7 年</strong>——所以陪讀建議裡常寫「先問孩子怎麼想的」，而不是先糾正。</span></li>
          <li className="flex gap-3"><span className="shrink-0">🏢</span><span><strong>智慧媽咪國際有限公司負責人</strong>，本平台由公司營運，內容全部免費。</span></li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-800 mb-3">為什麼做這個平台</h2>
        <p className="text-slate-600 leading-relaxed mb-3">
          我自己的孩子要考英檢的時候，找不到一個中文介面、免費、又能讓國小生自己操作的練習工具。
          官方題庫有權威但沒有陪讀的視角，補習班有進度但費用不低。
          所以先做給自己的孩子用，後來開放給所有家長。
        </p>
        <p className="text-slate-600 leading-relaxed">
          我重視的是親子之間的教育——不是把孩子交給工具，而是讓家長知道今天陪什麼、怎麼陪、要多久。
          這也是為什麼每個單元都附「家長陪伴指南」，而不只是題目。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-800 mb-3">其他地方找到我</h2>
        <ul className="space-y-2 text-sm">
          <li><a href="https://chparenting.com/about/" className="text-rose-500 hover:underline">媽媽生活復原力 Lab（chparenting.com）</a> — 育兒、情緒與親子關係的文章</li>
          <li><a href="https://english.chparenting.com/" className="text-rose-500 hover:underline">Adventure English 冒險英語</a> — 兒童美語互動自學平台</li>
          <li><a href="https://www.instagram.com/vega_balancelife" className="text-rose-500 hover:underline" rel="me">Instagram</a>・<a href="https://www.facebook.com/MomLifeRecoveryLab" className="text-rose-500 hover:underline" rel="me">Facebook</a></li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4">文章（{posts.length} 篇）</h2>
        <ul className="space-y-2">
          {posts.map((p) => (
            <li key={p.slug} className="flex gap-3 text-sm">
              <time className="shrink-0 text-slate-400 tabular-nums" dateTime={p.date}>{p.date}</time>
              <Link href={`/blog/${p.slug}`} className="text-slate-700 hover:text-rose-500 no-underline hover:underline">{p.title}</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
