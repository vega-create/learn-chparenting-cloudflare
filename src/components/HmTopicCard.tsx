/**
 * 歷史地理／樂理／理財 總覽用的主題卡片（改版視覺：白卡、小圖示、標籤、藍色主按鈕）。
 * 整張卡是一個連結，按鈕只是視覺提示。
 */
import Link from "next/link";
import type { ReactNode } from "react";

export default function HmTopicCard({
  href, icon, title, desc, chips = [], cta = "開始練習", badge, image, iconImage,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  desc?: string;
  chips?: string[];
  cta?: string;
  badge?: string; // 卡片左上的小標（例如「觀念」「工具」）
  image?: string;     // 卡片上方的大圖（照片或樂譜插圖）
  iconImage?: string; // 取代 emoji 的圖示圖片
}) {
  return (
    <Link href={href}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200 p-5 no-underline hover:shadow-md hover:border-slate-300 transition-shadow overflow-hidden">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" loading="lazy" className="-mx-5 -mt-5 mb-4 w-[calc(100%+2.5rem)] max-w-none aspect-[16/9] object-cover bg-slate-50" />
      )}
      {badge && (
        <span className="self-start mb-3 px-2.5 py-0.5 rounded-full bg-[#FDECF1] text-[#C2416A] text-xs font-bold">{badge}</span>
      )}
      <div className="flex items-start gap-3 mb-3">
        {iconImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={iconImage} alt="" className="w-16 h-16 shrink-0 rounded-xl object-contain" />
        ) : !image ? (
          <span className="w-12 h-12 shrink-0 rounded-xl bg-slate-50 flex items-center justify-center text-2xl" aria-hidden="true">{icon}</span>
        ) : null}
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-[#263238] m-0 leading-snug">{title}</h3>
          {desc && <p className="text-sm text-[#52616B] mt-1 mb-0 leading-relaxed">{desc}</p>}
        </div>
      </div>
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {chips.map((c) => (
            <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600">{c}</span>
          ))}
        </div>
      )}
      <span className="mt-auto block text-center py-2.5 rounded-xl bg-[#2457A7] text-white text-sm font-bold group-hover:bg-[#1d4688]">
        {cta} →
      </span>
    </Link>
  );
}

/** 頁面底部「關於這個練習」說明區塊（放原本的學習方式／SEO 說明文字）。 */
export function HmAboutBox({ title = "關於這個練習", children }: { title?: string; children: ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 mt-10">
      <h2 className="text-lg font-bold text-[#263238] border-l-4 border-[#E65E83] pl-3 mb-3">{title}</h2>
      <div className="text-sm text-[#52616B] leading-relaxed">{children}</div>
    </section>
  );
}
