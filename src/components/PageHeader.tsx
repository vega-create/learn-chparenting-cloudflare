/**
 * 內頁共用的頁首區塊（改版視覺：象牙底、左邊圖示＋標題＋說明、右邊插圖）。
 * 插圖放在 public/images/pages/<name>.webp，可不給。
 */
import type { ReactNode } from "react";

export default function PageHeader({
  eyebrow, title, desc, icon, iconBg = "bg-[#E65E83]", image, children,
}: {
  eyebrow?: string;
  title: string;
  desc?: ReactNode;
  icon?: ReactNode;      // 建議用 <SubjectIcon> 或 emoji
  iconBg?: string;       // 圖示底色（Tailwind class）
  image?: string;        // 右側插圖路徑
  children?: ReactNode;  // 標題下方的按鈕、篩選等
}) {
  return (
    <section className="max-w-6xl mx-auto px-4 pt-6 pb-6 md:pt-8 md:pb-8">
      <div className="flex items-center gap-6">
        <div className="flex-1 min-w-0">
          {eyebrow && <div className="text-sm font-bold text-[#E65E83] mb-1">{eyebrow}</div>}
          <div className="flex items-center gap-4">
            {icon && (
              <span className={`hidden sm:flex w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl ${iconBg} text-white items-center justify-center text-3xl md:text-4xl`} aria-hidden="true">
                {icon}
              </span>
            )}
            <div className="min-w-0">
              <h1 className="text-[26px] md:text-4xl font-black text-[#263238] leading-tight m-0">{title}</h1>
              {desc && <p className="mt-2 mb-0 text-[15px] md:text-lg text-[#52616B] leading-relaxed">{desc}</p>}
            </div>
          </div>
          {children && <div className="mt-5">{children}</div>}
        </div>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="hidden md:block w-64 lg:w-80 aspect-[3/2] object-cover rounded-2xl shrink-0" />
        )}
      </div>
    </section>
  );
}

/** 內頁區段標題：左側粉紅色條，與首頁一致。 */
export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-4">
      <h2 className="text-xl md:text-2xl font-bold text-[#263238] border-l-4 border-[#E65E83] pl-3 m-0">{children}</h2>
      {action}
    </div>
  );
}
