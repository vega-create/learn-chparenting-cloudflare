"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import MobileHeaderBadge from "./MobileHeaderBadge";
import HeaderAuthButton from "./HeaderAuthButton";
import StreakBadge from "./StreakBadge";

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
  { icon: "🌏", label: "歷史地理", href: "/history-geo", prefix: "/history-geo" },
  { icon: "🔢", label: "數學練習", href: "/math", prefix: "/math" },
  { icon: "⌨️", label: "打字練習", href: "/typing-game", prefix: "/typing-game" },
  { icon: "🎲", label: "教育桌遊", href: "/board-games", prefix: "/board-games" },
  { icon: "🎵", label: "樂理基礎", href: "/music", prefix: "/music" },
  { icon: "💰", label: "兒童理財", href: "/finance", prefix: "/finance" },
];

const INFO_LINKS = [
  { label: "使用說明", href: "/how-to-use" },
  { label: "常見問題", href: "/faq" },
  { label: "關於我們", href: "/about" },
];

export default function Header() {
  const pathname = usePathname();
  const [geptOpen, setGeptOpen] = useState(false);
  const [jlptOpen, setJlptOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const isToolsActive = TOOLS.some(t => pathname.startsWith(t.prefix));
  const isInfoActive = INFO_LINKS.some(l => pathname === l.href);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <a href="/" className="flex items-center gap-2 no-underline shrink-0">
          <span className="text-2xl">📚</span>
          <span className="text-lg font-bold text-rose-400 hidden sm:inline">親子多元學習平台</span>
          <span className="text-lg font-bold text-rose-400 sm:hidden">親子學習</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {/* GEPT dropdown */}
          <div className="relative"
            onMouseEnter={() => setGeptOpen(true)}
            onMouseLeave={() => setGeptOpen(false)}
          >
            <button
              className={`px-3 py-2 rounded-lg font-medium transition flex items-center gap-1 bg-transparent border-0 cursor-pointer ${
                pathname.startsWith("/elementary") || pathname.startsWith("/intermediate") || pathname.startsWith("/upper-intermediate")
                  ? "text-rose-400 bg-rose-50"
                  : "text-slate-600 hover:bg-rose-50 hover:text-rose-400"
              }`}
            >
              📘 英檢 <span className="text-xs">▾</span>
            </button>
            {geptOpen && (
              <div className="absolute left-0 top-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[120px]">
                {GEPT_LEVELS.map(l => (
                  <a key={l.href} href={l.href}
                    className={`block px-4 py-2.5 text-sm font-medium no-underline transition ${
                      pathname.startsWith(l.href) ? "text-rose-400 bg-rose-50" : "text-slate-600 hover:bg-slate-50"
                    }`}>
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* JLPT dropdown */}
          <div className="relative"
            onMouseEnter={() => setJlptOpen(true)}
            onMouseLeave={() => setJlptOpen(false)}
          >
            <button
              className={`px-3 py-2 rounded-lg font-medium transition flex items-center gap-1 bg-transparent border-0 cursor-pointer ${
                pathname.startsWith("/jlpt")
                  ? "text-red-600 bg-red-50"
                  : "text-slate-600 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              🇯🇵 日文 <span className="text-xs">▾</span>
            </button>
            {jlptOpen && (
              <div className="absolute left-0 top-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[130px]">
                {JLPT_LEVELS.map(l => (
                  <a key={l.label} href={l.active ? l.href : undefined}
                    className={`block px-4 py-2.5 text-sm font-medium no-underline transition ${
                      !l.active ? "text-slate-300 cursor-default" :
                      pathname.startsWith(l.href) ? "text-red-600 bg-red-50" : "text-slate-600 hover:bg-slate-50"
                    }`}>
                    {l.label} {!l.active && <span className="text-xs">🔜</span>}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Learning Tools dropdown */}
          <div className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <button
              className={`px-3 py-2 rounded-lg font-medium transition flex items-center gap-1 bg-transparent border-0 cursor-pointer ${
                isToolsActive
                  ? "text-orange-600 bg-orange-50"
                  : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              🎯 學習工具 <span className="text-xs">▾</span>
            </button>
            {toolsOpen && (
              <div className="absolute left-0 top-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[140px]">
                {TOOLS.map(t => (
                  <a key={t.href} href={t.href}
                    className={`block px-4 py-2.5 text-sm font-medium no-underline transition ${
                      pathname.startsWith(t.prefix) ? "text-orange-600 bg-orange-50" : "text-slate-600 hover:bg-slate-50"
                    }`}>
                    {t.icon} {t.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Info dropdown */}
          <div className="relative"
            onMouseEnter={() => setInfoOpen(true)}
            onMouseLeave={() => setInfoOpen(false)}
          >
            <button
              className={`px-3 py-2 rounded-lg font-medium transition flex items-center gap-1 bg-transparent border-0 cursor-pointer ${
                isInfoActive
                  ? "text-rose-400 bg-rose-50"
                  : "text-slate-600 hover:bg-rose-50 hover:text-rose-400"
              }`}
            >
              更多 <span className="text-xs">▾</span>
            </button>
            {infoOpen && (
              <div className="absolute right-0 top-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[120px]">
                {INFO_LINKS.map(l => (
                  <a key={l.href} href={l.href}
                    className={`block px-4 py-2.5 text-sm font-medium no-underline transition ${
                      pathname === l.href ? "text-rose-400 bg-rose-50" : "text-slate-600 hover:bg-slate-50"
                    }`}>
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Streak + Auth button */}
          <StreakBadge />
          <div className="ml-1">
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
