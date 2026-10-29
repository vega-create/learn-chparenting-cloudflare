"use client";
import { useMemo, useState } from "react";
import type { SearchEntry } from "@/lib/search-index";

/**
 * 首頁搜尋框：用標題＋關鍵字比對（不用 AI），最多列 8 筆。
 * 找不到時給分類入口，不讓人卡在空白結果。
 */
const MAX_RESULTS = 8;

function score(entry: SearchEntry, terms: string[]) {
  const title = entry.title.toLowerCase();
  const all = `${title} ${entry.group} ${entry.keywords}`.toLowerCase();
  let s = 0;
  for (const t of terms) {
    if (all.includes(t)) {
      s += title.includes(t) ? 3 : 1;
      continue;
    }
    // 中文常連著打（如「中級模考」），拆成兩字一組都對得上也算
    const pairs = t.length >= 3
      ? Array.from({ length: Math.ceil(t.length / 2) }, (_, i) => t.slice(Math.min(i * 2, t.length - 2), Math.min(i * 2, t.length - 2) + 2))
      : [];
    if (pairs.length === 0 || !pairs.every((p) => all.includes(p))) return 0;
    s += 1;
  }
  // 科目、工具排在單元與文章前面
  if (!["英檢單元", "日檢單元", "學習文章"].includes(entry.group)) s += 2;
  return s;
}

export default function HomeSearch({ index }: { index: SearchEntry[] }) {
  const [q, setQ] = useState("");
  const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const results = useMemo(() => {
    if (terms.length === 0) return [];
    return index
      .map((e) => ({ e, s: score(e, terms) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, MAX_RESULTS)
      .map((x) => x.e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, index]);

  return (
    <div className="relative max-w-2xl mx-auto">
      <label htmlFor="home-search" className="sr-only">搜尋練習</label>
      <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-2xl px-4 h-14 shadow-sm focus-within:border-[#2457A7] focus-within:ring-2 focus-within:ring-[#2457A7]/20">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 shrink-0" aria-hidden="true">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
        </svg>
        <input id="home-search" type="search" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="搜尋英檢中級、注音、九九乘法、五十音…" autoComplete="off"
          className="flex-1 min-w-0 bg-transparent border-0 outline-none text-base text-slate-800 placeholder:text-slate-400" />
      </div>

      {terms.length > 0 && (
        <div className="absolute z-30 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden text-left">
          {results.length > 0 ? (
            <ul className="list-none m-0 p-1">
              {results.map((r) => (
                <li key={r.href}>
                  <a href={r.href} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl no-underline text-slate-800 hover:bg-slate-50">
                    <span className="font-medium">{r.title}</span>
                    <span className="shrink-0 text-xs text-slate-500">{r.group}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-4 text-sm text-slate-600">
              找不到「{q.trim()}」，試試換個說法，或從
              <a href="#subjects" onClick={() => setQ("")} className="mx-1 font-semibold text-[#2457A7]">下面的科目</a>
              開始找。
            </div>
          )}
        </div>
      )}
    </div>
  );
}
