"use client";
import { useState, useEffect } from "react";

const STEPS = [
  {
    icon: "👋",
    title: "歡迎來到親子多元學習平台",
    description: "完全免費的學習平台，提供英檢、日文、數學、桌遊、打字、理財等豐富學習工具，讓孩子快樂學習！",
  },
  {
    icon: "📚",
    title: "六大學習工具",
    description: "📘 全民英檢（初～中高級）・🇯🇵 日文檢定（N5～N1）・🎲 18款教育桌遊・🔢 數學練習・⌨️ 打字練習・💰 兒童理財",
  },
  {
    icon: "📖",
    title: "建議學習順序",
    description: "語言學習按 單字 → 文法 → 聽力 → 閱讀 → 測驗 的順序效果最好。每天自由安排時間，不趕進度。",
  },
  {
    icon: "🎮",
    title: "邊玩邊學",
    description: "學完後到桌遊區練習，用模擬測驗檢驗成果。每天回來挑戰「今日挑戰」，持續進步！",
  },
];

const STORAGE_KEY = "onboarding_completed";

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
          <p className="text-slate-600 text-sm leading-6">{current.description}</p>
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
