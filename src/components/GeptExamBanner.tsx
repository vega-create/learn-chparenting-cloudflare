"use client";

import { useEffect, useState } from "react";
import { EXAM_DATES, nextExam, formatExamDate } from "@/data/exam-dates";

const LEVEL_NAME = { elementary: "初級", intermediate: "中級" };
const LEVEL_DATES = { elementary: EXAM_DATES.geptElementary, intermediate: EXAM_DATES.geptIntermediate };

export function GeptExamBanner({ level }: { level: "elementary" | "intermediate" }) {
  const [next, setNext] = useState<{ date: string; days: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const pageUrl = `https://learn.chparenting.com/${level}`;
  const name = LEVEL_NAME[level];

  useEffect(() => {
    setNext(nextExam(LEVEL_DATES[level]));
  }, [level]);

  const shareText = `全民英檢${name}免費線上題庫，單字、聽力、閱讀、模擬測驗都有，不用註冊 ${pageUrl}`;
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
    <div className="mb-8 grid gap-3 md:grid-cols-2">
      <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50">
        <div className="text-xs font-semibold text-amber-700 mb-1">📅 下次 GEPT {name}聽讀測驗</div>
        {next ? (
          <div className="text-slate-800">
            <span className="text-lg font-bold">{formatExamDate(next.date, true)}</span>
            <span className="ml-2 text-sm text-amber-700 font-semibold">
              {next.days === 0 ? "就是今天，加油！" : `還有 ${next.days} 天`}
            </span>
          </div>
        ) : (
          <div className="text-sm text-slate-600">最新日期請見官網</div>
        )}
        <a href="https://www.gept.org.tw/" target="_blank" rel="noopener noreferrer"
          className="text-xs text-slate-500 underline mt-1 inline-block">以 LTTC 全民英檢官網公告為準</a>
      </div>

      <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50">
        <div className="text-sm text-slate-700 mb-2">👩‍🏫 老師、家長可免費分享給學生練習</div>
        <div className="flex gap-2">
          <a href={lineUrl} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#06C755] text-white text-sm font-bold no-underline">分享到 LINE</a>
          <button type="button" onClick={copyLink}
            className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-700 text-sm font-bold">
            {copied ? "已複製 ✓" : "複製連結"}
          </button>
        </div>
      </div>
    </div>
  );
}
