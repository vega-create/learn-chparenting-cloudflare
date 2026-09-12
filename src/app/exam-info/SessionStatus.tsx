"use client";

import { useEffect, useState } from "react";

/**
 * 依瀏覽者當天日期顯示一場考試的狀態。
 * 頁面本身是靜態建置，不能在伺服器端用 new Date() 判斷（會停在建置那天），
 * 所以放到瀏覽器端算；SSR 先輸出中性的「查看日期」避免 hydration 不一致。
 */
export function SessionStatus({ examDate, registerEnd }: { examDate: string; registerEnd: string }) {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    const d = new Date();
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    setToday(iso);
  }, []);
  if (!today) return <span className="text-xs text-slate-400">—</span>;
  if (today > examDate) return <span className="text-xs text-slate-400">已結束</span>;
  if (today <= registerEnd)
    return <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">報名中</span>;
  return <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">報名截止・待考</span>;
}
