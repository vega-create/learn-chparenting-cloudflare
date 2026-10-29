import Link from "next/link";
import type { ReactNode } from "react";

/**
 * 英檢／日檢單元頁的頁首（改版視覺）：淡粉底卡片、科目＋級別標籤、Unit 標題，右側放練習單與家長指南。
 * 只負責版面，下載／答案按鈕由呼叫端傳入，行為不變。
 */
export function LangUnitHeader({
  subject, level, levelHref, unitNo, title, subtitle, icon, guideHref, actions,
}: {
  subject: string;
  level: string;
  levelHref: string;
  unitNo: number;
  title: string;
  subtitle?: string;
  icon?: string;
  guideHref?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="max-w-5xl mx-auto px-3 md:px-4 pt-4 md:pt-6">
      <section className="rounded-2xl border border-[#F6C9D6] bg-[#FDF3F6] p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Link href={levelHref} aria-label={`回到${level}單元列表`}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[#263238] flex items-center justify-center no-underline hover:border-[#2457A7] shrink-0">←</Link>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FDECF1] text-[#C2416A]">{subject}</span>
          <Link href={levelHref} className="text-sm font-bold text-[#C2416A] no-underline hover:underline">{level}</Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-black text-[#263238] leading-tight m-0">
              <span className="mr-2">Unit {unitNo}</span>{title}
              {icon && <span className="ml-2 text-2xl md:text-3xl align-middle" aria-hidden="true">{icon}</span>}
            </h1>
            {subtitle && <p className="mt-1 mb-0 text-[#52616B]" lang="ja">{subtitle}</p>}
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            {actions}
            {guideHref && (
              <Link href={guideHref}
                className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-[#2457A7] text-[#2457A7] bg-white font-bold text-sm no-underline hover:bg-[#EEF3FB] transition">
                家長指南
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
