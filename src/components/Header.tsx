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

export default function Header() {
  const pathname = usePathname();
  const [geptOpen, setGeptOpen] = useState(false);
  const [jlptOpen, setJlptOpen] = useState(false);

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
              全民英檢 <span className="text-xs">▾</span>
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
              日文檢定 <span className="text-xs">▾</span>
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

          {/* Chinese Language */}
          <a href="/chinese-lang" className={`px-3 py-2 rounded-lg font-medium transition no-underline ${
            pathname.startsWith("/chinese-lang") ? "text-orange-600 bg-orange-50" : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
          }`}>📝 國語</a>

          {/* History & Geography */}
          <a href="/history-geo" className={`px-3 py-2 rounded-lg font-medium transition no-underline ${
            pathname.startsWith("/history-geo") ? "text-emerald-600 bg-emerald-50" : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
          }`}>🌏 歷史</a>

          {/* Typing game */}
          <a href="/typing-game" className={`px-3 py-2 rounded-lg font-medium transition no-underline ${
            pathname === "/typing-game" ? "text-cyan-600 bg-cyan-50" : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-600"
          }`}>打字練習</a>

          {/* Board games */}
          <a href="/board-games" className={`px-3 py-2 rounded-lg font-medium transition no-underline ${
            pathname.startsWith("/board-games") ? "text-orange-600 bg-orange-50" : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
          }`}>🎲 桌遊</a>

          {/* Math */}
          <a href="/math" className={`px-3 py-2 rounded-lg font-medium transition no-underline ${
            pathname.startsWith("/math") ? "text-amber-600 bg-amber-50" : "text-slate-600 hover:bg-amber-50 hover:text-amber-600"
          }`}>🔢 數學</a>

          {/* Finance */}
          <a href="/finance" className={`px-3 py-2 rounded-lg font-medium transition no-underline ${
            pathname.startsWith("/finance") ? "text-purple-600 bg-purple-50" : "text-slate-600 hover:bg-purple-50 hover:text-purple-600"
          }`}>💰 理財</a>

          <a href="/how-to-use" className={`px-3 py-2 rounded-lg font-medium transition no-underline ${
            pathname === "/how-to-use" ? "text-rose-400 bg-rose-50" : "text-slate-600 hover:bg-rose-50 hover:text-rose-400"
          }`}>使用說明</a>
          <a href="/faq" className={`px-3 py-2 rounded-lg font-medium transition no-underline ${
            pathname === "/faq" ? "text-rose-400 bg-rose-50" : "text-slate-600 hover:bg-rose-50 hover:text-rose-400"
          }`}>常見問題</a>
          <a href="/about" className={`px-3 py-2 rounded-lg font-medium transition no-underline ${
            pathname === "/about" ? "text-rose-400 bg-rose-50" : "text-slate-600 hover:bg-rose-50 hover:text-rose-400"
          }`}>關於</a>

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
