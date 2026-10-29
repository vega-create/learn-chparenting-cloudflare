/**
 * 數學、國語頁面共用的小元件（改版視覺）：
 * - TopicCard：分類頁的主題卡（圖示＋標題＋範圍＋「開始練習」按鈕），整張可點。
 * - PracticeHeader：練習內頁的精簡頁首（回上一層＋圖示＋標題），寬度跟著內容走。
 * 只負責排版，不碰任何練習邏輯。
 */
import Link from "next/link";
import type { ReactNode } from "react";

export function TopicCard({
  href, icon, title, meta, desc, chips = [], cta = "開始練習", filled = false,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  meta?: string;          // 年級等小字
  desc?: string;          // 範圍說明
  chips?: string[];
  cta?: string;
  filled?: boolean;       // 按鈕用實心藍（國語）或外框藍（數學）
}) {
  return (
    <Link href={href}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200 p-4 no-underline hover:shadow-md hover:border-slate-300 transition">
      <div className="flex items-start gap-3 mb-3">
        <span className="w-12 h-12 shrink-0 rounded-xl bg-[#FDECF1] text-[#C2416A] flex items-center justify-center text-2xl font-bold" aria-hidden="true">
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-[#263238] m-0 leading-snug">{title}</h3>
          {meta && <div className="text-xs text-[#52616B] mt-0.5">{meta}</div>}
        </div>
      </div>
      {desc && <p className="text-sm text-[#52616B] leading-relaxed m-0 mb-3 flex-1">{desc}</p>}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {chips.map((c) => (
            <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-[#FDECF1] text-[#C2416A]">{c}</span>
          ))}
        </div>
      )}
      <span className={`mt-auto block text-center py-2 rounded-xl text-sm font-bold transition ${
        filled
          ? "bg-[#2457A7] text-white group-hover:bg-[#1d4688]"
          : "border border-[#2457A7] text-[#2457A7] bg-white group-hover:bg-[#EEF3FB]"
      }`}>
        {cta} →
      </span>
    </Link>
  );
}

export function PracticeHeader({
  backHref, backLabel, eyebrow, title, desc, icon,
}: {
  backHref: string;
  backLabel: string;
  eyebrow?: string;
  title: string;
  desc?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="mb-6">
      <Link href={backHref} className="inline-block text-sm text-[#2457A7] hover:underline no-underline mb-4">
        ← {backLabel}
      </Link>
      <div className="flex items-center gap-4">
        {icon && (
          <span className="w-14 h-14 shrink-0 rounded-2xl bg-[#E65E83] text-white flex items-center justify-center text-2xl font-bold" aria-hidden="true">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          {eyebrow && <div className="text-sm font-bold text-[#E65E83]">{eyebrow}</div>}
          <h1 className="text-2xl md:text-3xl font-black text-[#263238] leading-tight m-0">{title}</h1>
          {desc && <p className="text-sm md:text-base text-[#52616B] mt-1 mb-0">{desc}</p>}
        </div>
      </div>
    </div>
  );
}

/** 練習內頁的分頁切換（觀念／練習／挑戰…）樣式 */
export function tabClass(active: boolean) {
  return `flex-1 sm:flex-none px-5 py-2 rounded-xl font-bold text-sm border cursor-pointer transition ${
    active ? "bg-[#2457A7] border-[#2457A7] text-white" : "bg-white border-slate-200 text-[#52616B] hover:bg-slate-50"
  }`;
}
