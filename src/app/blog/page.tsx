import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: '學習部落格 | 英檢日檢攻略・親子教養 | 親子多元學習平台',
  description: '全民英檢GEPT準備攻略、JLPT日文檢定學習技巧、親子教養心得分享。提供系統化的學習方法、考試準備建議與免費學習資源。',
  keywords: ['全民英檢', 'GEPT', 'JLPT', '日文檢定', '親子教養', '學習技巧', '考試攻略', '英文學習', '日語學習', '親子學習'],
  alternates: { canonical: 'https://learn.chparenting.com/blog' },
  openGraph: {
    title: '學習部落格 | 英檢日檢攻略・親子教養',
    description: '全民英檢GEPT準備攻略、JLPT日文檢定學習技巧、親子教養心得分享',
    url: 'https://learn.chparenting.com/blog',
    siteName: '親子多元學習平台',
    type: 'website',
    locale: 'zh_TW',
  },
  twitter: {
    card: 'summary_large_image',
    title: '學習部落格 | 親子多元學習平台',
    description: '全民英檢GEPT準備攻略、JLPT日文檢定學習技巧、親子教養心得分享',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '英檢攻略': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  '日檢攻略': { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  '親子教養': { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  '學習技巧': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
}

export default function BlogPage() {
  const posts = getAllPosts();

  // CollectionPage + Blog Schema
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '學習部落格',
    description: '全民英檢GEPT準備攻略、JLPT日文檢定學習技巧、親子教養心得分享',
    url: 'https://learn.chparenting.com/blog',
    isPartOf: {
      '@type': 'WebSite',
      name: '親子多元學習平台',
      url: 'https://learn.chparenting.com',
    },
    mainEntity: {
      '@type': 'Blog',
      name: '學習部落格',
      description: '全民英檢GEPT準備攻略、JLPT日文檢定學習技巧、親子教養心得分享',
      url: 'https://learn.chparenting.com/blog',
      publisher: {
        '@type': 'Organization',
        name: 'Mommy Wisdom International',
        url: 'https://learn.chparenting.com',
      },
      blogPost: posts.map(p => ({
        '@type': 'BlogPosting',
        headline: p.title,
        description: p.description,
        datePublished: p.date,
        url: `https://learn.chparenting.com/blog/${p.slug}`,
        author: { '@type': 'Person', name: p.author },
        articleSection: p.category,
        keywords: p.tags.join(', '),
      })),
    },
  };

  // BreadcrumbList Schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: 'https://learn.chparenting.com' },
      { '@type': 'ListItem', position: 2, name: '部落格', item: 'https://learn.chparenting.com/blog' },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="text-center mb-10">
        <div className="text-5xl mb-3">📝</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">學習部落格</h1>
        <p className="text-slate-500">英檢日檢攻略、學習技巧、親子教養心得</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-slate-500 text-lg">文章準備中，敬請期待！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => {
            const style = getCategoryStyle(post.category);
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 no-underline"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(post.date).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-rose-500 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    {post.readingTime && (
                      <span className="text-xs text-slate-400 shrink-0">{post.readingTime} 分鐘</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link href="/"
          className="inline-block px-6 py-2.5 bg-rose-100 border border-rose-300 text-rose-500 rounded-xl font-semibold text-sm hover:bg-rose-200 transition no-underline">
          ← 回到首頁
        </Link>
      </div>
    </div>
  );
}
