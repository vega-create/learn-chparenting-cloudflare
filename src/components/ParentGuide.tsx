"use client";
import { useState } from "react";
import EbookModal from "@/components/EbookModal";

export interface GuideContent {
  todayTopic: string;
  estimatedTime: string;
  learningGoal: string;
  guidanceText: string;
  passChecklist: string[];
  commonIssues: string;
}

interface ParentGuideProps {
  unitTitle: string;
  unitId: string;
  level: string;
  toolSlug: string;
  toolName: string;
  ebookSlug: string;
  color: string;
  guide: GuideContent;
  pdfUrl?: string;
  nextGuideUrl?: string;
  unitUrl: string;       // link back to the unit learning page
}

export default function ParentGuide({
  unitTitle, unitId, level, toolSlug, toolName, ebookSlug, color,
  guide, pdfUrl, nextGuideUrl, unitUrl,
}: ParentGuideProps) {
  const [ebookOpen, setEbookOpen] = useState(false);
  const basePath = toolSlug === "gept" ? `/${level}` : `/jlpt-${level}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <a href={`${basePath}/guide`} className="text-sm text-indigo-500 hover:underline no-underline">
        ← 返回{toolName}指南總覽
      </a>

      <div className="mt-4 mb-6">
        <div className="text-3xl mb-2">👩</div>
        <h1 className="text-2xl font-black text-slate-800 mb-1">
          給爸媽的 30 秒提示
        </h1>
        <p className="text-sm text-slate-500">{unitTitle}</p>
      </div>

      {/* Main guide card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6 space-y-5">
        {/* Topic */}
        <div>
          <div className="text-sm font-bold text-slate-500 mb-1">📌 今天練的是</div>
          <div className="text-lg font-bold text-slate-800">{guide.todayTopic}</div>
        </div>

        {/* Time + Goal */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
            <span>⏱️</span>
            <span className="text-sm text-slate-600">預計 {guide.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
            <span>🎯</span>
            <span className="text-sm text-slate-600">{guide.learningGoal}</span>
          </div>
        </div>

        {/* Guidance */}
        <div>
          <div className="text-sm font-bold text-slate-500 mb-2">💡 陪伴方式</div>
          <div className="text-slate-700 leading-relaxed whitespace-pre-line">
            {guide.guidanceText}
          </div>
        </div>

        {/* Checklist */}
        <div>
          <div className="text-sm font-bold text-slate-500 mb-2">✅ 孩子做到這些就算過關</div>
          <ul className="space-y-1.5">
            {guide.passChecklist.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-700">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Common issues */}
        <div>
          <div className="text-sm font-bold text-slate-500 mb-2">⚠️ 常見問題</div>
          <div className="text-slate-700 leading-relaxed bg-amber-50 rounded-lg p-3 border border-amber-100">
            {guide.commonIssues}
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex gap-3 flex-wrap mb-6">
        {pdfUrl && (
          <a
            href={pdfUrl}
            download
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm no-underline hover:bg-indigo-700 transition"
          >
            📥 下載練習單
          </a>
        )}
        <button
          onClick={() => setEbookOpen(true)}
          className="flex items-center gap-2 px-5 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold text-sm cursor-pointer bg-transparent hover:bg-indigo-50 transition"
        >
          📚 索取完整指南
        </button>
        <a
          href={unitUrl}
          className="flex items-center gap-2 px-5 py-3 text-indigo-600 font-bold text-sm no-underline hover:underline"
        >
          📝 前往練習 →
        </a>
      </div>

      {nextGuideUrl && (
        <div className="text-center">
          <a href={nextGuideUrl} className="text-sm text-indigo-500 hover:underline no-underline">
            下一單元指南 →
          </a>
        </div>
      )}

      <EbookModal
        toolName={toolName}
        ebookSlug={ebookSlug}
        isOpen={ebookOpen}
        onClose={() => setEbookOpen(false)}
      />
    </div>
  );
}
