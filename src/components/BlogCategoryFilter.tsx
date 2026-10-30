"use client";
/**
 * 學習文章列表（/blog）：搜尋＋分類篩選＋編輯精選＋最新文章列。
 * 全部在前端篩選；文章數不多，不分頁。
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import BlogCover from "@/components/BlogCover";

interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  readingTime?: number;
  author: string;
  image?: string;
}

const ALL = "全部";

function fmtDate(d: string) {
  return d ? d.slice(0, 10).replace(/-/g, "/") : "";
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-[#FDECF1] text-[#C2416A] whitespace-nowrap">
      {children}
    </span>
  );
}

function Meta({ post, className = "" }: { post: Post; className?: string }) {
  return (
    <span className={`flex items-center gap-3 text-[13px] text-[#52616B] ${className}`}>
      {post.readingTime && (
        <span className="inline-flex items-center gap-1 whitespace-nowrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          {post.readingTime} 分鐘
        </span>
      )}
      <time dateTime={post.date} className="whitespace-nowrap">{fmtDate(post.date)}</time>
    </span>
  );
}

/** 編輯精選：最新、且分類不重複的三篇。 */
function pickFeatured(posts: Post[]): Post[] {
  const seen = new Set<string>();
  const out: Post[] = [];
  for (const p of posts) {
    if (seen.has(p.category)) continue;
    seen.add(p.category);
    out.push(p);
    if (out.length === 3) break;
  }
  return out;
}

const PAGE_SIZE = 10;

export default function BlogCategoryFilter({ posts, categories }: { posts: Post[]; categories: string[] }) {
  const [active, setActive] = useState(ALL);
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of posts) m[p.category] = (m[p.category] || 0) + 1;
    return m;
  }, [posts]);

  const sortedCats = useMemo(
    () => [...categories].sort((a, b) => (counts[b] || 0) - (counts[a] || 0)),
    [categories, counts],
  );

  const featured = useMemo(() => pickFeatured(posts), [posts]);

  const q = query.trim().toLowerCase();
  const isFiltering = active !== ALL || q !== "";

  const filtered = posts.filter(p => {
    if (active !== ALL && p.category !== active) return false;
    if (!q) return true;
    return [p.title, p.description, p.category, ...p.tags].some(s => s.toLowerCase().includes(q));
  });

  const featuredSlugs = new Set(featured.map(p => p.slug));
  const rows = isFiltering ? filtered : posts.filter(p => !featuredSlugs.has(p.slug));

  // 一次只列 PAGE_SIZE 篇，其餘按「展開」才出現；換分類或搜尋時自動收回
  const sig = `${active}|${q}`;
  const [expandedSig, setExpandedSig] = useState<string | null>(null);
  const expanded = expandedSig === sig;
  const shownRows = expanded ? rows : rows.slice(0, PAGE_SIZE);

  return (
    <>
      {/* 搜尋 */}
      <form role="search" onSubmit={e => e.preventDefault()} className="flex gap-2 mb-4">
        <label className="flex-1 min-w-0 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 h-12 focus-within:border-[#2457A7] focus-within:ring-2 focus-within:ring-[#2457A7]/15">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#52616B" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <span className="sr-only">搜尋文章</span>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜尋文章標題、關鍵字或主題…"
            className="flex-1 min-w-0 bg-transparent outline-none text-[15px] text-[#263238] placeholder:text-slate-400"
          />
        </label>
        <button type="submit" className="shrink-0 h-12 px-5 md:px-7 rounded-xl bg-[#2457A7] text-white font-bold text-[15px] hover:bg-[#1d4a8f] transition">
          搜尋
        </button>
      </form>

      {/* 分類 */}
      <div className="-mx-4 px-4 flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible mb-8" role="tablist" aria-label="文章分類">
        {[ALL, ...sortedCats].map(cat => {
          const on = active === cat;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition cursor-pointer ${
                on
                  ? "bg-[#E65E83] border-[#E65E83] text-white"
                  : "bg-white border-slate-200 text-[#52616B] hover:border-[#E65E83] hover:text-[#C2416A]"
              }`}
            >
              {cat}
              <span className={`ml-1 text-xs ${on ? "text-white/80" : "text-slate-400"}`}>
                {cat === ALL ? posts.length : counts[cat] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* 編輯精選 */}
      {!isFiltering && featured.length > 0 && (
        <section className="mb-10" aria-labelledby="featured-heading">
          <div className="flex items-end gap-3 mb-4 flex-wrap">
            <h2 id="featured-heading" className="text-xl md:text-2xl font-bold text-[#263238] border-l-4 border-[#E65E83] pl-3 m-0">編輯精選</h2>
            <p className="text-sm text-[#52616B] m-0">最近更新、不同主題的三篇，先從這裡讀起。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featured.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-[#2457A7]/40 hover:shadow-md transition no-underline"
              >
                <BlogCover src={post.image} alt={post.title} className="aspect-[1200/630]" />
                <div className="flex flex-col flex-1 p-5">
                  <div className="mb-2"><Chip>{post.category}</Chip></div>
                  <h3 className="text-lg font-bold text-[#263238] leading-snug mb-2 line-clamp-2 group-hover:text-[#2457A7] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#52616B] leading-relaxed line-clamp-2 mb-4">{post.description}</p>
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <Meta post={post} />
                    <span className="shrink-0 inline-flex items-center px-3.5 py-1.5 rounded-xl bg-[#2457A7] text-white text-sm font-bold">
                      閱讀全文 ›
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 最新文章／篩選結果 */}
      <section aria-labelledby="list-heading">
        <div className="flex items-end gap-3 mb-4 flex-wrap">
          <h2 id="list-heading" className="text-xl md:text-2xl font-bold text-[#263238] border-l-4 border-[#E65E83] pl-3 m-0">
            {isFiltering ? (active !== ALL ? active : "搜尋結果") : "最新文章"}
          </h2>
          <p className="text-sm text-[#52616B] m-0">
            {isFiltering ? `共 ${filtered.length} 篇${q ? `，含「${query.trim()}」` : ""}` : "依發布日期排列，持續更新。"}
          </p>
        </div>

        {rows.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl py-14 text-center">
            <p className="text-[#52616B] mb-4">找不到符合的文章，換個關鍵字試試？</p>
            <button
              type="button"
              onClick={() => { setQuery(""); setActive(ALL); }}
              className="px-5 py-2 rounded-xl border border-[#2457A7] text-[#2457A7] bg-white font-bold text-sm hover:bg-[#2457A7]/5"
            >
              看全部文章
            </button>
          </div>
        ) : (
          <ul className="list-none p-0 m-0 space-y-3">
            {shownRows.map(post => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-center gap-4 md:gap-5 bg-white rounded-2xl border border-slate-200 p-3 md:p-4 hover:border-[#2457A7]/40 hover:shadow-sm transition no-underline"
                >
                  <BlogCover src={post.image} alt="" className="w-24 sm:w-32 md:w-40 aspect-[4/3] shrink-0 rounded-xl" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5"><Chip>{post.category}</Chip></div>
                    <h3 className="text-[15px] md:text-lg font-bold text-[#263238] leading-snug m-0 mb-1 line-clamp-2 group-hover:text-[#2457A7] transition-colors">
                      {post.title}
                    </h3>
                    <p className="hidden sm:block text-sm text-[#52616B] leading-relaxed m-0 line-clamp-1 md:line-clamp-2">{post.description}</p>
                    <Meta post={post} className="mt-1.5 md:hidden" />
                  </div>
                  <div className="hidden md:flex flex-col items-end gap-3 shrink-0 pl-2">
                    <Meta post={post} />
                    <span className="inline-flex items-center px-4 py-1.5 rounded-xl border border-[#2457A7] text-[#2457A7] bg-white text-sm font-bold group-hover:bg-[#2457A7] group-hover:text-white transition">
                      閱讀全文 ›
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {rows.length > PAGE_SIZE && (
          <div className="text-center mt-5">
            <button
              type="button"
              onClick={() => {
                if (expanded) {
                  setExpandedSig(null);
                  document.getElementById("list-heading")?.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                  setExpandedSig(sig);
                }
              }}
              aria-expanded={expanded}
              className="px-6 py-2.5 rounded-xl border border-[#2457A7] text-[#2457A7] bg-white font-bold text-sm cursor-pointer hover:bg-[#EEF3FB]"
            >
              {expanded ? "收合文章 ▲" : `展開其餘 ${rows.length - PAGE_SIZE} 篇 ▼`}
            </button>
          </div>
        )}
      </section>
    </>
  );
}
