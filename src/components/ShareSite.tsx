"use client";
import { useState } from "react";

/** 分享整站給家人、學生：LINE＋複製連結（跟英檢頁的分享卡同一套做法）。 */
const URL = "https://learn.chparenting.com/";
const TEXT = "大人小孩都能練的免費學習平台：英檢、日檢、國語、數學、動腦遊戲，不用註冊就能開始";

export default function ShareSite() {
  const [copied, setCopied] = useState(false);
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(URL)}&text=${encodeURIComponent(`${TEXT} ${URL}`)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("複製這個連結：", URL);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-[#52616B]">分享給家人、學生：</span>
      <a href={lineUrl} target="_blank" rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-lg bg-[#06C755] text-white font-bold no-underline">LINE</a>
      <button type="button" onClick={copy}
        className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-[#263238] font-bold cursor-pointer">
        {copied ? "已複製 ✓" : "複製連結"}
      </button>
    </div>
  );
}
