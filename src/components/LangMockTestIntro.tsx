import type { ReactNode } from "react";

/**
 * 英檢／日檢模擬測驗的開始畫面（改版視覺）：平台練習版標籤、三個部分、作答前確認、開始按鈕。
 * 只負責版面；開始測驗、測試聲音的行為由呼叫端傳入。
 */
type Part = { icon: "listen" | "vocab" | "read"; name: string; detail: ReactNode };

const PartIcon = ({ name }: { name: Part["icon"] }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === "listen" && <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /></>}
    {name === "vocab" && <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M10 12h5M10 16h5" /></>}
    {name === "read" && <><path d="M3 5h6a3 3 0 0 1 3 3v12a2.5 2.5 0 0 0-2.5-2.5H3Z" /><path d="M21 5h-6a3 3 0 0 0-3 3v12a2.5 2.5 0 0 1 2.5-2.5H21Z" /></>}
  </svg>
);

export function LangMockTestIntro({
  title, desc, parts, notes, startLabel, onStart, onTestSound, backHref, backLabel,
}: {
  title: string;
  desc: ReactNode;
  parts: Part[];
  notes: ReactNode[];
  startLabel: string;
  onStart: () => void;
  onTestSound?: () => void;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-5">
      <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FDECF1] text-[#C2416A]">平台練習版</span>
          <span className="text-sm text-[#52616B]">非官方試題，題目從各單元隨機抽出</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-[#263238] leading-tight m-0">{title}</h1>
        <p className="mt-3 mb-0 text-[15px] md:text-lg text-[#52616B] leading-relaxed">{desc}</p>
      </section>

      <section aria-label="練習內容" className="grid md:grid-cols-3 gap-3">
        {parts.map((p, i) => (
          <div key={i} className="flex gap-3 p-4 md:p-5 bg-white rounded-2xl border border-slate-200">
            <span className="w-12 h-12 shrink-0 rounded-full bg-[#FDECF1] text-[#C2416A] flex items-center justify-center"><PartIcon name={p.icon} /></span>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#C2416A]">第 {i + 1} 部分</div>
              <div className="font-bold text-[#263238]">{p.name}</div>
              <div className="text-sm text-[#52616B] mt-0.5">{p.detail}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-[#F6C9D6] bg-[#FDF3F6] p-5 md:p-6">
        <h2 className="text-lg font-bold text-[#263238] border-l-4 border-[#E65E83] pl-3 mt-0 mb-4">作答前請先確認</h2>
        <ul className="list-none p-0 m-0 space-y-2 text-[15px] text-[#263238]">
          {notes.map((n, i) => (
            <li key={i} className="flex gap-2"><span className="text-[#E65E83] shrink-0" aria-hidden="true">●</span><span>{n}</span></li>
          ))}
        </ul>
        {onTestSound && (
          <button type="button" onClick={onTestSound}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#2457A7] text-[#2457A7] text-sm font-bold cursor-pointer hover:bg-[#EEF3FB] transition">
            🔊 測試聲音
          </button>
        )}
      </section>

      <div className="text-center pt-2">
        <button onClick={onStart}
          className="px-12 py-4 bg-[#2457A7] text-white rounded-xl font-bold text-lg cursor-pointer border-none hover:bg-[#1d4a8f] transition active:scale-95">
          {startLabel}
        </button>
        <div className="mt-4"><a href={backHref} className="text-sm text-[#2457A7] hover:underline">{backLabel}</a></div>
      </div>
    </div>
  );
}
