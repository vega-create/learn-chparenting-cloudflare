/**
 * 英檢／日檢等級頁的單元卡（改版視覺）：左邊主題照片、右邊 Unit 編號＋標題＋題數。
 * 整張卡是連結；照片沒有對到時改顯示原本的 emoji。
 */
import Link from "next/link";

export default function UnitPhotoCard({
  href, unitLabel, title, subtitle, meta, image, icon, color = "#E65E83",
}: {
  href: string;
  unitLabel: string;
  title: string;
  subtitle?: string;
  meta?: string;
  image?: string;
  icon?: string;
  color?: string;
}) {
  return (
    <Link href={href}
      className="group flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-200 no-underline hover:shadow-md hover:border-slate-300 transition">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" loading="lazy" className="w-28 h-20 sm:w-32 sm:h-24 shrink-0 rounded-xl object-cover bg-slate-50" />
      ) : (
        <span className="w-28 h-20 sm:w-32 sm:h-24 shrink-0 rounded-xl bg-slate-50 flex items-center justify-center text-4xl" aria-hidden="true">{icon}</span>
      )}
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-bold" style={{ color }}>{unitLabel}</span>
        <span className="block text-lg font-bold text-[#263238] leading-snug">{title}</span>
        {subtitle && <span className="block text-xs text-[#52616B] mt-0.5" lang="ja">{subtitle}</span>}
        {meta && <span className="block text-xs text-slate-500 mt-1">{meta}</span>}
      </span>
      <span className="text-slate-300 text-xl pr-1 group-hover:text-[#2457A7]" aria-hidden="true">›</span>
    </Link>
  );
}
