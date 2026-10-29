"use client";

import { useState } from "react";
import { expenseCategories, sampleTransactions, badges } from "@/data/finance/modules/expense-tracker";
import { playCorrect, playPerfect, playVictory } from "@/lib/sounds";

interface Transaction {
  day: number;
  desc: string;
  amount: number;
  categoryId: string;
}

export default function ExpenseTracker() {
  const [phase, setPhase] = useState<"intro" | "tracking" | "summary">("intro");
  const [budget, setBudget] = useState(300);
  const [currentDay, setCurrentDay] = useState(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newDesc, setNewDesc] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState("food");

  const dayTransactions = transactions.filter((t) => t.day === currentDay);
  const totalSpent = transactions.reduce((s, t) => s + (t.categoryId !== "savings" ? t.amount : 0), 0);
  const totalSaved = transactions.reduce((s, t) => s + (t.categoryId === "savings" ? t.amount : 0), 0);
  const remaining = budget - totalSpent - totalSaved;

  const earnedBadges = badges.filter((b) => {
    if (b.id === "first-entry") return transactions.length > 0;
    if (b.id === "saver") return transactions.filter((t) => t.categoryId === "savings").length >= 3;
    if (b.id === "tracker") return new Set(transactions.map((t) => t.day)).size >= 7;
    if (b.id === "budget-keeper") return totalSpent + totalSaved <= budget;
    if (b.id === "generous") return transactions.some((t) => t.categoryId === "gifts");
    return false;
  });

  const addTransaction = () => {
    if (!newDesc || !newAmount) return;
    const t: Transaction = {
      day: currentDay,
      desc: newDesc,
      amount: parseInt(newAmount),
      categoryId: newCategory,
    };
    setTransactions([...transactions, t]);
    setNewDesc("");
    setNewAmount("");
    setShowAdd(false);
    playCorrect();
  };

  const addSampleForDay = () => {
    const samples = sampleTransactions.filter((s) => s.day === currentDay);
    setTransactions([...transactions, ...samples]);
    playCorrect();
  };

  const handleFinish = () => {
    setPhase("summary");
    if (totalSpent + totalSaved <= budget) playPerfect();
    else playVictory();
  };

  if (phase === "intro") {
    return (
      <div className="text-center bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="text-5xl mb-3">📝</div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">模擬記帳 7 天</h2>
        <p className="text-slate-600 text-sm mb-4">
          設定你的每週預算，然後記錄每天的花費。看看你能不能在 7 天內不超過預算！
        </p>
        <div className="mb-4">
          <label className="text-sm font-bold text-slate-700 block mb-2">每週預算</label>
          <div className="flex gap-2 justify-center flex-wrap">
            {[200, 300, 500, 700].map((amt) => (
              <button key={amt} onClick={() => setBudget(amt)}
                className={`px-5 py-2 rounded-xl font-bold cursor-pointer transition border-2 ${budget === amt ? "border-violet-400 bg-violet-50 text-violet-700" : "border-slate-200 bg-white text-slate-600"}`}>
                NT${amt}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setPhase("tracking")}
          className="px-8 py-3 rounded-xl bg-[#2457A7] text-white font-bold text-lg cursor-pointer border-none hover:bg-[#1d4688] transition">
          開始記帳 ✏️
        </button>
      </div>
    );
  }

  if (phase === "summary") {
    const categoryTotals = expenseCategories.map((cat) => ({
      ...cat,
      total: transactions.filter((t) => t.categoryId === cat.id).reduce((s, t) => s + t.amount, 0),
    })).filter((c) => c.total > 0);

    return (
      <div className="space-y-6">
        <div className="text-center bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="text-5xl mb-3">{totalSpent + totalSaved <= budget ? "🎉" : "💪"}</div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">7 天記帳完成！</h2>
          <div className="grid grid-cols-3 gap-4 my-4">
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-xs text-slate-400">預算</div>
              <div className="text-lg font-black text-slate-800">NT${budget}</div>
            </div>
            <div className="bg-red-50 rounded-xl p-3">
              <div className="text-xs text-slate-400">支出</div>
              <div className="text-lg font-black text-red-600">NT${totalSpent}</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3">
              <div className="text-xs text-slate-400">儲蓄</div>
              <div className="text-lg font-black text-emerald-600">NT${totalSaved}</div>
            </div>
          </div>
          <div className={`text-sm font-bold ${remaining >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            {remaining >= 0 ? `🎊 還剩 NT$${remaining}，守住預算了！` : `⚠️ 超支 NT$${Math.abs(remaining)}`}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-3">📊 花費分類</h3>
          <div className="space-y-2">
            {categoryTotals.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3">
                <span className="text-xl w-8 text-center">{cat.icon}</span>
                <span className="text-sm text-slate-700 w-16">{cat.label}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                  <div className="h-full bg-violet-400 rounded-full" style={{ width: `${Math.min(100, (cat.total / budget) * 100)}%` }} />
                </div>
                <span className="text-sm font-bold text-slate-600 w-16 text-right">NT${cat.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
          <h3 className="font-bold text-slate-800 mb-3">🏅 獲得徽章</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {badges.map((badge) => {
              const earned = earnedBadges.some((b) => b.id === badge.id);
              return (
                <div key={badge.id} className={`p-3 rounded-xl text-center ${earned ? "bg-white border border-amber-200" : "bg-slate-100 opacity-50"}`}>
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className="text-xs font-bold text-slate-700">{badge.name}</div>
                  <div className="text-xs text-slate-400">{badge.condition}</div>
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={() => { setPhase("intro"); setTransactions([]); setCurrentDay(1); }}
          className="w-full py-3 rounded-xl bg-[#2457A7] text-white font-bold cursor-pointer border-none hover:bg-[#1d4688] transition">
          🔄 重新開始
        </button>
      </div>
    );
  }

  // Tracking phase
  return (
    <div className="space-y-4">
      {/* Day header + budget bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-slate-800">📅 第 {currentDay} 天</h2>
          <span className={`text-sm font-bold ${remaining >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            剩餘 NT${remaining}
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${remaining >= 0 ? "bg-emerald-400" : "bg-red-400"}`}
            style={{ width: `${Math.min(100, ((totalSpent + totalSaved) / budget) * 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>NT$0</span>
          <span>預算 NT${budget}</span>
        </div>
      </div>

      {/* Day navigation */}
      <div className="flex gap-1 justify-center">
        {[1, 2, 3, 4, 5, 6, 7].map((d) => (
          <button key={d} onClick={() => setCurrentDay(d)}
            className={`w-9 h-9 rounded-lg font-bold text-sm cursor-pointer transition border-none ${currentDay === d ? "bg-violet-500 text-white" : transactions.some((t) => t.day === d) ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-500"}`}>
            {d}
          </button>
        ))}
      </div>

      {/* Today's transactions */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-700 mb-3">今天的花費</h3>
        {dayTransactions.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">還沒有記錄</p>
        ) : (
          <div className="space-y-2">
            {dayTransactions.map((t, i) => {
              const cat = expenseCategories.find((c) => c.id === t.categoryId);
              return (
                <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                  <span className="text-lg">{cat?.icon || "📦"}</span>
                  <span className="text-sm text-slate-700 flex-1">{t.desc}</span>
                  <span className="text-sm font-bold text-slate-600">NT${t.amount}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Add buttons */}
        <div className="flex gap-2 mt-3">
          <button onClick={() => setShowAdd(!showAdd)}
            className="flex-1 py-2 rounded-xl bg-[#2457A7] text-white font-bold text-sm cursor-pointer border-none hover:bg-[#1d4688] transition">
            ➕ 新增記錄
          </button>
          {dayTransactions.length === 0 && (
            <button onClick={addSampleForDay}
              className="flex-1 py-2 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm cursor-pointer bg-white hover:bg-slate-50 transition">
              📋 使用範例
            </button>
          )}
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
              placeholder="描述（例：珍珠奶茶）"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-violet-400 focus:outline-none" />
            <input type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)}
              placeholder="金額"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-violet-400 focus:outline-none" />
            <div className="flex flex-wrap gap-1">
              {expenseCategories.map((cat) => (
                <button key={cat.id} onClick={() => setNewCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs cursor-pointer transition border ${newCategory === cat.id ? "border-violet-400 bg-violet-50 text-violet-700" : "border-slate-200 bg-white text-slate-600"}`}>
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
            <button onClick={addTransaction}
              className="w-full py-2 rounded-lg bg-[#2457A7] text-white font-bold text-sm cursor-pointer border-none hover:bg-[#1d4688] transition">
              ✅ 儲存
            </button>
          </div>
        )}
      </div>

      {/* Finish button */}
      {currentDay >= 7 && transactions.length > 0 && (
        <button onClick={handleFinish}
          className="w-full py-3 rounded-xl bg-[#2457A7] text-white font-bold cursor-pointer border-none hover:bg-[#1d4688] transition">
          📊 查看 7 天總結
        </button>
      )}

      {/* Next day */}
      {currentDay < 7 && (
        <button onClick={() => setCurrentDay((d) => Math.min(7, d + 1))}
          className="w-full py-2 rounded-xl border-2 border-slate-200 text-slate-600 font-bold cursor-pointer bg-white hover:bg-slate-50 transition">
          到第 {currentDay + 1} 天 →
        </button>
      )}
    </div>
  );
}
