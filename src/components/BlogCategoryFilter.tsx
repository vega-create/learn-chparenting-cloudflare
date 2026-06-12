"use client";
import { useState } from "react";
import Link from "next/link";

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

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '英檢攻略': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  '日檢攻略': { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  '親子教養': { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  '學習技巧': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  '學習工具': { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
  '語言學習': { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
  '親子教育': { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
}

export default function BlogCategoryFilter({ posts, categories }: { posts: Post[]; categories: string[] }) {
  const [active, setActive] = useState("全部");

  const filtered = active === "全部" ? posts : posts.filter(p => p.category === active);

  return (
    <>
      {/* Category filter pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setActive("全部")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition cursor-pointer ${
            active === "全部"
              ? "bg-rose-500 text-white border-rose-500"
              : "bg-white text-slate-500 border-slate-200 hover:border-rose-300 hover:text-rose-500"
          }`}
        >
          全部 ({posts.length})
        </button>
        {categories.map(cat => {
          const count = posts.filter(p => p.category === cat).length;
          const style = getCategoryStyle(cat);
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition cursor-pointer ${
                active === cat
                  ? `${style.bg} ${style.text} ${style.border}`
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Posts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(post => {
          const style = getCategoryStyle(post.category);
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 no-underline"
            >
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  width={1200}
                  height={630}
                  loading="lazy"
                  className="w-full aspect-[1200/630] object-cover"
                />
              )}
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
    </>
  );
}
