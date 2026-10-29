"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * 第一次來首頁時的小提示（頁內一條，可關掉，不遮畫面）。
 * 原本是全螢幕的 4 步驟歡迎彈窗，新訪客要先關掉才看得到內容，改成這樣。
 * 完整說明在「使用說明」頁，隨時都能打開。
 */
const STORAGE_KEY = "onboarding_v2_completed";

export default function OnboardingTutorial() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (pathname === "/" && !localStorage.getItem(STORAGE_KEY)) setShow(true);
    } catch {
      // 無痕模式等讀不到 localStorage 時就不顯示
    }
  }, [pathname]);

  const handleClose = () => {
    try { localStorage.setItem(STORAGE_KEY, "true"); } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="google-anno-skip max-w-6xl mx-auto px-4 pt-3">
      <div className="flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm text-slate-700">
        <span aria-hidden="true">👋</span>
        <p className="flex-1 m-0">
          第一次來嗎？大人小孩都能用，免費、不用註冊，選一個科目就能開始。
          <a href="/how-to-use" className="ml-1 font-semibold text-sky-700">看使用說明 →</a>
        </p>
        <button type="button" onClick={handleClose} aria-label="關閉提示"
          className="shrink-0 w-8 h-8 rounded-full border-0 bg-transparent text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
      </div>
    </div>
  );
}
