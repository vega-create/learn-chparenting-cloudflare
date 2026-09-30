"use client";
import { useState, useEffect } from "react";
import { getWeeklyEnglish, weekIndexOf } from "@/data/weekly-english";
import { speakEn } from "@/lib/speech";

/**
 * 首頁的「每週一句英文」。
 *
 * 句子依台灣時間每週一自動換（見 src/data/weekly-english.ts），
 * 所以要等瀏覽器載入後才知道是哪一句；載入前先留一塊高度，畫面不會跳。
 */
export default function WeeklyEnglishCard() {
  const [offset, setOffset] = useState(0);        // 0 = 本週，-1 = 上週…
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);

  if (!ready) return <section id="weekly-english" className="max-w-4xl mx-auto px-4 pt-8" style={{ minHeight: 230 }} aria-hidden="true" />;

  const { item, week, range } = getWeeklyEnglish(new Date(), offset);
  const thisWeek = weekIndexOf();
  const isProverb = item.type === "諺語";

  return (
    <section id="weekly-english" className="max-w-4xl mx-auto px-4 pt-8 scroll-mt-20" aria-label="每週一句英文">
      <div className="rounded-2xl p-6 md:p-8 border border-sky-200 shadow-sm bg-gradient-to-r from-sky-50 to-cyan-50">
        <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">🗣️</span>
            <h2 className="font-bold text-slate-800 text-lg m-0">每週一句英文</h2>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${isProverb ? "bg-amber-500" : "bg-sky-500"}`}>{item.type}</span>
          </div>
          <span className="text-xs text-slate-500">{offset === 0 ? "本週" : "之前"}・{range}</span>
        </div>

        <div className="flex items-start gap-3 mb-2">
          <p className="text-2xl md:text-3xl font-black text-slate-800 leading-snug m-0 flex-1" lang="en">{item.en}</p>
          <button onClick={() => speakEn(item.en, 0.8)} aria-label="聽這句英文怎麼唸"
            className="shrink-0 w-11 h-11 rounded-full bg-white border-2 border-sky-300 text-xl cursor-pointer hover:bg-sky-100 active:scale-95">🔊</button>
        </div>
        <p className="text-lg text-slate-600 mb-4">{item.zh}</p>

        {item.pattern && (
          <p className="text-sm text-slate-700 mb-2">
            <span className="font-bold text-sky-700">句型：</span><span lang="en">{item.pattern}</span>
          </p>
        )}
        <p className="text-sm text-slate-600 m-0">
          <span className="font-bold text-sky-700">{isProverb ? "什麼時候說：" : "怎麼用："}</span>{item.note}
        </p>

        <div className="flex justify-between items-center mt-5 text-sm">
          <div className="flex gap-3">
            <button onClick={() => setOffset(o => o - 1)} disabled={week === 0}
              className="text-sky-700 hover:underline cursor-pointer bg-transparent border-0 p-0 disabled:text-slate-300 disabled:no-underline disabled:cursor-default">← 上一句</button>
            {offset < 0 && (
              <button onClick={() => setOffset(o => Math.min(0, o + 1))}
                className="text-sky-700 hover:underline cursor-pointer bg-transparent border-0 p-0">
                {week + 1 === thisWeek ? "回到本週 →" : "下一句 →"}
              </button>
            )}
          </div>
          <a href="/elementary" className="text-sky-700 hover:underline no-underline">更多英文練習 →</a>
        </div>
      </div>
    </section>
  );
}
