"use client";

import { useState } from "react";
import { flashCards, quizItems } from "@/data/finance/modules/money-basics";
import { playCorrect, playWrong, playPerfect } from "@/lib/sounds";

export default function MoneyBasics() {
  const [mode, setMode] = useState<"cards" | "quiz">("cards");

  return (
    <div>
      <div className="flex gap-2 justify-center mb-6">
        <button onClick={() => setMode("cards")}
          className={`px-5 py-2 rounded-xl font-bold text-sm border-none cursor-pointer transition ${mode === "cards" ? "bg-amber-500 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
          📇 知識卡片
        </button>
        <button onClick={() => setMode("quiz")}
          className={`px-5 py-2 rounded-xl font-bold text-sm border-none cursor-pointer transition ${mode === "quiz" ? "bg-amber-500 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
          ❓ 小測驗
        </button>
      </div>

      {mode === "cards" ? <FlashCardView /> : <QuizView />}
    </div>
  );
}

function FlashCardView() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = flashCards[idx];

  return (
    <div>
      <div className="text-center text-sm text-slate-400 mb-3">第 {idx + 1} / {flashCards.length} 張</div>
      <div onClick={() => setFlipped(!flipped)}
        className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm cursor-pointer min-h-[200px] flex flex-col items-center justify-center transition-all hover:shadow-md">
        <div className="text-4xl mb-4">{card.icon}</div>
        {!flipped ? (
          <>
            <h3 className="text-xl font-bold text-slate-800 text-center">{card.front}</h3>
            <p className="text-sm text-slate-400 mt-3">👆 點一下翻面</p>
          </>
        ) : (
          <>
            <p className="text-slate-600 leading-7 text-center">{card.back}</p>
            <p className="text-sm text-slate-400 mt-3">👆 再點一下翻回</p>
          </>
        )}
      </div>
      <div className="flex gap-3 justify-center mt-4">
        <button onClick={() => { setIdx(Math.max(0, idx - 1)); setFlipped(false); }}
          disabled={idx === 0}
          className="px-5 py-2 rounded-xl border-2 border-slate-200 text-slate-600 font-bold cursor-pointer bg-white hover:bg-slate-50 disabled:opacity-40 transition">
          ← 上一張
        </button>
        <button onClick={() => { setIdx(Math.min(flashCards.length - 1, idx + 1)); setFlipped(false); }}
          disabled={idx === flashCards.length - 1}
          className="px-5 py-2 rounded-xl bg-[#2457A7] text-white font-bold cursor-pointer border-none hover:bg-[#1d4688] disabled:opacity-40 transition">
          下一張 →
        </button>
      </div>
    </div>
  );
}

function QuizView() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = quizItems[idx];

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answer) { setScore(s => s + 1); playCorrect(); }
    else playWrong();
  };

  const handleNext = () => {
    if (idx + 1 >= quizItems.length) {
      setDone(true);
      if (score + (selected === q.answer ? 1 : 0) >= quizItems.length) playPerfect();
    } else {
      setIdx(idx + 1);
      setSelected(null);
    }
  };

  if (done) {
    const pct = Math.round((score / quizItems.length) * 100);
    return (
      <div className="text-center bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="text-5xl mb-3">{pct >= 80 ? "🎉" : "💪"}</div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">測驗完成！</h2>
        <div className="text-4xl font-black text-amber-500 my-3">{score} / {quizItems.length}</div>
        <div className="text-sm text-slate-500 mb-4">正確率 {pct}%</div>
        <button onClick={() => { setIdx(0); setSelected(null); setScore(0); setDone(false); }}
          className="px-6 py-2.5 rounded-xl bg-[#2457A7] text-white font-bold cursor-pointer border-none hover:bg-[#1d4688] transition">🔄 再做一次</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-slate-400">第 {idx + 1} / {quizItems.length} 題</span>
        <span className="text-sm font-bold text-emerald-600">✅ {score}</span>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-4">{q.question}</h3>
      <div className="space-y-2.5">
        {q.options.map((opt, i) => {
          let cls = "bg-slate-50 border-slate-200 hover:bg-slate-100";
          if (selected !== null) {
            if (i === q.answer) cls = "bg-emerald-50 border-emerald-400 text-emerald-700";
            else if (i === selected) cls = "bg-red-50 border-red-400 text-red-700";
          }
          return (
            <button key={i} onClick={() => handleSelect(i)}
              className={`w-full text-left p-3.5 rounded-xl border-2 font-medium cursor-pointer transition ${cls}`}>
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="mt-4">
          <div className={`p-3 rounded-xl text-sm ${selected === q.answer ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {q.explanation}
          </div>
          <button onClick={handleNext}
            className="mt-3 px-5 py-2 rounded-xl bg-[#2457A7] text-white font-bold cursor-pointer border-none hover:bg-[#1d4688] transition">
            {idx + 1 >= quizItems.length ? "看結果 →" : "下一題 →"}
          </button>
        </div>
      )}
    </div>
  );
}
