"use client";
import { useState } from "react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok || res.status === 200) {
        setSubmitted(true);
        setEmail("");
      } else if (res.status === 503) {
        // Supabase not configured — fall back to localStorage
        const stored = JSON.parse(localStorage.getItem("newsletter_emails") || "[]");
        stored.push({ email: email.trim(), date: new Date().toISOString() });
        localStorage.setItem("newsletter_emails", JSON.stringify(stored));
        setSubmitted(true);
        setEmail("");
      } else {
        setError("訂閱失敗，請稍後再試");
      }
    } catch {
      // Network error — fall back to localStorage
      const stored = JSON.parse(localStorage.getItem("newsletter_emails") || "[]");
      stored.push({ email: email.trim(), date: new Date().toISOString() });
      localStorage.setItem("newsletter_emails", JSON.stringify(stored));
      setSubmitted(true);
      setEmail("");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 text-center border border-emerald-200">
          <div className="text-3xl mb-3">🎉</div>
          <h3 className="text-xl font-bold text-emerald-700 mb-2">感謝訂閱！</h3>
          <p className="text-slate-600">我們會在有新功能或學習資源時通知你。</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl p-8 text-center border border-rose-200">
        <div className="text-3xl mb-3">📬</div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">訂閱學習通知</h3>
        <p className="text-slate-600 mb-6">新工具上線第一時間通知你！國語學習・歷史地理・樂理基礎即將推出 🚀</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-rose-300 text-white font-semibold rounded-xl hover:bg-rose-400 transition border-0 cursor-pointer text-base disabled:opacity-50"
          >
            {submitting ? "處理中..." : "訂閱"}
          </button>
        </form>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        <p className="text-xs text-slate-400 mt-3">我們不會發送垃圾信件，隨時可以取消訂閱。</p>
      </div>
    </section>
  );
}
