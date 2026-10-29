import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllSlugs, getPostWithHtml, getAllPosts, TocItem, FaqItem } from '@/lib/blog';
import contentDates from '@/data/content-dates.json';
import BlogCover from '@/components/BlogCover';

const AUTHOR = {
  id: 'https://learn.chparenting.com/author/vega-lin#person',
  url: 'https://learn.chparenting.com/author/vega-lin',
  name: '薇佳媽媽',
  nameZh: 'Vega',
} as const;

/** 與 /author/vega-lin 頁同一張照片。 */
const AUTHOR_PHOTO = 'https://character.chparenting.com/src/img/author.jpg';

/** 真實的最後修改日期（來自 git，見 scripts/generate-content-dates.mjs）；沒有就退回發布日。 */
function modifiedDateFor(slug: string, published: string): string {
  const iso = (contentDates as Record<string, string>)[`/blog/${slug}`];
  return iso ? iso.slice(0, 10) : published;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostWithHtml(slug);
  if (!post) return {};

  const ogImage = post.image
    ? `https://learn.chparenting.com${post.image}`
    : 'https://learn.chparenting.com/og-image.png';

  return {
    title: `${post.title} | 親子多元學習平台`,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
    alternates: { canonical: `https://learn.chparenting.com/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://learn.chparenting.com/blog/${slug}`,
      siteName: '親子多元學習平台',
      type: 'article',
      publishedTime: post.date,
      authors: [AUTHOR.url],
      tags: post.tags,
      locale: 'zh_TW',
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  };
}

function fmtDate(d: string) {
  return d ? d.slice(0, 10).replace(/-/g, '/') : '';
}

/** 文章內不算「練習」的站內連結。 */
const NON_PRACTICE = /^\/($|blog|images|exam-info|about|how-to-use|parent-guide|author|faq|updates|login|dashboard|achievements)/;

/** 從文章內文找出最常連到的站內練習頁（只用文章本來就有的連結，不另外猜）。 */
function findPracticeLink(html: string): { href: string; label: string } | null {
  const re = /<a\s[^>]*href="(\/[^"#?]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  const hits = new Map<string, { count: number; label: string; order: number }>();
  let m: RegExpExecArray | null;
  let order = 0;
  while ((m = re.exec(html)) !== null) {
    const href = m[1].replace(/\/$/, '') || '/';
    if (NON_PRACTICE.test(href)) continue;
    const label = m[2].replace(/<[^>]*>/g, '').trim();
    const h = hits.get(href);
    // 「前往練習」「開始玩」這類通用字不當名稱；同一頁有多個錨點文字時取最具體（最長）的
    const useful = label.length > 0 && label.length <= 30 && !/^(前往|點這裡|開始|立即|馬上)/.test(label);
    if (h) {
      h.count++;
      if (useful && (!h.label || label.length > h.label.length)) h.label = label;
    } else hits.set(href, { count: 1, label: useful ? label : '', order: order++ });
  }
  let best: { href: string; label: string; count: number; order: number } | null = null;
  hits.forEach((v, href) => {
    if (!best || v.count > best.count || (v.count === best.count && v.order < best.order)) best = { href, ...v };
  });
  if (!best) return null;
  const { href, label } = best;
  return { href, label };
}

/** 表格包一層可橫向捲動的容器，手機上不會撐破版面。 */
function wrapTables(html: string): string {
  return html
    .replace(/<table/g, '<div class="blog-table-wrap overflow-x-auto my-7 rounded-xl border border-[#F3D5DE]"><table')
    .replace(/<\/table>/g, '</table></div>');
}

function TocLinks({ toc, compact = false }: { toc: TocItem[]; compact?: boolean }) {
  return (
    <ol className="list-none p-0 m-0 space-y-0.5">
      {toc.map(item => (
        <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
          <a
            href={`#${item.id}`}
            className={`block rounded-lg px-3 py-1.5 no-underline transition-colors leading-snug hover:bg-[#FFF6F8] hover:text-[#C2416A] ${
              item.level === 3 ? 'text-[13px] text-slate-500' : `${compact ? 'text-[15px]' : 'text-sm'} text-[#52616B]`
            }`}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

function FaqSection({ faq }: { faq: FaqItem[] }) {
  if (!faq || faq.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="text-xl md:text-[22px] font-bold text-[#263238] border-l-4 border-[#E65E83] pl-3 mb-4">常見問題</h2>
      <dl className="m-0 bg-slate-50 border border-slate-200 rounded-2xl divide-y divide-slate-200">
        {faq.map((item, i) => (
          <div key={i} className="p-5">
            <dt className="font-bold text-[#263238] mb-1.5">Q：{item.q}</dt>
            <dd className="text-[#52616B] leading-[1.85] m-0">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const PROSE = [
  'prose prose-slate max-w-none text-[17px] leading-[1.9] text-[#37474F]',
  'prose-p:leading-[1.9] prose-p:text-[#37474F] prose-li:text-[#37474F] prose-li:my-1',
  'prose-headings:text-[#263238] prose-headings:font-bold prose-headings:scroll-mt-24',
  'prose-h2:text-[22px] md:prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-[#E65E83] prose-h2:pl-3 prose-h2:leading-snug',
  'prose-h3:text-lg md:prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3',
  'prose-a:text-[#2457A7] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline',
  'prose-strong:text-[#263238]',
  'prose-blockquote:border-l-4 prose-blockquote:border-[#E65E83] prose-blockquote:bg-[#FFF6F8] prose-blockquote:py-1 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:font-normal prose-blockquote:text-[#37474F]',
  'prose-img:w-full prose-img:rounded-2xl prose-img:my-8 prose-img:border prose-img:border-slate-200',
  'prose-table:my-0 prose-table:text-[15px] prose-table:leading-relaxed',
  'prose-th:bg-[#FFF6F8] prose-th:text-[#263238] prose-th:font-bold prose-th:px-4 prose-th:py-2.5 prose-th:border-b prose-th:border-[#F3D5DE] prose-th:whitespace-nowrap',
  'prose-td:px-4 prose-td:py-2.5 prose-td:border-t prose-td:border-slate-100',
  'prose-hr:border-slate-200',
  '[&_blockquote_p:first-of-type]:before:content-none [&_blockquote_p:last-of-type]:after:content-none',
].join(' ');

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostWithHtml(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  // 同分類優先，不足三篇再用其他最新文章補滿
  const sameCat = allPosts.filter(p => p.slug !== slug && p.category === post.category);
  const others = allPosts.filter(p => p.slug !== slug && p.category !== post.category);
  const relatedPosts = [...sameCat, ...others].slice(0, 3);

  const tocAll = post.toc || [];
  const tocH2 = tocAll.filter(t => t.level === 2);
  const practice = findPracticeLink(post.htmlContent || '');
  const articleHtml = wrapTables(post.htmlContent || '');

  const modified = modifiedDateFor(slug, post.date);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: modified,
    author: { '@type': 'Person', '@id': AUTHOR.id, name: AUTHOR.name, alternateName: AUTHOR.nameZh, url: AUTHOR.url },
    publisher: { '@id': 'https://learn.chparenting.com#organization' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://learn.chparenting.com/blog/${slug}` },
    url: `https://learn.chparenting.com/blog/${slug}`,
    keywords: post.tags.join(', '),
    articleSection: post.category,
    inLanguage: 'zh-TW',
    wordCount: post.content.length,
    ...(post.image ? { image: `https://learn.chparenting.com${post.image}` } : {}),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: 'https://learn.chparenting.com' },
      { '@type': 'ListItem', position: 2, name: '學習文章', item: 'https://learn.chparenting.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://learn.chparenting.com/blog/${slug}` },
    ],
  };

  const faqJsonLd = post.faq && post.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  } : null;

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4 pb-14 md:pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      {/* Breadcrumb（此頁自帶，全站 Breadcrumb 會略過 /blog/[slug]） */}
      <nav className="google-anno-skip text-sm text-[#52616B] mb-5" aria-label="breadcrumb">
        <ol className="flex items-center gap-0 list-none p-0 m-0 min-w-0">
          <li className="shrink-0"><Link href="/" className="text-[#52616B] hover:text-[#2457A7] no-underline">首頁</Link></li>
          <li className="shrink-0" aria-hidden="true"><span className="mx-2 text-slate-400">›</span></li>
          <li className="shrink-0"><Link href="/blog" className="text-[#E65E83] font-semibold hover:text-[#C2416A] no-underline">學習文章</Link></li>
          <li className="shrink-0" aria-hidden="true"><span className="mx-2 text-slate-400">›</span></li>
          <li className="truncate min-w-0 text-slate-500" aria-current="page">{post.title}</li>
        </ol>
      </nav>

      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8 items-start">
        {/* 左側目錄（桌機） */}
        {tocH2.length > 0 && (
          <aside className="google-anno-skip hidden lg:block sticky top-24">
            <nav className="bg-white border border-slate-200 rounded-2xl p-4" aria-label="本文重點">
              <div className="text-[15px] font-bold text-[#263238] px-3 pb-2 mb-1 border-b border-slate-100">本文重點</div>
              <TocLinks toc={tocH2} />
            </nav>
          </aside>
        )}

        <div className={`min-w-0 ${tocH2.length === 0 ? 'lg:col-span-2' : ''}`}>
          <div className="bg-white md:border md:border-slate-200 md:rounded-2xl md:px-10 md:py-9">
            <div className="max-w-[720px] mx-auto">
              {/* Article Header（google-anno-skip：標題、標籤不要被 Google 廣告意圖插入連結） */}
              <header className="google-anno-skip mb-7">
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#FDECF1] text-[#C2416A] mb-3">
                  {post.category}
                </span>
                <h1 className="text-[26px] md:text-[34px] font-black text-[#263238] leading-[1.3] m-0 mb-4">
                  {post.title}
                </h1>
                <div className="flex items-center gap-x-4 gap-y-2 flex-wrap text-sm text-[#52616B]">
                  <Link href="/author/vega-lin" rel="author" className="inline-flex items-center gap-2 no-underline text-[#263238] font-bold hover:text-[#2457A7]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={AUTHOR_PHOTO} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-slate-50" />
                    {AUTHOR.name}（{AUTHOR.nameZh}）
                  </Link>
                  <span>發布 <time dateTime={post.date}>{fmtDate(post.date)}</time></span>
                  {modified !== post.date && (
                    <span>更新日期 <time dateTime={modified}>{fmtDate(modified)}</time></span>
                  )}
                  {post.readingTime && <span>閱讀約 {post.readingTime} 分鐘</span>}
                </div>
              </header>

              {/* Hero Image */}
              {post.image && (
                <BlogCover
                  src={post.image}
                  alt={post.title}
                  priority
                  className="aspect-[1200/630] rounded-2xl border border-slate-200 mb-7"
                />
              )}

              {/* 文章重點：直接用文章自己的摘要（description） */}
              {post.description && (
                <div className="google-anno-skip bg-[#FFF6F8] border border-[#F6D9E2] rounded-2xl px-5 py-4 md:px-6 md:py-5 mb-8">
                  <div className="text-[15px] font-bold text-[#C2416A] mb-1.5">文章重點</div>
                  <p className="text-[16px] leading-[1.85] text-[#37474F] m-0">{post.description}</p>
                </div>
              )}

              {/* 手機／平板目錄：預設收合 */}
              {tocAll.length >= 3 && (
                <details className="google-anno-skip lg:hidden bg-slate-50 border border-slate-200 rounded-2xl mb-8 group">
                  <summary className="cursor-pointer list-none flex items-center justify-between px-5 py-3.5 font-bold text-[#263238]">
                    本文目錄
                    <span className="text-[#52616B] text-sm font-normal group-open:hidden">展開 ▾</span>
                    <span className="text-[#52616B] text-sm font-normal hidden group-open:inline">收合 ▴</span>
                  </summary>
                  <div className="px-2 pb-3">
                    <TocLinks toc={tocAll} compact />
                  </div>
                </details>
              )}

              {/* Article Content */}
              <article className={PROSE} dangerouslySetInnerHTML={{ __html: articleHtml }} />

              {/* 前往相關練習（只在文章本身有連到練習頁時出現） */}
              {practice && (
                <div className="google-anno-skip mt-10 flex flex-col sm:flex-row sm:items-center gap-4 bg-[#F2F6FC] border border-[#D6E2F3] rounded-2xl px-5 py-5 md:px-6">
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-bold text-[#263238] mb-1">前往相關練習</div>
                    <p className="text-[15px] text-[#52616B] m-0 leading-relaxed line-clamp-2">
                      {practice.label ? `讀完就動手：文中提到的「${practice.label}」可以直接線上練習。` : '讀完就動手，把文中的方法直接拿來練習。'}
                    </p>
                  </div>
                  <Link href={practice.href} className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#2457A7] text-white font-bold no-underline hover:bg-[#1d4a8f] transition">
                    前往練習 →
                  </Link>
                </div>
              )}

              {/* FAQ Section (from frontmatter) */}
              <FaqSection faq={post.faq || []} />

              {/* 標籤 */}
              {post.tags.length > 0 && (
                <div className="google-anno-skip mt-10 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs text-[#52616B] bg-slate-100 px-2.5 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 延伸閱讀 */}
          {relatedPosts.length > 0 && (
            <aside className="mt-10" aria-labelledby="related-heading">
              <div className="flex items-end justify-between gap-3 mb-4">
                <h2 id="related-heading" className="text-xl md:text-2xl font-bold text-[#263238] border-l-4 border-[#E65E83] pl-3 m-0">延伸閱讀</h2>
                <Link href="/blog" className="text-sm font-semibold text-[#2457A7] no-underline hover:underline shrink-0">查看更多文章 ›</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPosts.map(r => (
                  <Link key={r.slug} href={`/blog/${r.slug}`}
                    className="group flex gap-3 bg-white rounded-2xl border border-slate-200 p-3 hover:border-[#2457A7]/40 hover:shadow-sm transition no-underline">
                    <BlogCover src={r.image} alt="" className="w-24 aspect-[4/3] shrink-0 rounded-xl" />
                    <div className="min-w-0 flex flex-col">
                      <h3 className="text-[15px] font-bold text-[#263238] leading-snug m-0 mb-1 line-clamp-2 group-hover:text-[#2457A7] transition-colors">{r.title}</h3>
                      <p className="text-xs text-[#52616B] leading-relaxed m-0 line-clamp-2">{r.description}</p>
                      <time dateTime={r.date} className="mt-auto pt-1 text-xs text-slate-400">{fmtDate(r.date)}</time>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          )}

          <div className="mt-8">
            <Link href="/blog" className="text-sm font-semibold text-[#2457A7] no-underline hover:underline">
              ← 回到學習文章
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
