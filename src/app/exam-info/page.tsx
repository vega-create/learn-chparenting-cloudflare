import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "全民英檢報名時間費用 + JLPT 日檢報名資訊 2025–2026 | learn.chparenting.com",
  description:
    "2025–2026 全民英檢 GEPT 報名時間、考試日期、報名費用一覽表。JLPT 日本語能力試驗報名資訊、測驗日期、N1–N5 各級費用。最完整的報考資訊整理。",
  keywords:
    "全民英檢報名, 全民英檢考試時間, 全民英檢報名費用, 全民英檢2026, GEPT報名, JLPT報名, 日檢報名, 日本語能力試驗, JLPT考試時間, JLPT報名費用, N1報名, N2報名",
  alternates: { canonical: "https://learn.chparenting.com/exam-info" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "2026 年全民英檢什麼時候報名？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2026 年全民英檢分為三梯次：第一梯次約 1 月報名、4 月考試；第二梯次約 5 月報名、8 月考試；第三梯次約 9 月報名、12 月考試。詳情請參考 LTTC 官網公告。",
      },
    },
    {
      "@type": "Question",
      name: "JLPT 日檢什麼時候考試？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JLPT 每年舉辦兩次：第一回在 7 月第一個週日，第二回在 12 月第一個週日。台灣地區報名通常在考前 3–4 個月開放。",
      },
    },
    {
      "@type": "Question",
      name: "全民英檢初級報名費多少錢？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "全民英檢初級聽力閱讀測驗報名費為 NT$530，口說寫作測驗報名費為 NT$660。",
      },
    },
  ],
};

const GEPT_LEVELS = [
  {
    level: "初級",
    eng: "Elementary",
    target: "國中程度",
    listenRead: "NT$530",
    speakWrite: "NT$660",
    href: "/elementary",
  },
  {
    level: "中級",
    eng: "Intermediate",
    target: "高中程度",
    listenRead: "NT$750",
    speakWrite: "NT$890",
    href: "/intermediate",
  },
  {
    level: "中高級",
    eng: "Upper-Intermediate",
    target: "大學程度",
    listenRead: "NT$900",
    speakWrite: "NT$1,100",
    href: "/upper-intermediate",
  },
];

const GEPT_SCHEDULE = [
  {
    year: "2025",
    sessions: [
      { session: "第一梯次", level: "初級", register: "1 月", exam: "4 月" },
      { session: "第二梯次", level: "中級", register: "5 月", exam: "8 月" },
      {
        session: "第三梯次",
        level: "中高級",
        register: "9 月",
        exam: "12 月",
      },
    ],
  },
  {
    year: "2026",
    sessions: [
      { session: "第一梯次", level: "初級", register: "1 月", exam: "4 月" },
      { session: "第二梯次", level: "中級", register: "5 月", exam: "8 月" },
      {
        session: "第三梯次",
        level: "中高級",
        register: "9 月",
        exam: "12 月",
      },
    ],
  },
];

const JLPT_LEVELS = [
  { level: "N5", name: "入門", desc: "基本日語能力", href: "/jlpt-n5" },
  { level: "N4", name: "基礎", desc: "基礎日語能力", href: "/jlpt-n4" },
  { level: "N3", name: "中級", desc: "日常場景溝通", href: "/jlpt-n3" },
  { level: "N2", name: "上級", desc: "日常進階溝通", href: "/jlpt-n2" },
  { level: "N1", name: "最上級", desc: "廣泛場景溝通", href: "/jlpt-n1" },
];

const JLPT_SCHEDULE = [
  {
    year: "2025",
    sessions: [
      { session: "第一回", register: "3 月下旬 – 4 月上旬", exam: "7 月第一個週日" },
      { session: "第二回", register: "8 月下旬 – 9 月上旬", exam: "12 月第一個週日" },
    ],
  },
  {
    year: "2026",
    sessions: [
      { session: "第一回", register: "3 月下旬 – 4 月上旬", exam: "7 月第一個週日" },
      { session: "第二回", register: "8 月下旬 – 9 月上旬", exam: "12 月第一個週日" },
    ],
  },
];

export default function ExamInfoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 標題 */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">📋</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">報考資訊</h1>
        <p className="text-slate-500">
          全民英檢 GEPT 與 日本語能力試驗 JLPT 報名時間、費用一覽
        </p>
      </div>

      {/* 提醒 */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-center">
        <p className="text-sm text-amber-700">
          ⚠️ 以下資料僅供參考，實際報名時間與費用請以各官方網站公告為準
        </p>
      </div>

      {/* ─── 全民英檢 GEPT ─── */}
      <section className="mb-10">
        <div className="bg-gradient-to-b from-rose-50/60 to-orange-50/40 rounded-2xl p-8 border border-rose-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            📘 全民英檢 GEPT
          </h2>

          {/* 級別與費用 */}
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-700 mb-3">
              考試級別與費用
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-rose-100/60">
                    <th className="text-left p-3 font-bold text-slate-700 rounded-tl-lg">
                      級別
                    </th>
                    <th className="text-left p-3 font-bold text-slate-700">
                      適用程度
                    </th>
                    <th className="text-right p-3 font-bold text-slate-700">
                      聽讀測驗
                    </th>
                    <th className="text-right p-3 font-bold text-slate-700 rounded-tr-lg">
                      說寫測驗
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {GEPT_LEVELS.map((l) => (
                    <tr
                      key={l.level}
                      className="border-t border-rose-100"
                    >
                      <td className="p-3 text-slate-800 font-medium">
                        <a
                          href={l.href}
                          className="text-rose-500 hover:underline no-underline"
                        >
                          {l.level} {l.eng}
                        </a>
                      </td>
                      <td className="p-3 text-slate-600">{l.target}</td>
                      <td className="p-3 text-slate-600 text-right">
                        {l.listenRead}
                      </td>
                      <td className="p-3 text-slate-600 text-right">
                        {l.speakWrite}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 考試時程 */}
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-700 mb-3">
              考試時程表
            </h3>
            {GEPT_SCHEDULE.map((y) => (
              <div key={y.year} className="mb-4">
                <div className="text-sm font-bold text-rose-500 mb-2">
                  {y.year} 年
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-rose-100/40">
                        <th className="text-left p-2.5 font-bold text-slate-700">
                          梯次
                        </th>
                        <th className="text-left p-2.5 font-bold text-slate-700">
                          級別
                        </th>
                        <th className="text-left p-2.5 font-bold text-slate-700">
                          報名期間
                        </th>
                        <th className="text-left p-2.5 font-bold text-slate-700">
                          考試月份
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {y.sessions.map((s) => (
                        <tr
                          key={s.session}
                          className="border-t border-rose-100"
                        >
                          <td className="p-2.5 text-slate-600">
                            {s.session}
                          </td>
                          <td className="p-2.5 text-slate-600">{s.level}</td>
                          <td className="p-2.5 text-slate-600">
                            {s.register}
                          </td>
                          <td className="p-2.5 text-slate-600">{s.exam}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* 報名方式 */}
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-700 mb-3">
              報名方式
            </h3>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">1.</span>
                <p>至 LTTC 全民英檢官網線上報名</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">2.</span>
                <p>準備身分證明文件與近期照片</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">3.</span>
                <p>繳費完成即報名成功，考前寄發准考證</p>
              </div>
            </div>
          </div>

          <a
            href="https://www.lttc.ntu.edu.tw/gept.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-500 font-semibold text-sm hover:bg-rose-100 transition no-underline"
          >
            🔗 LTTC 全民英檢官網
          </a>
        </div>
      </section>

      {/* ─── JLPT 日本語能力試驗 ─── */}
      <section className="mb-10">
        <div className="bg-gradient-to-b from-red-50/60 to-orange-50/40 rounded-2xl p-8 border border-red-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            🇯🇵 日本語能力試驗 JLPT
          </h2>

          {/* 級別說明 */}
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-700 mb-3">
              考試級別說明
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-red-100/40">
                    <th className="text-left p-3 font-bold text-slate-700 rounded-tl-lg">
                      級別
                    </th>
                    <th className="text-left p-3 font-bold text-slate-700">
                      程度
                    </th>
                    <th className="text-left p-3 font-bold text-slate-700">
                      說明
                    </th>
                    <th className="text-right p-3 font-bold text-slate-700 rounded-tr-lg">
                      報名費（台灣）
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {JLPT_LEVELS.map((l) => (
                    <tr
                      key={l.level}
                      className="border-t border-red-100"
                    >
                      <td className="p-3 text-slate-800 font-medium">
                        <a
                          href={l.href}
                          className="text-red-500 hover:underline no-underline"
                        >
                          {l.level}
                        </a>
                      </td>
                      <td className="p-3 text-slate-600">{l.name}</td>
                      <td className="p-3 text-slate-600">{l.desc}</td>
                      <td className="p-3 text-slate-600 text-right">
                        NT$1,500
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 考試時程 */}
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-700 mb-3">
              考試時程表
            </h3>
            {JLPT_SCHEDULE.map((y) => (
              <div key={y.year} className="mb-4">
                <div className="text-sm font-bold text-red-500 mb-2">
                  {y.year} 年
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-red-100/40">
                        <th className="text-left p-2.5 font-bold text-slate-700">
                          回次
                        </th>
                        <th className="text-left p-2.5 font-bold text-slate-700">
                          報名期間
                        </th>
                        <th className="text-left p-2.5 font-bold text-slate-700">
                          考試日期
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {y.sessions.map((s) => (
                        <tr
                          key={s.session}
                          className="border-t border-red-100"
                        >
                          <td className="p-2.5 text-slate-600">
                            {s.session}
                          </td>
                          <td className="p-2.5 text-slate-600">
                            {s.register}
                          </td>
                          <td className="p-2.5 text-slate-600">{s.exam}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* 報名方式 */}
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-700 mb-3">
              報名方式
            </h3>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">1.</span>
                <p>台灣考區由 LTTC（財團法人語言訓練測驗中心）代辦</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">2.</span>
                <p>報名期間至 LTTC 日檢專頁線上報名</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">3.</span>
                <p>可同時報考不同級別，但同一級別每回只能報名一次</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.lttc.ntu.edu.tw/JLPT.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-500 font-semibold text-sm hover:bg-red-100 transition no-underline"
            >
              🔗 LTTC 日檢報名（台灣）
            </a>
            <a
              href="https://www.jlpt.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-500 font-semibold text-sm hover:bg-red-100 transition no-underline"
            >
              🔗 JLPT 國際官網
            </a>
          </div>
        </div>
      </section>

      {/* ─── 考試準備建議 ─── */}
      <section className="mb-10">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-5">
            💡 考試準備建議
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50">
              <span className="text-xl mt-0.5">📘</span>
              <div>
                <div className="font-bold text-slate-800 text-sm">
                  全民英檢準備
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  按照「單字 → 文法 → 聽力 → 閱讀 → 口說 → 寫作」的順序練習效果最好。
                  使用本平台的模擬測驗了解考試題型。
                </p>
                <a
                  href="/elementary"
                  className="inline-block mt-2 text-sm text-rose-500 font-semibold no-underline hover:underline"
                >
                  前往英檢練習 →
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50">
              <span className="text-xl mt-0.5">🇯🇵</span>
              <div>
                <div className="font-bold text-slate-800 text-sm">
                  JLPT 日檢準備
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  從五十音開始，搭配單字、文法、聽力循序漸進。建議考前 2–3
                  個月密集練習模擬試題。
                </p>
                <a
                  href="/jlpt-n5"
                  className="inline-block mt-2 text-sm text-red-500 font-semibold no-underline hover:underline"
                >
                  前往日文練習 →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl p-8 border border-rose-200 text-center">
        <div className="text-3xl mb-3">🎯</div>
        <p className="text-slate-700 font-medium mb-2">
          不管你準備的是英檢還是日檢
        </p>
        <p className="text-sm text-slate-500 mb-5">
          本平台提供完全免費的互動式練習，幫助你更有效率地備考！
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <a
            href="/elementary"
            className="px-6 py-2.5 bg-rose-300 text-white rounded-xl font-semibold text-sm hover:bg-rose-400 transition no-underline"
          >
            📘 英檢練習
          </a>
          <a
            href="/jlpt-n5"
            className="px-6 py-2.5 bg-red-400 text-white rounded-xl font-semibold text-sm hover:bg-red-500 transition no-underline"
          >
            🇯🇵 日文練習
          </a>
        </div>
      </div>

      {/* 最後更新時間 */}
      <div className="text-center mt-6">
        <p className="text-xs text-slate-400">
          資料最後更新：2026 年 3 月 ｜ 實際資訊請以各主辦單位官方公告為準
        </p>
      </div>
    </div>
  );
}
