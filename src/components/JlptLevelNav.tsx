import Link from "next/link";
import type { ReactNode } from "react";

/**
 * 日檢級別頁上方：五十音＋N5–N1 切換，加上練習模式入口（模擬測驗、口說、寫作、遊戲）。
 * 跟英檢頁一樣放在單元清單前面，不用捲到最下面才找得到。
 */
export type JlptLevel = "n5" | "n4" | "n3" | "n2" | "n1";

const TABS: { id: JlptLevel | "gojuon"; name: string; href: string }[] = [
  { id: "gojuon", name: "五十音", href: "/jlpt-n5/gojuon" },
  { id: "n5", name: "N5", href: "/jlpt-n5" },
  { id: "n4", name: "N4", href: "/jlpt-n4" },
  { id: "n3", name: "N3", href: "/jlpt-n3" },
  { id: "n2", name: "N2", href: "/jlpt-n2" },
  { id: "n1", name: "N1", href: "/jlpt-n1" },
];

const Icon = ({ children }: { children: ReactNode }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

const MODES: { path: string; icon: ReactNode; name: string; desc: string }[] = [
  { path: "mock-test", name: "模擬測驗", desc: "練習版，題型參考 JLPT",
    icon: <Icon><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M10 12h5M10 16h5" /></Icon> },
  { path: "speaking", name: "口說訓練", desc: "發音、跟讀、朗讀",
    icon: <Icon><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></Icon> },
  { path: "writing", name: "寫作練習", desc: "句子重組、翻譯",
    icon: <Icon><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></Icon> },
  { path: "game", name: "綜合遊戲", desc: "用遊戲複習全部單元",
    icon: <Icon><rect x="3" y="7" width="18" height="11" rx="4" /><path d="M8 10.5v4M6 12.5h4M15.5 11.5h.01M17.5 13.5h.01" strokeWidth="2.2" /></Icon> },
];

export function JlptLevelTabs({ current }: { current: JlptLevel | "gojuon" }) {
  return (
    <nav aria-label="切換日檢級別" className="flex gap-1.5 sm:gap-2">
      {TABS.map((t) => (
        <Link key={t.id} href={t.href} aria-current={t.id === current ? "page" : undefined}
          className={`min-w-[2.75rem] sm:min-w-[3.5rem] text-center px-3 sm:px-4 py-2 rounded-xl text-sm font-bold no-underline border transition-colors ${
            t.id === current
              ? "bg-[#E65E83] border-[#E65E83] text-white"
              : "bg-white border-slate-200 text-[#263238] hover:border-[#E65E83] hover:text-[#C2416A]"
          }`}>
          {t.name}
        </Link>
      ))}
    </nav>
  );
}

export function JlptModeCards({ level }: { level: JlptLevel }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {MODES.map((m) => (
        <Link key={m.path} href={`/jlpt-${level}/${m.path}`}
          className="flex items-center gap-3 p-3 md:p-4 bg-white rounded-2xl border border-slate-200 hover:border-[#2457A7] transition-colors no-underline">
          <span className="w-10 h-10 shrink-0 rounded-xl bg-[#FDECF1] text-[#C2416A] flex items-center justify-center">{m.icon}</span>
          <span className="min-w-0">
            <span className="block font-bold text-[#263238]">{m.name}</span>
            <span className="block text-xs text-[#52616B] leading-snug">{m.desc}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
