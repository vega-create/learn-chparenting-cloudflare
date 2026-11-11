"use client";
import { useEffect } from "react";

/**
 * 舊的 Supabase 回呼頁。現在 Google 直接導回 /api/auth/callback/google（伺服器端發 cookie 後再 302 到 /dashboard），
 * 這一頁只留給舊書籤：有登入就去儀表板，沒有就回登入頁。
 */
export default function AuthCallbackPage() {
  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store", credentials: "same-origin" })
      .then((r) => r.json())
      .then((j: { user: unknown }) => {
        window.location.href = j.user ? "/dashboard" : "/login";
      })
      .catch(() => {
        window.location.href = "/login";
      });
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🔄</div>
        <p className="text-slate-500">登入中，請稍候...</p>
      </div>
    </div>
  );
}
