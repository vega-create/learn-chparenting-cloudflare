"use client";

import { useState } from "react";
import { scenarios } from "@/data/finance/modules/red-envelope";
import { playCorrect, playVictory } from "@/lib/sounds";

export default function RedEnvelope() {
  const [scnIdx, setScnIdx] = useState(0);
  const [savings, setSavings] = useState(0);
  const [spending, setSpending] = useState(0);
  const [sharing, setSharing] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const scenario = scenarios[scnIdx];
  const total = savings + spending + sharing;
  const remaining = scenario.amount - total;
  const isValid = remaining === 0 && savings >= 0 && spending >= 0 && sharing >= 0;

  const handleSubmit = () => {
    if (!isValid) return;
    setSubmitted(true);
    setCompletedCount((c) => c + 1);
    playCorrect();
  };

  const handleNext = () => {
    const next = (scnIdx + 1) % scenarios.length;
    setScnIdx(next);
    setSavings(0);
    setSpending(0);
    setSharing(0);
    setSubmitted(false);
  };

  const handleAutoDistribute = () => {
    const { suggestedSplit } = scenario;
    setSavings(suggestedSplit.savings);
    setSpending(suggestedSplit.spending);
    setSharing(suggestedSplit.sharing);
  };

  const savingsPct = scenario.amount > 0 ? Math.round((savings / scenario.amount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="text-center text-sm text-slate-400">
        已完成 {completedCount} 個情境 · 第 {scnIdx + 1} / {scenarios.length} 題
      </div>

      {/* Scenario card */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
        <h2 className="text-lg font-bold text-slate-800 mb-2">{scenario.title}</h2>
        <p className="text-slate-600 mb-3">{scenario.description}</p>
        <div className="text-center">
          <div className="text-3xl font-black text-red-600">NT${scenario.amount.toLocaleString()}</div>
        </div>
      </div>

      {/* Allocation sliders */}
      {!submitted ? (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">💰 分配你的錢</h3>

          <div className={`text-center mb-4 p-2 rounded-xl text-sm font-bold ${isValid ? "bg-emerald-50 text-emerald-700" : remaining > 0 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"}`}>
            {isValid ? "✅ 分配完成！" : remaining > 0 ? `還剩 NT$${remaining} 可以分配` : `超出 NT$${Math.abs(remaining)}！`}
          </div>

          {[
            { label: "💰 儲蓄", value: savings, setter: setSavings, color: "#10b981" },
            { label: "🛒 花費", value: spending, setter: setSpending, color: "#3b82f6" },
            { label: "❤️ 分享", value: sharing, setter: setSharing, color: "#f59e0b" },
          ].map((item) => (
            <div key={item.label} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm text-slate-700">{item.label}</span>
                <span className="text-sm font-bold" style={{ color: item.color }}>NT${item.value}</span>
              </div>
              <input type="range" min={0} max={scenario.amount} step={50}
                value={item.value} onChange={(e) => item.setter(parseInt(e.target.value))}
                className="range-slider"
                style={{ '--slider-color': item.color } as React.CSSProperties} />
            </div>
          ))}

          <div className="flex gap-3 mt-4">
            <button onClick={handleAutoDistribute}
              className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm cursor-pointer bg-white hover:bg-slate-50 transition">
              🤖 參考建議
            </button>
            <button onClick={handleSubmit} disabled={!isValid}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm cursor-pointer border-none hover:bg-red-600 disabled:opacity-40 transition">
              ✅ 確認分配
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 text-center">📊 你的分配 vs 建議分配</h3>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "💰 儲蓄", mine: savings, suggested: scenario.suggestedSplit.savings },
              { label: "🛒 花費", mine: spending, suggested: scenario.suggestedSplit.spending },
              { label: "❤️ 分享", mine: sharing, suggested: scenario.suggestedSplit.sharing },
            ].map((item) => (
              <div key={item.label} className="text-center bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-sm font-bold text-slate-700 mb-2">{item.label}</div>
                <div className="text-lg font-black text-slate-800">NT${item.mine}</div>
                <div className="text-xs text-slate-400 mt-1">建議 NT${item.suggested}</div>
              </div>
            ))}
          </div>

          {/* Feedback */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-sm text-slate-600 mb-4">
            {savingsPct >= 50 ? "🌟 你存了超過一半，太厲害了！未來的你會感謝現在的你。" :
             savingsPct >= 30 ? "👍 不錯的分配！存了三成以上是個好習慣。" :
             savingsPct >= 10 ? "💡 試試看多存一點，養成儲蓄的好習慣。" :
             "⚠️ 建議至少存一些錢，即使只是一小部分也好。每一點儲蓄都是未來的力量！"}
          </div>

          <button onClick={handleNext}
            className="w-full py-3 rounded-xl bg-red-500 text-white font-bold cursor-pointer border-none hover:bg-red-600 transition">
            下一個情境 →
          </button>
        </div>
      )}
    </div>
  );
}
