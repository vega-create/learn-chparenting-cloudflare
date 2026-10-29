"use client";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { BrandMark } from "@/components/SubjectIcon";

export default function LoginPage() {
  const { user, loading, configured } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      window.location.href = "/dashboard";
    }
  }, [user, loading]);

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    if (!supabase) return;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Login error:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="text-[#52616B]">載入中...</div>
      </div>
    );
  }

  return (
    <div className="bg-white px-4 py-10 md:py-16">
      <div className="w-full max-w-md mx-auto">
        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200 px-6 py-8 md:px-10 md:py-10 text-center">
          <div className="flex flex-col items-center mb-6">
            <BrandMark size={40} />
            <div className="mt-1.5 font-black text-[#E65E83] text-lg">親子多元學習平台</div>
            <div className="text-xs text-[#52616B]">learn.chparenting.com</div>
          </div>
          <h1 className="text-[28px] md:text-[32px] font-black text-[#263238] mb-2">歡迎回來</h1>
          <p className="text-[#52616B] mb-7">登入後可查看學習紀錄與每日學習計畫</p>

          {configured ? (
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-[#2457A7] border-0 rounded-xl font-bold text-white hover:bg-[#1d4a8f] transition cursor-pointer text-base"
            >
              <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </span>
              使用 Google 帳號登入
            </button>
          ) : (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-[#263238] font-bold mb-1">登入功能即將開放！</p>
              <p className="text-xs text-[#52616B] m-0">我們正在設定登入系統，敬請期待。</p>
            </div>
          )}

          <div className="flex items-center gap-3 my-5 text-sm text-[#52616B]">
            <span className="flex-1 h-px bg-slate-200" />或<span className="flex-1 h-px bg-slate-200" />
          </div>

          <a
            href="/#subjects"
            className="w-full flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl border border-[#2457A7] text-[#2457A7] bg-white font-bold no-underline hover:bg-[#F4F7FB] transition"
          >
            不登入，直接開始學習
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5.5l6.5 6.5L9 18.5" /></svg>
          </a>
          <p className="text-xs text-[#52616B] mt-3 mb-0">不想登入？沒關係！所有功能都可以免費使用。</p>

          {/* Account tip */}
          <div className="mt-6 text-left bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-sm font-bold text-[#263238] mb-1">每位小朋友請用自己的帳號登入</p>
            <p className="text-xs text-[#52616B] leading-relaxed m-0">
              這樣每個孩子都能擁有專屬的學習紀錄、進度追蹤和連續學習天數
            </p>
          </div>

          <p className="text-xs text-[#52616B] mt-5 mb-0">
            登入即表示你同意我們的服務條款和隱私權政策
          </p>
        </div>

      </div>

      <div className="max-w-4xl mx-auto mt-10 grid sm:grid-cols-3 gap-3">
        {[
          { t: "多元的學習內容", d: "英檢、日檢、國語、數學、打字、樂理、理財與教育桌遊。", path: <><path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5Z" /><path d="M12 6.5v13" /></> },
          { t: "家長陪伴指南", d: "每個英檢、日檢單元都有今天學什麼、怎麼陪的說明。", path: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" /></> },
          { t: "免費學習，自由探索", d: "不論是否登入，所有練習都可以免費使用。", path: <path d="M12 19.5s-7.5-4.4-7.5-10A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7.5 2.5c0 5.6-7.5 10-7.5 10Z" /> },
        ].map((f) => (
          <div key={f.t} className="flex items-start gap-3 bg-white/70 rounded-2xl border border-slate-200 p-4">
            <span className="w-10 h-10 shrink-0 rounded-xl bg-[#FDECF1] text-[#E65E83] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{f.path}</svg>
            </span>
            <div>
              <p className="font-bold text-[#263238] text-sm m-0">{f.t}</p>
              <p className="text-xs text-[#52616B] leading-relaxed mt-0.5 mb-0">{f.d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
