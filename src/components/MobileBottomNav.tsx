"use client";
import { usePathname } from "next/navigation";


const GEPT_PREFIXES = ["/elementary", "/intermediate", "/upper-intermediate"];
const JLPT_PREFIXES = ["/jlpt-n5", "/jlpt-n4", "/jlpt-n3", "/jlpt-n2", "/jlpt-n1"];
const BOARD_GAME_PREFIX = "/board-games";
const CHINESE_LANG_PREFIX = "/chinese-lang";
const MATH_PREFIX = "/math";
const HISTORY_GEO_PREFIX = "/history-geo";
const MUSIC_PREFIX = "/music";
const FINANCE_PREFIX = "/finance";
const DASHBOARD_PREFIX = "/dashboard";

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Check if we're in a GEPT level section
  const isGeptSection = GEPT_PREFIXES.some(p => pathname.startsWith(p));
  const isJlptSection = JLPT_PREFIXES.some(p => pathname.startsWith(p));
  const isBoardGameSection = pathname.startsWith(BOARD_GAME_PREFIX);
  const isChineseLangSection = pathname.startsWith(CHINESE_LANG_PREFIX);
  const isHistoryGeoSection = pathname.startsWith(HISTORY_GEO_PREFIX);
  const isMusicSection = pathname.startsWith(MUSIC_PREFIX);
  const isMathSection = pathname.startsWith(MATH_PREFIX);
  const isFinanceSection = pathname.startsWith(FINANCE_PREFIX);
  const isDashboardSection = pathname.startsWith(DASHBOARD_PREFIX);

  if (isDashboardSection) {
    return <DashboardNav pathname={pathname} />;
  }

  if (isGeptSection) {
    return <GeptNav pathname={pathname} />;
  }

  if (isJlptSection) {
    return <JlptNav pathname={pathname} />;
  }

  if (isBoardGameSection) {
    return <BoardGameNav pathname={pathname} />;
  }

  if (isChineseLangSection) {
    return <ChineseLangNav pathname={pathname} />;
  }

  if (isHistoryGeoSection) {
    return <HistoryGeoNav pathname={pathname} />;
  }

  if (isMusicSection) {
    return <MusicNav pathname={pathname} />;
  }

  if (isMathSection) {
    return <MathNav pathname={pathname} />;
  }

  if (isFinanceSection) {
    return <FinanceNav pathname={pathname} />;
  }

  return <PlatformNav pathname={pathname} />;
}

function PlatformNav({ pathname }: { pathname: string }) {
  const items = [
    { href: "/", icon: "🏠", label: "首頁", match: pathname === "/" },
    { href: "/elementary", icon: "📘", label: "英檢", match: false },
    { href: "/jlpt-n5", icon: "🇯🇵", label: "日文", match: false },
    { href: "/chinese-lang", icon: "📝", label: "國語", match: false },
    { href: "/math", icon: "🔢", label: "數學", match: false },
    { href: "/history-geo", icon: "🌏", label: "歷史", match: false },
    { href: "/music", icon: "🎵", label: "樂理", match: false },
    { href: "/board-games", icon: "🎲", label: "桌遊", match: false },
    { href: "/typing-game", icon: "⌨️", label: "打字", match: false },
    { href: "/finance", icon: "💰", label: "理財", match: false },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex items-center h-14 overflow-x-auto px-1">
        {items.map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 no-underline py-1 px-2.5 shrink-0 transition ${
              item.match ? "text-rose-400" : "text-slate-400 hover:text-rose-400"
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function MusicNav({ pathname }: { pathname: string }) {
  const items = [
    { href: "/", icon: "🏠", label: "首頁", match: false },
    { href: "/music", icon: "🎵", label: "樂理", match: pathname === "/music" },
    { href: "/music/intro", icon: "🎵", label: "入門", match: pathname.includes("/intro") },
    { href: "/music/basic", icon: "🎹", label: "基礎", match: pathname.includes("/basic") },
    { href: "/music/advanced", icon: "🎼", label: "進階", match: pathname.includes("/advanced") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex justify-around items-center h-14">
        {items.map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${
              item.match ? "text-pink-600" : "text-slate-400 hover:text-pink-600"
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function HistoryGeoNav({ pathname }: { pathname: string }) {
  const items = [
    { href: "/", icon: "🏠", label: "首頁", match: false },
    { href: "/history-geo", icon: "🌏", label: "歷史地理", match: pathname === "/history-geo" },
    { href: "/history-geo/taiwan", icon: "🇹🇼", label: "台灣", match: pathname.includes("/taiwan") },
    { href: "/history-geo/asia", icon: "🌏", label: "亞洲", match: pathname.includes("/asia") },
    { href: "/history-geo/world", icon: "🌍", label: "世界", match: pathname.includes("/world") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex justify-around items-center h-14">
        {items.map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${
              item.match ? "text-emerald-600" : "text-slate-400 hover:text-emerald-600"
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function ChineseLangNav({ pathname }: { pathname: string }) {
  const items = [
    { href: "/", icon: "🏠", label: "首頁", match: false },
    { href: "/chinese-lang", icon: "📝", label: "國語", match: pathname === "/chinese-lang" },
    { href: "/chinese-lang/lower", icon: "🌱", label: "低年級", match: pathname.includes("/lower") },
    { href: "/chinese-lang/middle", icon: "📖", label: "中年級", match: pathname.includes("/middle") },
    { href: "/chinese-lang/high", icon: "🚀", label: "高年級", match: pathname.includes("/high") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex justify-around items-center h-14">
        {items.map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${
              item.match ? "text-orange-500" : "text-slate-400 hover:text-orange-500"
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function JlptNav({ pathname }: { pathname: string }) {
  let base = "/jlpt-n5";
  if (pathname.startsWith("/jlpt-n4")) base = "/jlpt-n4";
  else if (pathname.startsWith("/jlpt-n3")) base = "/jlpt-n3";
  else if (pathname.startsWith("/jlpt-n2")) base = "/jlpt-n2";
  else if (pathname.startsWith("/jlpt-n1")) base = "/jlpt-n1";

  const items = [
    { href: "/", icon: "🏠", label: "首頁", match: false },
    { href: base, icon: "📖", label: "學習", match: pathname === base },
    { href: `${base}/speaking`, icon: "🎙️", label: "口說", match: pathname.includes("/speaking") },
    { href: `${base}/game`, icon: "🎮", label: "遊戲", match: pathname.includes("/game") },
    { href: `${base}/mock-test`, icon: "📝", label: "測驗", match: pathname.includes("/mock-test") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex justify-around items-center h-14">
        {items.map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${
              item.match ? "text-red-500" : "text-slate-400 hover:text-red-500"
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function BoardGameNav({ pathname }: { pathname: string }) {
  const items = [
    { href: "/", icon: "🏠", label: "首頁", match: false },
    { href: "/board-games", icon: "🎲", label: "桌遊", match: pathname === "/board-games" },
    { href: "/board-games/memory-match", icon: "🧠", label: "記憶", match: pathname.includes("/memory") },
    { href: "/board-games/code-path", icon: "💻", label: "程式", match: pathname.includes("/code-path") || pathname.includes("/logic-gates") || pathname.includes("/loop-builder") },
    { href: "/board-games/pattern-master", icon: "🧩", label: "邏輯", match: pathname.includes("/pattern") || pathname.includes("/sudoku") || pathname.includes("/sequence") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex justify-around items-center h-14">
        {items.map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${
              item.match ? "text-orange-500" : "text-slate-400 hover:text-orange-500"
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function MathNav({ pathname }: { pathname: string }) {
  const items = [
    { href: "/", icon: "🏠", label: "首頁", match: false },
    { href: "/math", icon: "🔢", label: "數學", match: pathname === "/math" },
    { href: "/math/basic-arithmetic", icon: "➕", label: "運算", match: pathname.includes("/basic-arithmetic") },
    { href: "/math/geometry", icon: "📐", label: "幾何", match: pathname.includes("/geometry") },
    { href: "/math/word-problems", icon: "📖", label: "應用", match: pathname.includes("/word-problems") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex justify-around items-center h-14">
        {items.map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${
              item.match ? "text-amber-600" : "text-slate-400 hover:text-amber-600"
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function FinanceNav({ pathname }: { pathname: string }) {
  const items = [
    { href: "/", icon: "🏠", label: "首頁", match: false },
    { href: "/finance", icon: "💰", label: "理財", match: pathname === "/finance" },
    { href: "/finance/money-basics", icon: "📖", label: "觀念", match: pathname.includes("/money-basics") },
    { href: "/finance/savings-calculator", icon: "🏦", label: "儲蓄", match: pathname.includes("/savings") || pathname.includes("/red-envelope") },
    { href: "/finance/allowance-budget", icon: "📊", label: "預算", match: pathname.includes("/allowance") || pathname.includes("/expense") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex justify-around items-center h-14">
        {items.map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${
              item.match ? "text-purple-600" : "text-slate-400 hover:text-purple-600"
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function DashboardNav({ pathname }: { pathname: string }) {
  const items = [
    { href: "/", icon: "🏠", label: "首頁", match: false },
    { href: "/dashboard", icon: "📊", label: "總覽", match: pathname === "/dashboard" },
    { href: "/dashboard/schedule", icon: "📋", label: "計畫", match: pathname.includes("/schedule") },
    { href: "/dashboard/records", icon: "📈", label: "紀錄", match: pathname.includes("/records") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex justify-around items-center h-14">
        {items.map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${
              item.match ? "text-rose-400" : "text-slate-400 hover:text-rose-400"
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function GeptNav({ pathname }: { pathname: string }) {
  // Determine current level base path
  let base = "/elementary";
  if (pathname.startsWith("/upper-intermediate")) base = "/upper-intermediate";
  else if (pathname.startsWith("/intermediate")) base = "/intermediate";

  const items = [
    { href: "/", icon: "🏠", label: "首頁", match: false },
    { href: base, icon: "📖", label: "學習", match: pathname === base },
    { href: `${base}/speaking`, icon: "🎙️", label: "口說", match: pathname.includes("/speaking") },
    { href: `${base}/game`, icon: "🎮", label: "遊戲", match: pathname.includes("/game") },
    { href: `${base}/mock-test`, icon: "📝", label: "測驗", match: pathname.includes("/mock-test") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex justify-around items-center h-14">
        {items.map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${
              item.match ? "text-rose-400" : "text-slate-400 hover:text-rose-400"
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
