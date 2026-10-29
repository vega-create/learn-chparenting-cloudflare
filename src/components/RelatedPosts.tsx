/**
 * 科目頁底部「相關學習文章」：依 slug 挑既有文章，顯示封面＋標題＋摘要。
 * 只列真的存在的文章，找不到就不顯示整區。
 */
import Link from "next/link";
import { getPostBySlug } from "@/lib/blog";
import { SectionTitle } from "./PageHeader";

export default function RelatedPosts({ slugs, title = "相關學習文章" }: { slugs: string[]; title?: string }) {
  const posts = slugs.map((s) => getPostBySlug(s)).filter((p) => p !== null);
  if (posts.length === 0) return null;
  return (
    <section className="mt-10">
      <SectionTitle
        action={<Link href="/blog" className="text-sm font-bold text-[#2457A7] no-underline hover:underline shrink-0">查看更多文章 →</Link>}
      >
        {title}
      </SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`}
            className="flex gap-3 bg-white rounded-2xl border border-slate-200 p-3 no-underline hover:shadow-md transition-shadow">
            {p.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image} alt="" loading="lazy" className="w-28 h-24 shrink-0 rounded-xl object-cover bg-slate-50" />
            )}
            <div className="min-w-0 flex flex-col">
              <h3 className="text-[15px] font-bold text-[#263238] leading-snug m-0 line-clamp-2">{p.title}</h3>
              <p className="text-xs text-[#52616B] mt-1 mb-0 line-clamp-2">{p.description}</p>
              <span className="mt-auto pt-1 self-start text-xs px-2 py-0.5 rounded-full bg-[#FDECF1] text-[#C2416A] font-semibold">{p.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
