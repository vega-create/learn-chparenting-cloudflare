"use client";
import { useState, useEffect } from "react";

/**
 * 遊戲頁右下角的「怎麼玩」按鈕。
 *
 * 每款遊戲的規則原本只出現在開始前的選單，開始玩之後就看不到；
 * 頁面下方雖然也有說明，但孩子玩到一半不會往下捲。
 * 這個按鈕固定在畫面上，隨時點開看操作步驟、規則和小技巧。
 * 由 BoardGameSEO 統一放進每一款遊戲，不用改各遊戲自己的程式。
 */
export default function GameHelpButton({ name, icon, howTo, rules, tips }: {
  name: string; icon: string; howTo: string[]; rules: string[]; tips: string[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button onClick={() => setOpen(true)} aria-haspopup="dialog"
        className="fixed right-2 bottom-[4.25rem] md:bottom-6 md:right-6 z-40 flex items-center gap-1 px-2.5 py-1.5 md:px-3.5 md:py-2.5 rounded-full bg-amber-400 text-white font-bold text-xs md:text-sm shadow-lg cursor-pointer border-0 hover:bg-amber-500 active:scale-95 opacity-90">
        <span aria-hidden="true">❓</span> 怎麼玩
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label={`${name}怎麼玩`}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-white w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 animate-slideUp">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-800 m-0">{icon} {name}怎麼玩</h2>
              <button onClick={() => setOpen(false)} aria-label="關閉說明"
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 cursor-pointer border-0 hover:bg-slate-200">✕</button>
            </div>

            <h3 className="font-bold text-slate-700 text-sm mb-1.5">🖐️ 操作步驟</h3>
            <ol className="list-decimal pl-5 mb-4 space-y-1 text-sm text-slate-600">
              {howTo.map((s, i) => <li key={i}>{s}</li>)}
            </ol>

            <h3 className="font-bold text-slate-700 text-sm mb-1.5">🎮 遊戲規則</h3>
            <ul className="list-disc pl-5 mb-4 space-y-1 text-sm text-slate-600">
              {rules.map((s, i) => <li key={i}>{s}</li>)}
            </ul>

            <h3 className="font-bold text-slate-700 text-sm mb-1.5">👨‍👩‍👧 給陪玩的大人</h3>
            <ul className="list-disc pl-5 mb-4 space-y-1 text-sm text-slate-600">
              {tips.map((s, i) => <li key={i}>{s}</li>)}
            </ul>

            <p className="text-xs text-slate-400 mb-4">有計時的遊戲，打開說明的時候時間還是會繼續走，建議開始前先看。</p>

            <button onClick={() => setOpen(false)}
              className="w-full py-3 rounded-xl bg-amber-400 text-white font-bold cursor-pointer border-0 hover:bg-amber-500">
              知道了，繼續玩
            </button>
          </div>
        </div>
      )}
    </>
  );
}
