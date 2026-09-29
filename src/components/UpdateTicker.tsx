"use client";
import { useState } from "react";
import { SITE_UPDATES, MAX_TICKER_ITEMS, type SiteUpdate } from "@/data/site-updates";

/**
 * 首頁的「最新消息」跑馬燈。
 *
 * - 內容在 src/data/site-updates.ts，這裡只負責顯示。
 * - 滑鼠移上去、鍵盤聚焦、或按暫停鈕都會停下來，讓人來得及點。
 * - 使用者的系統設定是「減少動態效果」時不會跑，改成可以左右滑動的清單。
 * - 內容複製一份接在後面做無縫循環，第二份對螢幕報讀器隱藏。
 */

const KIND_STYLE: Record<SiteUpdate["kind"], string> = {
  "新增": "bg-rose-100 text-rose-600",
  "更新": "bg-sky-100 text-sky-700",
  "新文章": "bg-amber-100 text-amber-700",
};

const shortDate = (iso: string) => {
  const [, m, d] = iso.split("-");
  return `${Number(m)}/${Number(d)}`;
};

function Items({ items, hidden }: { items: SiteUpdate[]; hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-6 pr-6 m-0 p-0 list-none" aria-hidden={hidden || undefined}>
      {items.map(u => (
        <li key={u.href} className="shrink-0">
          <a href={u.href} tabIndex={hidden ? -1 : undefined}
            className="flex items-center gap-1.5 text-sm text-slate-700 no-underline hover:text-rose-500 whitespace-nowrap">
            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${KIND_STYLE[u.kind]}`}>{u.kind}</span>
            <span>{u.text}</span>
            <span className="text-xs text-slate-400">{shortDate(u.date)}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function UpdateTicker() {
  const [paused, setPaused] = useState(false);
  const items = SITE_UPDATES.slice(0, MAX_TICKER_ITEMS);
  if (items.length === 0) return null;

  return (
    <section aria-label="最新消息" className="bg-white border-b border-rose-100">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-3 h-10">
        <span className="shrink-0 text-xs font-bold text-white bg-rose-400 rounded-full px-2.5 py-1">📢 最新消息</span>
        <div className="update-ticker relative flex-1 overflow-hidden">
          <div className={`update-ticker-track flex w-max ${paused ? "is-paused" : ""}`}
            style={{ animationDuration: `${items.length * 6}s` }}>
            <Items items={items} />
            <Items items={items} hidden />
          </div>
        </div>
        <button onClick={() => setPaused(p => !p)} aria-pressed={paused}
          aria-label={paused ? "繼續播放最新消息" : "暫停最新消息"}
          className="update-ticker-toggle shrink-0 w-7 h-7 rounded-full border border-slate-200 bg-white text-slate-500 text-xs cursor-pointer hover:bg-slate-50">
          {paused ? "▶" : "⏸"}
        </button>
      </div>
    </section>
  );
}
