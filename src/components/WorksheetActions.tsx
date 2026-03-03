"use client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface WorksheetActionsProps {
  toolSlug: string;   // 'gept' | 'japanese'
  level: string;      // 'elementary' | 'intermediate' | 'upper-intermediate' | 'n5' | 'n4' | 'n3' | 'n2' | 'n1'
  unitId: string;     // 'unit-01'
  unitName: string;   // '第一單元：自我介紹'
  color?: string;     // primary color for download button
}

export default function WorksheetActions({ toolSlug, level, unitId, unitName, color = "blue" }: WorksheetActionsProps) {
  const pdfUrl = `/worksheets/${toolSlug}/${level}/${unitId}.pdf`;
  // Map route paths: gept levels use /elementary, /intermediate, /upper-intermediate
  // Japanese levels use /jlpt-n5, /jlpt-n4, etc.
  const answerBase = toolSlug === "gept" ? `/${level}` : `/jlpt-${level}`;
  const answerUrl = `${answerBase}/answers/${unitId}`;

  const colorMap: Record<string, { bg: string; border: string; text: string; hover: string }> = {
    blue: { bg: "bg-blue-600 hover:bg-blue-700", border: "border-blue-600", text: "text-blue-600", hover: "hover:bg-blue-50" },
    emerald: { bg: "bg-emerald-600 hover:bg-emerald-700", border: "border-emerald-600", text: "text-emerald-600", hover: "hover:bg-emerald-50" },
    rose: { bg: "bg-rose-600 hover:bg-rose-700", border: "border-rose-600", text: "text-rose-600", hover: "hover:bg-rose-50" },
    purple: { bg: "bg-purple-600 hover:bg-purple-700", border: "border-purple-600", text: "text-purple-600", hover: "hover:bg-purple-50" },
    amber: { bg: "bg-amber-600 hover:bg-amber-700", border: "border-amber-600", text: "text-amber-600", hover: "hover:bg-amber-50" },
    cyan: { bg: "bg-cyan-600 hover:bg-cyan-700", border: "border-cyan-600", text: "text-cyan-600", hover: "hover:bg-cyan-50" },
    indigo: { bg: "bg-indigo-600 hover:bg-indigo-700", border: "border-indigo-600", text: "text-indigo-600", hover: "hover:bg-indigo-50" },
  };

  const c = colorMap[color] || colorMap.blue;

  const trackDownload = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "worksheet_download", {
        tool: toolSlug,
        level,
        unit: unitId,
      });
    }
  };

  const trackAnswer = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "answer_page_view", {
        tool: toolSlug,
        level,
        unit: unitId,
      });
    }
  };

  return (
    <div className="flex gap-3 flex-wrap">
      <a
        href={pdfUrl}
        download
        onClick={trackDownload}
        className={`flex items-center gap-2 px-4 py-3 ${c.bg} text-white rounded-lg font-bold text-sm no-underline transition`}
      >
        📥 下載練習單
      </a>
      <a
        href={answerUrl}
        onClick={trackAnswer}
        className={`flex items-center gap-2 px-4 py-3 border-2 ${c.border} ${c.text} rounded-lg font-bold text-sm no-underline ${c.hover} transition`}
      >
        🔑 查看答案
      </a>
    </div>
  );
}
