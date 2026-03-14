import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllSlugs, getPostWithHtml, getAllPosts, TocItem } from '@/lib/blog';

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

  return {
    title: `${post.title} | 親子多元學習平台`,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    alternates: { canonical: `https://learn.chparenting.com/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://learn.chparenting.com/blog/${slug}`,
      siteName: '親子多元學習平台',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      locale: 'zh_TW',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
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

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '英檢攻略': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  '日檢攻略': { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  '親子教養': { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  '學習技巧': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
};

function TableOfContents({ toc }: { toc: TocItem[] }) {
  if (toc.length < 3) return null;

  return (
    <nav className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8" aria-label="目錄">
      <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
        📑 本文目錄
      </h2>
      <ol className="space-y-1.5 list-none pl-0 m-0">
        {toc.map((item, i) => (
          <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
            <a
              href={`#${item.id}`}
              className="text-sm text-slate-500 hover:text-rose-500 no-underline hover:underline transition-colors leading-relaxed"
            >
              {item.level === 2 ? `${i + 1}. ` : '› '}{item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostWithHtml(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const related = allPosts
    .filter(p => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  // If no same-category posts, show latest posts
  const relatedPosts = related.length > 0
    ? related
    : allPosts.filter(p => p.slug !== slug).slice(0, 3);

  const style = CATEGORY_COLORS[post.category] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };

  // Enhanced BlogPosting Schema
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mommy Wisdom International',
      url: 'https://learn.chparenting.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://learn.chparenting.com/blog/${slug}`,
    },
    url: `https://learn.chparenting.com/blog/${slug}`,
    keywords: post.tags.join(', '),
    articleSection: post.category,
    inLanguage: 'zh-TW',
    wordCount: post.content.length,
  };

  // BreadcrumbList Schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首頁',
        item: 'https://learn.chparenting.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '部落格',
        item: 'https://learn.chparenting.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://learn.chparenting.com/blog/${slug}`,
      },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400 mb-8" aria-label="breadcrumb">
        <ol className="flex items-center gap-0 list-none p-0 m-0">
          <li><Link href="/" className="hover:text-slate-600 no-underline">首頁</Link></li>
          <li><span className="mx-2">›</span></li>
          <li><Link href="/blog" className="hover:text-slate-600 no-underline">部落格</Link></li>
          <li><span className="mx-2">›</span></li>
          <li className="text-slate-600 truncate max-w-[200px]">{post.title}</li>
        </ol>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
            {post.category}
          </span>
          <time className="text-sm text-slate-400" dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
          {post.readingTime && (
            <span className="text-sm text-slate-400">· 閱讀 {post.readingTime} 分鐘</span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight mb-4">
          {post.title}
        </h1>
        <p className="text-slate-500 text-lg leading-relaxed">{post.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span key={tag} className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* Table of Contents */}
      {post.toc && <TableOfContents toc={post.toc} />}

      {/* Article Content */}
      <article
        className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:scroll-mt-20 prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-100 prose-h3:text-lg prose-h3:mt-6 prose-p:leading-7 prose-p:text-slate-600 prose-li:text-slate-600 prose-a:text-rose-500 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-800 prose-blockquote:border-rose-300 prose-blockquote:bg-rose-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-table:border-collapse prose-th:bg-slate-50 prose-th:border prose-th:border-slate-200 prose-th:px-3 prose-th:py-2 prose-td:border prose-td:border-slate-200 prose-td:px-3 prose-td:py-2"
        dangerouslySetInnerHTML={{ __html: post.htmlContent || '' }}
      />

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <aside className="mt-12 pt-8 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">推薦閱讀</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedPosts.map(r => {
              const rs = CATEGORY_COLORS[r.category] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
              return (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group"
                >
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${rs.bg} ${rs.text} ${rs.border}`}>
                    {r.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 mt-2 mb-1 line-clamp-2 group-hover:text-rose-500 transition-colors">{r.title}</h3>
                  <p className="text-xs text-slate-400">
                    {new Date(r.date).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </Link>
              );
            })}
          </div>
        </aside>
      )}

      {/* Back to Blog */}
      <div className="mt-10 text-center">
        <Link href="/blog"
          className="inline-block px-6 py-2.5 bg-rose-100 border border-rose-300 text-rose-500 rounded-xl font-semibold text-sm hover:bg-rose-200 transition no-underline">
          ← 回到部落格
        </Link>
      </div>
    </div>
  );
}
