"use client";
import { useState, useEffect } from "react";

const STEPS = [
  {
    icon: "🌟",
    title: "歡迎來到 learn.chparenting.com",
    description: "「孩子才是最強 AI」\n免費的親子學習平台，讓孩子自己學、自己做、爸媽輕鬆陪。",
  },
  {
    icon: "🎯",
    title: "豐富的學習工具",
    description: "✅ 全民英檢（初級・中級・中高級）\n✅ 日文檢定（N1～N5）\n✅ 數學練習・邏輯遊戲・打字練習・兒童理財\n🔜 國語學習・歷史地理・樂理基礎\n\n每天自由安排時間，輕鬆學習無壓力！",
  },
  {
    icon: "👩",
    title: "專為爸媽設計",
    description: "📥 每單元都有練習單可以下載\n🔑 答案由家長專區查看，小朋友不會直接看到\n📚 免費家長陪伴指南，30 秒就知道怎麼陪\n\n不用懂教學，也能陪孩子學！",
  },
  {
    icon: "🚀",
    title: "開始學習吧！",
    description: "選一個工具，讓孩子自己探索。\n做完記得下載練習單，線下再練一次效果更好！",
  },
];

const STORAGE_KEY = "onboarding_v2_completed";

export default function OnboardingTutorial() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Only show on first visit
    if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
      // Small delay for smoother experience
      const timer = setTimeout(() => setShow(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!show) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-slideUp">
        {/* Skip button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer text-sm font-medium z-10"
        >
          略過
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="text-5xl mb-4">{current.icon}</div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">{current.title}</h2>
          <p className="text-slate-600 text-sm leading-6 whitespace-pre-line">{current.description}</p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 pb-4">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-2 h-2 rounded-full border-0 cursor-pointer transition-all ${
                i === step ? "bg-rose-300 w-6" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 p-4 pt-0">
          {step > 0 && (
            <button
              onClick={handlePrev}
              className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-semibold border-0 cursor-pointer hover:bg-slate-200 transition text-sm"
            >
              上一步
            </button>
          )}
          <button
            onClick={handleNext}
            className={`flex-1 py-3 rounded-xl bg-rose-300 text-white font-semibold border-0 cursor-pointer hover:bg-rose-400 transition text-sm ${
              step === 0 ? "w-full" : ""
            }`}
          >
            {isLast ? "開始學習 🚀" : "下一步"}
          </button>
        </div>
      </div>
    </div>
  );
}
