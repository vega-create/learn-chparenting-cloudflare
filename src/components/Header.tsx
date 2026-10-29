"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import MobileHeaderBadge from "./MobileHeaderBadge";
import HeaderAuthButton from "./HeaderAuthButton";
import StreakBadge from "./StreakBadge";
import { BrandMark } from "./SubjectIcon";

const GEPT_LEVELS = [
  { label: "初級", href: "/elementary" },
  { label: "中級", href: "/intermediate" },
  { label: "中高級", href: "/upper-intermediate" },
];

const JLPT_LEVELS = [
  { label: "N5（入門）", href: "/jlpt-n5", active: true },
  { label: "N4（基礎）", href: "/jlpt-n4", active: true },
  { label: "N3（中級）", href: "/jlpt-n3", active: true },
  { label: "N2（上級）", href: "/jlpt-n2", active: true },
  { label: "N1（最上級）", href: "/jlpt-n1", active: true },
];

const TOOLS = [
  { icon: "📝", label: "國語學習", href: "/chinese-lang", prefix: "/chinese-lang" },
  { icon: "🏮", label: "成語練習", href: "/chinese-lang/idiom-practice", prefix: "/chinese-lang/idiom-practice" },
  { icon: "🌏", label: "歷史地理", href: "/history-geo", prefix: "/history-geo" },
  { icon: "🔢", label: "數學練習", href: "/math", prefix: "/math" },
  { icon: "✖️", label: "九九乘法練習", href: "/math/times-table", prefix: "/math/times-table" },
  { icon: "⌨️", label: "打字練習", href: "/typing-game", prefix: "/typing-game" },
  { icon: "🖐️", label: "鍵盤位置練習", href: "/typing-game/keyboard", prefix: "/typing-game/keyboard" },
  { icon: "🎲", label: "教育遊戲", href: "/board-games", prefix: "/board-games" },
  { icon: "🎵", label: "樂理基礎", href: "/music", prefix: "/music" },
  { icon: "💰", label: "兒童理財", href: "/finance", prefix: "/finance" },
];

// 學習文章、指南、我的學習直接放在選單上（寬螢幕），其餘收進「更多」
const MAIN_LINKS = [
  { label: "學習文章", href: "/blog" },
  { label: "自學與陪伴指南", href: "/parent-guide" },
  { label: "我的學習", href: "/achievements" },
];

const INFO_LINKS = [
  ...MAIN_LINKS.map(l => ({ ...l, narrowOnly: true })),
  { label: "使用說明", href: "/how-to-use" },
  { label: "常見問題", href: "/faq" },
  { label: "全部公告", href: "/updates" },
  { label: "報考資訊", href: "/exam-info" },
  { label: "關於我們", href: "/about" },
];

const navItem = (active: boolean) =>
  `px-3 py-2 rounded-lg font-medium transition no-underline bg-transparent border-0 cursor-pointer ${
    active ? "text-[#E65E83]" : "text-[#263238] hover:text-[#E65E83]"
  }`;

export default function Header() {
  const pathname = usePathname();
  const [allOpen, setAllOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  // 同時符合「數學練習」和「九九乘法練習」時，只標示比較精確的那一個
  const activeTool = TOOLS.filter(t => pathname.startsWith(t.prefix)).sort((a, b) => b.prefix.length - a.prefix.length)[0];
  const isLearnActive = !!activeTool || pathname.startsWith("/jlpt") ||
    ["/elementary", "/intermediate", "/upper-intermediate"].some(p => pathname.startsWith(p));
  const isInfoActive = INFO_LINKS.some(l => pathname === l.href);

  return (
    <header className="google-anno-skip bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="/" className="flex items-center gap-2.5 no-underline shrink-0">
          <BrandMark />
          <span className="leading-tight">
            <span className="hidden lg:block text-lg font-bold text-[#E65E83]">親子多元學習平台</span>
            <span className="block text-lg font-bold text-[#E65E83] lg:hidden">親子學習</span>
            <span className="hidden lg:block text-[11px] text-slate-500 tracking-wide">learn.chparenting.com</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 text-[15px] whitespace-nowrap">
          {/* 全部學習：英檢、日文、各科工具都在這裡 */}
          <div className="relative" onMouseEnter={() => setAllOpen(true)} onMouseLeave={() => setAllOpen(false)}>
            <button type="button" onClick={() => setAllOpen(o => !o)} aria-expanded={allOpen}
              className={`${navItem(isLearnActive)} flex items-center gap-1`}>
              全部學習 <span className="text-xs">▾</span>
            </button>
            {allOpen && (
              <div className="absolute left-0 top-full pt-1 z-50">
                <div className="grid grid-cols-3 gap-6 p-5 bg-white border border-slate-200 rounded-2xl shadow-lg w-[560px]">
                  <div>
                    <div className="text-xs font-bold text-slate-500 mb-2">全民英檢</div>
                    {GEPT_LEVELS.map(l => (
                      <a key={l.href} href={l.href}
                        className={`block py-1.5 text-sm no-underline ${pathname.startsWith(l.href) ? "text-[#E65E83] font-bold" : "text-[#263238] hover:text-[#E65E83]"}`}>
                        英檢{l.label}
                      </a>
                    ))}
                    <div className="text-xs font-bold text-slate-500 mt-4 mb-2">日文檢定</div>
                    {JLPT_LEVELS.map(l => (
                      <a key={l.label} href={l.href}
                        className={`block py-1.5 text-sm no-underline ${pathname.startsWith(l.href) ? "text-[#E65E83] font-bold" : "text-[#263238] hover:text-[#E65E83]"}`}>
                        {l.label}
                      </a>
                    ))}
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs font-bold text-slate-500 mb-2">各科練習與工具</div>
                    <div className="grid grid-cols-2 gap-x-4">
                      {TOOLS.map(t => (
                        <a key={t.href} href={t.href}
                          className={`block py-1.5 text-sm no-underline ${activeTool?.href === t.href ? "text-[#E65E83] font-bold" : "text-[#263238] hover:text-[#E65E83]"}`}>
                          {t.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {MAIN_LINKS.map(l => (
            <a key={l.href} href={l.href} className={`hidden lg:inline-block ${navItem(pathname.startsWith(l.href))}`}>
              {l.label}
            </a>
          ))}

          <div className="relative" onMouseEnter={() => setInfoOpen(true)} onMouseLeave={() => setInfoOpen(false)}>
            <button type="button" onClick={() => setInfoOpen(o => !o)} aria-expanded={infoOpen}
              className={`${navItem(isInfoActive)} flex items-center gap-1`}>
              更多 <span className="text-xs">▾</span>
            </button>
            {infoOpen && (
              <div className="absolute right-0 top-full pt-1 z-50">
                <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden min-w-[140px]">
                  {INFO_LINKS.map(l => (
                    <a key={l.href} href={l.href}
                      className={`${"narrowOnly" in l ? "lg:hidden " : ""}block px-4 py-2.5 text-sm no-underline ${
                        pathname === l.href ? "text-[#E65E83] bg-rose-50" : "text-[#263238] hover:bg-slate-50"
                      }`}>
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <StreakBadge />
          <div className="ml-2">
            <HeaderAuthButton />
          </div>
        </nav>

        {/* Mobile: badge + auth */}
        <div className="md:hidden flex items-center gap-2">
          <MobileHeaderBadge />
          <HeaderAuthButton />
        </div>
      </div>
    </header>
  );
}
