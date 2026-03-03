"use client";
import { useState, useEffect } from "react";
import { getDailyChallenge, type DailyChallenge } from "@/data/daily-challenges";
import ShareButtons from "@/components/ShareButtons";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export default function DailyChallengeBlock() {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [todayStr, setTodayStr] = useState("");
  const [stats, setStats] = useState<{ total: number; correct: number } | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const today = getToday();
    setTodayStr(today);
    const c = getDailyChallenge(new Date());
    setChallenge(c);

    // Check if already answered today
    const saved = localStorage.getItem("daily_challenge_date");
    if (saved === today) {
      const savedAnswer = localStorage.getItem("daily_challenge_answer");
      if (savedAnswer !== null) {
        setSelected(Number(savedAnswer));
        setAnswered(true);
        setCollapsed(true); // Auto-collapse if already answered
      }
    }

    // Fetch stats
    fetch("/api/daily-challenge")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});
  }, []);

  const handleAnswer = (idx: number) => {
    if (answered || !challenge) return;
    setSelected(idx);
    setAnswered(true);
    localStorage.setItem("daily_challenge_date", todayStr);
    localStorage.setItem("daily_challenge_answer", String(idx));

    const isCorrect = idx === challenge.answer;

    // Auto-collapse after 4 seconds so user can see result first
    setTimeout(() => setCollapsed(true), 4000);

    // Record to Supabase
    fetch("/api/daily-challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: challenge.id,
        subject: challenge.category,
        isCorrect,
      }),
    })
      .then((r) => r.json())
      .then(() => {
        // Update local stats
        setStats((prev) => ({
          total: (prev?.total ?? 0) + 1,
          correct: (prev?.correct ?? 0) + (isCorrect ? 1 : 0),
        }));
      })
      .catch(() => {});
  };

  if (!challenge) return null;

  const isCorrect = selected === challenge.answer;
  const weekday = ["日", "一", "二", "三", "四", "五", "六"][new Date().getDay()];
  const accuracy = stats && stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  // Collapsed view — compact bar
  if (answered && collapsed) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-4">
        <button
          onClick={() => setCollapsed(false)}
          className={`w-full rounded-2xl px-5 py-3 border shadow-sm transition-all flex items-center justify-between cursor-pointer hover:shadow-md ${
            isCorrect
              ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200"
              : "bg-gradient-to-r from-red-50 to-orange-50 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{isCorrect ? "✅" : "❌"}</span>
            <span className="font-bold text-slate-700 text-sm">今日挑戰已完成</span>
            <span className="text-xs text-slate-400">— {challenge.category}</span>
          </div>
          <span className="text-xs text-slate-400">展開 ▼</span>
        </button>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className={`rounded-2xl p-6 md:p-8 border shadow-sm transition-all ${
        answered
          ? isCorrect
            ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200"
            : "bg-gradient-to-r from-red-50 to-orange-50 border-red-200"
          : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200"
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h3 className="text-lg font-bold text-slate-800">今日挑戰</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400 font-mono">
              {todayStr} ({weekday})
            </div>
            {answered && (
              <button
                onClick={() => setCollapsed(true)}
                className="text-xs text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                收起 ▲
              </button>
            )}
          </div>
        </div>

        {/* Category badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-full bg-white/60 text-xs font-semibold text-indigo-600 border border-indigo-200">
            📘 {challenge.category}
          </span>
        </div>

        {/* Question */}
        <div className="text-lg md:text-xl font-bold text-slate-800 mb-5">
          {challenge.question}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {challenge.options.map((opt, i) => {
            let cls = "py-3 px-4 rounded-xl text-left font-medium transition-all border-2 cursor-pointer ";
            if (answered) {
              if (i === challenge.answer) {
                cls += "bg-emerald-100 border-emerald-400 text-emerald-800 ";
              } else if (i === selected && i !== challenge.answer) {
                cls += "bg-red-100 border-red-400 text-red-800 ";
              } else {
                cls += "bg-white/50 border-slate-200 text-slate-400 ";
              }
              cls += "cursor-default ";
            } else {
              cls += "bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 active:scale-[0.98] ";
            }
            return (
              <button key={i} onClick={() => handleAnswer(i)} disabled={answered} className={cls}>
                <span className="text-slate-400 mr-2 text-sm">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Stats bar */}
        {stats && stats.total > 0 && (
          <div className="flex items-center justify-center gap-3 text-xs text-slate-400 mb-3">
            <span>📊 今日 {stats.total.toLocaleString()} 人作答</span>
            <span>｜</span>
            <span>正確率 {accuracy}%</span>
          </div>
        )}

        {/* Result */}
        {answered && (
          <div className="animate-fadeIn">
            <div className={`text-center text-sm font-bold mb-3 ${isCorrect ? "text-emerald-600" : "text-red-600"}`}>
              {isCorrect ? "✅ 答對了！" : `❌ 正確答案是 ${String.fromCharCode(65 + challenge.answer)}. ${challenge.options[challenge.answer]}`}
            </div>
            <div className="bg-white/60 rounded-xl p-4 mb-4 text-sm text-slate-600">
              💡 {challenge.explanation}
            </div>

            <div className="text-center text-xs text-slate-500 mb-3">明天還有新挑戰，記得回來！</div>

            <ShareButtons
              text={`我完成了今天的學習挑戰（${challenge.category}）${isCorrect ? "，答對了！" : ""}你也來試試 ✨`}
              url="/"
            />

            <div className="text-center mt-4">
              <a href={challenge.categoryLink}
                className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-semibold no-underline hover:underline">
                👉 想練更多？去{challenge.category}看看 →
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
