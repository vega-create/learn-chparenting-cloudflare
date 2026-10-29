"use client";
import { useState } from "react";
import type { SiteUpdate } from "@/data/site-updates";

const KINDS = ["全部", "新增", "更新", "新文章"] as const;
const KIND_STYLE: Record<string, string> = {
  "新增": "bg-[#FDECF1] text-[#C2416A]",
  "更新": "bg-sky-50 text-sky-700",
  "新文章": "bg-amber-50 text-amber-800",
};

// 「心算氣球：算式氣球掉下來…」拆成標題＋說明；沒有冒號就整句當標題
function split(text: string) {
  const i = text.indexOf("：");
  return i > 0 ? { title: text.slice(0, i), desc: text.slice(i + 1) } : { title: text, desc: "" };
}

export default function UpdatesList({ updates }: { updates: SiteUpdate[] }) {
  const [kind, setKind] = useState<(typeof KINDS)[number]>("全部");
  const shown = updates.filter((u) => kind === "全部" || u.kind === kind);
  const months = [...new Set(shown.map((u) => u.date.slice(0, 7)))];

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label="依類型篩選">
        {KINDS.map((k) => (
          <button key={k} type="button" onClick={() => setKind(k)} aria-pressed={kind === k}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border cursor-pointer ${
              kind === k ? "bg-[#2457A7] border-[#2457A7] text-white" : "bg-white border-slate-200 text-[#52616B] hover:bg-slate-50"
            }`}>
            {k}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {months.map((m) => (
          <section key={m}>
            <h2 className="px-5 pt-5 pb-3 m-0 text-lg font-bold text-[#263238] border-b border-slate-200">
              {Number(m.slice(0, 4))}年{Number(m.slice(5))}月
            </h2>
            <ul className="list-none m-0 p-0 divide-y divide-slate-100">
              {shown.filter((u) => u.date.startsWith(m)).map((u) => {
                const { title, desc } = split(u.text);
                return (
                  <li key={`${u.date}-${u.href}-${u.text}`}>
                    <a href={u.href} className="flex items-center gap-3 md:gap-5 px-5 py-3.5 no-underline hover:bg-slate-50">
                      <span className="shrink-0 w-11 text-sm text-slate-500 tabular-nums">{u.date.slice(5).replace("-", "/")}</span>
                      <span className={`shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-md ${KIND_STYLE[u.kind] ?? ""}`}>{u.kind}</span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-bold text-[#263238]">{title}</span>
                        {desc && <span className="block text-sm text-[#52616B] mt-0.5">{desc}</span>}
                      </span>
                      <span className="shrink-0 text-[#2457A7]" aria-hidden="true">›</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
