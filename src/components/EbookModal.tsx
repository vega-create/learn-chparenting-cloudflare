"use client";
import { useState } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface EbookModalProps {
  toolName: string;    // 'GEPT 初級' | 'GEPT 中級' | '日文 N5' etc.
  ebookSlug: string;   // 'gept-elementary' | 'gept-intermediate' | 'japanese-n5' etc.
  isOpen: boolean;
  onClose: () => void;
}

export default function EbookModal({ toolName, ebookSlug, isOpen, onClose }: EbookModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/ebook-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ebookSlug }),
      });
      if (res.ok) {
        setStatus("success");
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "ebook_request", {
            tool: ebookSlug,
            email_collected: true,
          });
        }
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-xl animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent text-xl"
        >
          ✕
        </button>

        {status === "success" ? (
          /* Success state */
          <div className="text-center py-4">
            <div className="text-5xl mb-4">📬</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">已送出！</h3>
            <p className="text-slate-500 text-sm mb-4">
              電子書下載連結已寄到你的信箱，請檢查 Email（也看一下垃圾郵件夾）
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold cursor-pointer border-none hover:bg-emerald-600 transition"
            >
              好的！
            </button>
          </div>
        ) : (
          /* Form state */
          <>
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                免費索取《{toolName}家長陪伴指南》
              </h3>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-5 text-sm text-slate-600 space-y-1.5">
              <div>✓ 所有單元的 30 秒陪伴提示</div>
              <div>✓ 常見問題與解決方式</div>
              <div>✓ 學習進度建議時間表</div>
              <div>✓ 精美排版，手機也能看</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="請輸入 Email"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:outline-none text-sm"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer border-none hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {status === "loading" ? "處理中..." : "免費寄送到我的信箱 📩"}
              </button>
            </form>

            {status === "error" && (
              <p className="text-red-500 text-xs text-center mt-2">
                送出失敗，請稍後再試
              </p>
            )}

            <p className="text-xs text-slate-400 text-center mt-3">
              🔒 我們不會寄垃圾信，只寄學習資源
            </p>
          </>
        )}
      </div>
    </div>
  );
}
