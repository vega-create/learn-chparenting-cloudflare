"use client";
import { useEffect, useRef } from "react";

/**
 * 手動 AdSense 廣告位（延遲載入）：進入畫面才建立 <ins> 並 push。
 * AdSense 只對 push 當下在視窗內的單元送請求，畫面外先 push 的不會補請求，
 * 所以等進入畫面再載入；IntersectionObserver 之外再加 scroll 檢查當備援（同 baby 站做法）。
 * 沒填到廣告時整塊隱藏（globals.css 的 unfilled 規則），不會留空白。
 * 遊戲、練習作答畫面不要放，避免小孩誤點。
 */
const CLIENT = "ca-pub-3493526929407874";
export const AD_UNITS = {
  articleTop: "4422721381",  // learn-文章-開頭
  articleMid: "4333102376",  // learn-文章-中段（文章中段、文末共用）
  list: "1515367343",        // learn-科目列表
} as const;

declare global {
  interface Window { adsbygoogle?: unknown[] }
}

export default function AdSlot({ unit, className = "my-8" }: { unit: keyof typeof AD_UNITS; className?: string }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      const ins = document.createElement("ins");
      ins.className = "adsbygoogle";
      ins.style.display = "block";
      ins.setAttribute("data-ad-client", CLIENT);
      ins.setAttribute("data-ad-slot", AD_UNITS[unit]);
      ins.setAttribute("data-ad-format", "auto");
      ins.setAttribute("data-full-width-responsive", "true");
      el.appendChild(ins);
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { /* 廣告被擋或腳本未載入 */ }
    };
    const inView = () => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < window.innerHeight; };

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { load(); io?.disconnect(); }
      });
      io.observe(el);
    }
    let t: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      if (t || loaded) return;
      t = setTimeout(() => { t = null; if (inView()) load(); }, 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    if (inView()) load();

    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (t) clearTimeout(t);
    };
  }, [unit]);

  return <div ref={box} className={className} style={{ minHeight: 1 }} />;
}
