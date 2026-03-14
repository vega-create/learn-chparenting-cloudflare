import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllSlugs, getPostWithHtml, getAllPosts } from '@/lib/blog';

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
    title: `${post.title} | 學習部落格`,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: `https://learn.chparenting.com/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://learn.chparenting.com/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '英檢攻略': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  '日檢攻略': { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  '親子教養': { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  '學習技巧': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostWithHtml(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const related = allPosts
    .filter(p => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  const style = CATEGORY_COLORS[post.category] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'Mommy Wisdom International' },
    url: `https://learn.chparenting.com/blog/${slug}`,
    keywords: post.tags.join(', '),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400 mb-8">
        <Link href="/" className="hover:text-slate-600 no-underline">首頁</Link>
        <span className="mx-2">›</span>
        <Link href="/blog" className="hover:text-slate-600 no-underline">部落格</Link>
        <span className="mx-2">›</span>
        <span className="text-slate-600">{post.title}</span>
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

      {/* Article Content */}
      <article
        className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-p:leading-7 prose-p:text-slate-600 prose-li:text-slate-600 prose-a:text-rose-500 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-800 prose-blockquote:border-rose-300 prose-blockquote:bg-rose-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
        dangerouslySetInnerHTML={{ __html: post.htmlContent || '' }}
      />

      {/* Related Posts */}
      {related.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">相關文章</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map(r => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all no-underline"
              >
                <h3 className="text-sm font-bold text-slate-800 mb-1 line-clamp-2">{r.title}</h3>
                <p className="text-xs text-slate-400">
                  {new Date(r.date).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </Link>
            ))}
          </div>
        </div>
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
