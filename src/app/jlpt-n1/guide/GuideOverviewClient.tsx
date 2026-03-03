"use client";
import { useState } from "react";
import EbookModal from "@/components/EbookModal";

interface UnitSummary {
  id: number;
  title: string;
  icon: string;
  hasGuide: boolean;
  estimatedTime: string;
  learningGoal: string;
}

interface Props {
  toolName: string;
  level: string;
  toolSlug: string;
  ebookSlug: string;
  units: UnitSummary[];
}

export default function GuideOverviewClient({ toolName, level, toolSlug, ebookSlug, units }: Props) {
  const [ebookOpen, setEbookOpen] = useState(false);
  const basePath = toolSlug === "gept" ? `/${level}` : `/jlpt-${level}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <a href={basePath} className="text-sm text-indigo-500 hover:underline no-underline">
        ← 返回{toolName}
      </a>
      <div className="mt-4 mb-6">
        <div className="text-3xl mb-2">👩</div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">{toolName} 家長陪伴指南</h1>
        <p className="text-slate-500 text-sm">不知道怎麼陪孩子學？30 秒看完就知道今天陪什麼、怎麼陪、要多久。</p>
      </div>
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-200 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="font-bold text-slate-800 text-sm">📚 想要離線看？</div>
            <div className="text-xs text-slate-500">免費索取精美 PDF 電子書版本</div>
          </div>
          <button onClick={() => setEbookOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm cursor-pointer border-none hover:bg-indigo-700 transition">免費索取</button>
        </div>
      </div>
      <div className="space-y-3">
        {units.map((u) => (
          <a key={u.id} href={u.hasGuide ? `${basePath}/guide/unit-${String(u.id).padStart(2, "0")}` : undefined} className={`block bg-white rounded-xl p-4 border border-slate-200 shadow-sm no-underline transition ${u.hasGuide ? "hover:border-indigo-300 hover:shadow-md cursor-pointer" : "opacity-50"}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{u.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800 text-sm">第 {u.id} 單元：{u.title}</div>
                {u.learningGoal && <div className="text-xs text-slate-500 mt-0.5 truncate">{u.learningGoal}</div>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-400">⏱️ {u.estimatedTime}</span>
                {u.hasGuide && <span className="text-indigo-500">→</span>}
              </div>
            </div>
          </a>
        ))}
      </div>
      <EbookModal toolName={toolName} ebookSlug={ebookSlug} isOpen={ebookOpen} onClose={() => setEbookOpen(false)} />
    </div>
  );
}
