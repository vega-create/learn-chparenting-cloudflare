import { Metadata } from 'next';
import PageHeader from "@/components/PageHeader";
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
        ...(p.image ? { image: `https://learn.chparenting.com${p.image}` } : {}),
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
    image: p.image,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4 pb-14 md:pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <PageHeader bare eyebrow="學習文章" title="一起學，也讓自己更有方向" image="/images/banners/blog.webp"
        desc="英檢、日檢的準備攻略，國語、數學、打字的練習方法，還有陪孩子學習的心得——給想自學的大人，也給陪著孩子一起學的家長。" />

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border border-slate-200 rounded-2xl">
          <p className="text-[#52616B] text-lg m-0">文章準備中，敬請期待！</p>
        </div>
      ) : (
        <BlogCategoryFilter posts={serializedPosts} categories={categories} />
      )}

      <div className="mt-10">
        <Link href="/" className="text-sm font-semibold text-[#2457A7] no-underline hover:underline">
          ← 返回首頁
        </Link>
      </div>
    </div>
  );
}
