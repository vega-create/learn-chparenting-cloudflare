"use client";

import { useEffect, useState } from "react";
import { EXAM_DATES, nextExam, formatExamDate } from "@/data/exam-dates";
import type { JlptLevel } from "./JlptLevelNav";

/** 日檢級別頁：下次 JLPT 倒數＋分享。日期以 jlpt.tw 公告為準。 */
export function JlptExamBanner({ level }: { level: JlptLevel }) {
  const [next, setNext] = useState<{ date: string; days: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const pageUrl = `https://learn.chparenting.com/jlpt-${level}`;
  const name = level.toUpperCase();

  useEffect(() => {
    setNext(nextExam(EXAM_DATES.jlpt));
  }, []);

  const shareText = `JLPT ${name} 日文免費線上題庫，單字、文法、聽力、模擬測驗都有，不用註冊 ${pageUrl}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("複製這個連結：", pageUrl);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4 rounded-2xl border border-slate-200 bg-white">
      <div className="flex-1 min-w-[12rem]">
        <div className="text-xs font-bold text-[#C2416A]">下次日本語能力試驗（JLPT）台灣場</div>
        {next ? (
          <div className="text-[#263238]">
            <span className="font-bold">{formatExamDate(next.date, true)}</span>
            <span className="ml-2 text-sm text-[#C2416A] font-semibold">
              {next.days === 0 ? "就是今天，加油！" : `還有 ${next.days} 天`}
            </span>
          </div>
        ) : (
          <div className="text-sm text-[#52616B]">最新日期請見官網</div>
        )}
        <a href="https://www.jlpt.tw/" target="_blank" rel="noopener noreferrer"
          className="text-xs text-[#52616B] underline">以日本語能力試驗台灣官網（jlpt.tw）公告為準</a>
      </div>

      <div>
        <div className="text-xs text-[#52616B] mb-1.5">老師、家長可免費分享給學生練習</div>
        <div className="flex gap-2">
          <a href={lineUrl} target="_blank" rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-[#06C755] text-white text-sm font-bold no-underline">分享到 LINE</a>
          <button type="button" onClick={copyLink}
            className="px-3 py-2 rounded-xl bg-white border border-[#2457A7] text-[#2457A7] text-sm font-bold cursor-pointer">
            {copied ? "已複製 ✓" : "複製連結"}
          </button>
        </div>
      </div>
    </div>
  );
}
