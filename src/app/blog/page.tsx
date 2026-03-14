import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getAllCategories } from '@/lib/blog';
import BlogCategoryFilter from '@/components/BlogCategoryFilter';

export const metadata: Metadata = {
  title: '學習部落格 | 英檢日檢攻略・打字練習・親子教養 | 親子多元學習平台',
  description: '全民英檢GEPT準備攻略、JLPT日文檢定學習技巧、兒童打字練習、兒童理財教育、親子教養心得分享。提供系統化的學習方法、考試準備建議與免費學習資源。',
  keywords: ['全民英檢', 'GEPT', 'JLPT', '日文檢定', '親子教養', '學習技巧', '兒童打字練習', '兒童理財', '親子學習'],
  alternates: { canonical: 'https://learn.chparenting.com/blog' },
  openGraph: {
    title: '學習部落格 | 英檢日檢攻略・打字練習・親子教養',
    description: '全民英檢GEPT準備攻略、JLPT日文檢定學習技巧、兒童打字練習、親子教養心得分享',
    url: 'https://learn.chparenting.com/blog',
    siteName: '親子多元學習平台',
    type: 'website',
    locale: 'zh_TW',
  },
  twitter: { card: 'summary_large_image', title: '學習部落格 | 親子多元學習平台', description: '英檢日檢攻略、打字練習、兒童理財、親子教養心得' },
  robots: { index: true, follow: true },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '學習部落格',
    description: '英檢日檢攻略、打字練習、兒童理財、親子教養心得分享',
    url: 'https://learn.chparenting.com/blog',
    isPartOf: { '@type': 'WebSite', name: '親子多元學習平台', url: 'https://learn.chparenting.com' },
    mainEntity: {
      '@type': 'Blog',
      name: '學習部落格',
      url: 'https://learn.chparenting.com/blog',
      publisher: { '@type': 'Organization', name: 'Mommy Wisdom International', url: 'https://learn.chparenting.com' },
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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: 'https://learn.chparenting.com' },
      { '@type': 'ListItem', position: 2, name: '部落格', item: 'https://learn.chparenting.com/blog' },
    ],
  };

  const serializedPosts = posts.map(p => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    category: p.category,
    tags: p.tags,
    readingTime: p.readingTime,
    author: p.author,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="text-center mb-8">
        <div className="text-5xl mb-3">📝</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">學習部落格</h1>
        <p className="text-slate-500">英檢日檢攻略、打字練習、兒童理財、親子教養心得</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-slate-500 text-lg">文章準備中，敬請期待！</p>
        </div>
      ) : (
        <BlogCategoryFilter posts={serializedPosts} categories={categories} />
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
