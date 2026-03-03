"use client";
import { useState, useEffect } from "react";
import EbookModal from "@/components/EbookModal";

interface QuizAnswer {
  question: string;
  options: string[];
  answer: number;      // 0-indexed
  explanation: string;
}

interface AnswerPageProps {
  unitTitle: string;
  unitId: string;
  level: string;         // 'elementary' | 'intermediate' | ...
  toolSlug: string;      // 'gept' | 'japanese'
  toolName: string;      // 'GEPT 初級' | '日文 N5'
  ebookSlug: string;     // 'gept-elementary' | 'japanese-n5'
  color: string;         // primary color
  answers: QuizAnswer[];
  nextUnitUrl?: string;
  pdfUrl?: string;
}

const PARENT_GATE_KEY = "parent_answer_confirmed";

export default function AnswerPage({
  unitTitle, unitId, level, toolSlug, toolName, ebookSlug, color,
  answers, nextUnitUrl, pdfUrl,
}: AnswerPageProps) {
  const [ebookOpen, setEbookOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Clean up old localStorage value (migrated to sessionStorage)
      localStorage.removeItem(PARENT_GATE_KEY);
      // Use sessionStorage so the gate resets when browser is closed
      setConfirmed(sessionStorage.getItem(PARENT_GATE_KEY) === "true");
    }
  }, []);

  const handleConfirm = () => {
    sessionStorage.setItem(PARENT_GATE_KEY, "true");
    setConfirmed(true);
  };

  const colorMap: Record<string, string> = {
    blue: "text-blue-600 border-blue-200 bg-blue-50",
    emerald: "text-emerald-600 border-emerald-200 bg-emerald-50",
    rose: "text-rose-600 border-rose-200 bg-rose-50",
    purple: "text-purple-600 border-purple-200 bg-purple-50",
    indigo: "text-indigo-600 border-indigo-200 bg-indigo-50",
  };
  const answerColors = colorMap[color] || colorMap.blue;
  const basePath = toolSlug === "gept" ? `/${level}` : `/jlpt-${level}`;

  /* ─── Parent Confirmation Gate ─── */
  if (!confirmed) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
          <div className="text-5xl mb-4">👩‍👦</div>
          <h2 className="text-xl font-black text-slate-800 mb-3">
            答案區 — 家長專用
          </h2>
          <p className="text-slate-500 text-sm leading-6 mb-2">
            這裡的答案是給<strong>爸爸媽媽對照用</strong>的。
          </p>
          <p className="text-slate-500 text-sm leading-6 mb-6">
            建議小朋友先自己完成練習，<br/>
            再請家長幫忙對答案喔！
          </p>

          <button
            onClick={handleConfirm}
            className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-sm cursor-pointer border-none hover:bg-indigo-700 transition mb-3"
          >
            我是家長，查看答案
          </button>

          <a
            href={basePath}
            className="block text-sm text-slate-400 hover:text-slate-600 no-underline transition"
          >
            ← 返回{toolName}練習
          </a>
        </div>
      </div>
    );
  }

  /* ─── Answers (after confirmation) ─── */
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <a href={basePath} className={`text-sm ${answerColors.split(" ")[0]} hover:underline no-underline`}>
        ← 返回{toolName}
      </a>

      <h1 className="text-2xl font-black text-slate-800 mt-4 mb-2">
        🔑 {unitTitle} — 答案與解析
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        對照答案，了解每一題的解題思路
      </p>

      {/* Answers */}
      <div className="space-y-4 mb-8">
        {answers.map((a, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="text-sm text-slate-500 mb-1">第 {i + 1} 題</div>
            <div className="font-medium text-slate-800 mb-2">{a.question}</div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${answerColors} mb-2`}>
              答案：{String.fromCharCode(65 + a.answer)}. {a.options[a.answer]}
            </div>
            {a.explanation && (
              <div className="text-sm text-slate-600 mt-2 bg-slate-50 rounded-lg p-3">
                💡 {a.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl p-6 border border-slate-200 space-y-4">
        {pdfUrl && (
          <a
            href={pdfUrl}
            download
            className="flex items-center gap-2 justify-center w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm no-underline hover:bg-indigo-700 transition"
          >
            📥 下載練習單再練一次
          </a>
        )}
        <button
          onClick={() => setEbookOpen(true)}
          className="flex items-center gap-2 justify-center w-full py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold text-sm cursor-pointer bg-transparent hover:bg-indigo-50 transition"
        >
          📚 索取《{toolName}家長陪伴指南》
        </button>
        {nextUnitUrl && (
          <a
            href={nextUnitUrl}
            className="flex items-center gap-2 justify-center w-full py-3 text-indigo-600 font-bold text-sm no-underline hover:underline"
          >
            👉 下一單元 →
          </a>
        )}
      </div>

      <EbookModal
        toolName={toolName}
        ebookSlug={ebookSlug}
        isOpen={ebookOpen}
        onClose={() => setEbookOpen(false)}
      />
    </div>
  );
}
