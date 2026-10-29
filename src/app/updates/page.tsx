import type { Metadata } from "next";
import { SITE_UPDATES } from "@/data/site-updates";

export const metadata: Metadata = {
  title: "全部公告｜最新消息與更新紀錄 - learn.chparenting.com",
  description: "親子多元學習平台的新增練習、功能更新與新文章，依日期排列。考試日期請見報考資訊。",
  alternates: { canonical: "https://learn.chparenting.com/updates" },
};

const KIND_STYLE: Record<string, string> = {
  "新增": "bg-rose-100 text-rose-700",
  "更新": "bg-sky-100 text-sky-700",
  "新文章": "bg-amber-100 text-amber-800",
};

export default function UpdatesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">全部公告</h1>
      <p className="text-slate-600 mb-6">
        首頁跑馬燈只放最新幾則，這裡是完整的更新紀錄。考試日期與報名時間請看
        <a href="/exam-info" className="mx-1 font-semibold text-[#2457A7]">報考資訊</a>。
      </p>
      <ul className="list-none m-0 p-0 divide-y divide-slate-200 bg-white rounded-2xl border border-slate-200">
        {SITE_UPDATES.map((u) => (
          <li key={`${u.date}-${u.href}-${u.text}`}>
            <a href={u.href} className="flex items-start gap-3 px-4 py-3 no-underline text-slate-800 hover:bg-slate-50">
              <span className="shrink-0 w-12 text-sm text-slate-500 pt-0.5">{u.date.slice(5).replace("-", "/")}</span>
              <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded mt-0.5 ${KIND_STYLE[u.kind] ?? ""}`}>{u.kind}</span>
              <span>{u.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
