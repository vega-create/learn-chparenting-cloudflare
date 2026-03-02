"use client";
import { useState } from "react";

interface ShareButtonsProps {
  text: string;
  url?: string;
}

const SITE_URL = "https://learn.chparenting.com";

export default function ShareButtons({ text, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  const shareToFB = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareToLINE = () => {
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const copyLink = () => {
    const fullText = `${text}\n${shareUrl}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div className="flex gap-2 justify-center">
      <button onClick={shareToFB}
        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#1877f2] text-white text-xs font-bold cursor-pointer border-none hover:opacity-90 transition">
        <span>📘</span> Facebook
      </button>
      <button onClick={shareToLINE}
        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#06c755] text-white text-xs font-bold cursor-pointer border-none hover:opacity-90 transition">
        <span>💬</span> LINE
      </button>
      <button onClick={copyLink}
        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer border border-slate-200 hover:bg-slate-200 transition">
        <span>{copied ? "✅" : "🔗"}</span> {copied ? "已複製" : "複製"}
      </button>
    </div>
  );
}
