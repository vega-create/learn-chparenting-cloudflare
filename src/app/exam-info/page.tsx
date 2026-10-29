import type { Metadata } from "next";
import { SessionStatus } from "./SessionStatus";
import PageHeader, { SectionTitle } from "@/components/PageHeader";
import SubjectIcon from "@/components/SubjectIcon";
import InfoIcon from "@/components/InfoPageIcons";

export const metadata: Metadata = {
  title:
    "全民英檢 2026 測驗日期、報名時間與費用（初級・中級・中高級）＋JLPT 日檢 | learn.chparenting.com",
  description:
    "2026 年全民英檢 GEPT 初級、中級、中高級每一場的測驗日期、報名期間、報名費（依 LTTC 官方日程整理，含 11/7 初級與 10/31 中級聽讀）。JLPT 日本語能力試驗報名資訊、測驗日期、N1–N5 各級費用。最完整的報考資訊整理。",
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
        text: "2026 年全民英檢初級聽讀有三場（1/3、6/6、11/7），說寫兩場（3/14–15、9/12–13）；中級聽讀 5/9、10/31，另有 1/24、8/1 一日考。每場報名約在考前 2 到 3 個月開放，11/7 初級聽讀報名延長至 9/16，10/31 中級聽讀至 9/17。2027 年日程已公告：初級聽讀 1/9、6/13、10/30；中級聽讀 1/30、5/8、8/14、11/6；中高級聽讀 5/22、9/25。實際以官網為準。",
      },
    },
    {
      "@type": "Question",
      name: "JLPT 日檢什麼時候考試？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JLPT 每年舉辦兩次，通常是 7 月和 12 月的第一個週日。台灣 2026 年第二回是 12/6（日），2027 年第一回是 7/4（日）。報名請見 jlpt.tw。",
      },
    },
    {
      "@type": "Question",
      name: "全民英檢初級報名費多少錢？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2026 年全民英檢初級聽讀（初試）報名費 NT$600，說寫（複試）兩項 NT$900，口說單項 NT$530、寫作單項 NT$370。中級聽讀 NT$850、說寫兩項 NT$1,550；中高級聽讀 NT$1,050、說寫兩項 NT$1,750。以報名系統為準。",
      },
    },
  ],
};

const GEPT_LEVELS = [
  {
    level: "初級",
    eng: "Elementary（CEFR A2）",
    target: "國中程度",
    listenRead: "NT$600",
    speakWrite: "NT$900（口說 530／寫作 370）",
    href: "/elementary",
  },
  {
    level: "中級",
    eng: "Intermediate（CEFR B1）",
    target: "高中程度",
    listenRead: "NT$850",
    speakWrite: "NT$1,550（口說 920／寫作 630）",
    href: "/intermediate",
  },
  {
    level: "中高級",
    eng: "Upper-Intermediate（CEFR B2）",
    target: "大學程度",
    listenRead: "NT$1,050",
    speakWrite: "NT$1,750（口說 1,020／寫作 730）",
    href: "/upper-intermediate",
  },
];

/**
 * 2026 年 GEPT 各級每一場的日程，抄自 LTTC 官方「2026 年 GEPT 測驗日期」
 * （gept.org.tw/info/GEPTschedule.pdf，2025-09-24 公告）。
 * 報名期間若官網後來延長，以 note 標註延長後的截止日。
 * 日期一律 ISO 字串，SessionStatus 會依瀏覽者當天日期顯示狀態。
 */
type GeptSession = {
  type: string;
  examLabel: string;
  examDate: string; // 最後一天，YYYY-MM-DD
  register: string;
  registerEnd: string; // YYYY-MM-DD
  note?: string;
};

const GEPT_SCHEDULE_2026: { level: string; sessions: GeptSession[] }[] = [
  {
    level: "初級",
    sessions: [
      { type: "聽讀（初試）", examLabel: "1/3（六）", examDate: "2026-01-03", register: "2025/10/1 – 11/10", registerEnd: "2025-11-10" },
      { type: "說寫（複試）", examLabel: "3/14（六）、15（日）", examDate: "2026-03-15", register: "1/2 – 1/23", registerEnd: "2026-01-23" },
      { type: "聽讀（初試）", examLabel: "6/6（六）", examDate: "2026-06-06", register: "3/9 – 4/13", registerEnd: "2026-04-13" },
      { type: "說寫（複試）", examLabel: "9/12（六）、13（日）", examDate: "2026-09-13", register: "6/15 – 7/20", registerEnd: "2026-07-20" },
      { type: "聽讀（初試）", examLabel: "11/7（六）", examDate: "2026-11-07", register: "7/29 – 9/16", registerEnd: "2026-09-16", note: "原訂 9/2 截止，官網延長至 9/16 下午 5:00；成績 11/18 公布" },
    ],
  },
  {
    level: "中級",
    sessions: [
      { type: "一日考（聽讀＋說寫）", examLabel: "1/24（六）", examDate: "2026-01-24", register: "2025/10/20 – 11/24", registerEnd: "2025-11-24" },
      { type: "說寫（複試）", examLabel: "4/18（六）、19（日）", examDate: "2026-04-19", register: "2/9 – 3/2", registerEnd: "2026-03-02" },
      { type: "聽讀（初試）", examLabel: "5/9（六）", examDate: "2026-05-09", register: "2/2 – 3/16", registerEnd: "2026-03-16" },
      { type: "一日考（聽讀＋說寫）", examLabel: "8/1（六）", examDate: "2026-08-01", register: "6/8 – 6/26", registerEnd: "2026-06-26" },
      { type: "電腦化測驗（聽讀／一日考）", examLabel: "8/15（六）", examDate: "2026-08-15", register: "5/18 – 6/15", registerEnd: "2026-06-15", note: "電腦化測驗費用不同：聽讀 1,250、一日考 3,150" },
      { type: "聽讀（初試）", examLabel: "10/31（六）", examDate: "2026-10-31", register: "7/22 – 9/17", registerEnd: "2026-09-17", note: "原訂 9/2 截止，官網延長至 9/17 下午 5:00；成績 11/18 公布" },
      { type: "說寫（複試）", examLabel: "11/14（六）、15（日）", examDate: "2026-11-15", register: "8/21 – 9/24", registerEnd: "2026-09-24", note: "成績 12/24 公布" },
    ],
  },
  {
    level: "中高級",
    sessions: [
      { type: "電腦化測驗（聽讀／一日考）", examLabel: "3/28（六）", examDate: "2026-03-28", register: "1/28 – 2/11", registerEnd: "2026-02-11" },
      { type: "聽讀／一日考", examLabel: "5/24（日）", examDate: "2026-05-24", register: "2/23 – 3/30", registerEnd: "2026-03-30" },
      { type: "說寫（複試）", examLabel: "7/25（六）", examDate: "2026-07-25", register: "6/1 – 6/15", registerEnd: "2026-06-15" },
      { type: "電腦化測驗（聽讀／一日考）", examLabel: "10/31（六）", examDate: "2026-10-31", register: "7/3 – 9/4", registerEnd: "2026-09-04", note: "電腦化測驗費用不同：聽讀 1,540、一日考 3,650" },
      { type: "說寫（複試）", examLabel: "12/19（六）", examDate: "2026-12-19", register: "10/19 – 11/16", registerEnd: "2026-11-16" },
    ],
  },
];

/**
 * 2027 年 GEPT 日程，抄自 LTTC 官方「2027 年 GEPT 測驗日期」
 * （gept.org.tw/info/GEPTschedule.pdf，2026-10-01 公告，2026-10-29 核對）。
 * 2027 年報名費調整：見 GEPT_FEES_2027。
 */
const GEPT_SCHEDULE_2027: { level: string; sessions: GeptSession[] }[] = [
  {
    level: "初級",
    sessions: [
      { type: "聽讀（初試）", examLabel: "1/9（六）", examDate: "2027-01-09", register: "2026/10/5 – 11/20", registerEnd: "2026-11-20" },
      { type: "說寫（複試）", examLabel: "3/20（六）、21（日）", examDate: "2027-03-21", register: "1/4 – 1/21", registerEnd: "2027-01-21" },
      { type: "聽讀（初試）", examLabel: "6/13（日）", examDate: "2027-06-13", register: "3/15 – 4/29", registerEnd: "2027-04-29" },
      { type: "說寫（複試）", examLabel: "9/11（六）、12（日）", examDate: "2027-09-12", register: "6/15 – 7/19", registerEnd: "2027-07-19" },
      { type: "聽讀（初試）", examLabel: "10/30（六）", examDate: "2027-10-30", register: "7/5 – 9/1", registerEnd: "2027-09-01" },
    ],
  },
  {
    level: "中級",
    sessions: [
      { type: "聽讀（初試）／一日考", examLabel: "1/30（六）", examDate: "2027-01-30", register: "2026/10/20 – 11/23", registerEnd: "2026-11-23" },
      { type: "說寫（複試）", examLabel: "4/17（六）、18（日）", examDate: "2027-04-18", register: "1/29 – 3/5", registerEnd: "2027-03-05" },
      { type: "聽讀（初試）", examLabel: "5/8（六）", examDate: "2027-05-08", register: "2/1 – 3/12", registerEnd: "2027-03-12" },
      { type: "說寫（複試）", examLabel: "7/17（六）", examDate: "2027-07-17", register: "4/26 – 5/28", registerEnd: "2027-05-28" },
      { type: "聽讀（初試）", examLabel: "8/14（六）", examDate: "2027-08-14", register: "5/10 – 6/14", registerEnd: "2027-06-14" },
      { type: "聽讀（初試）", examLabel: "11/6（六）", examDate: "2027-11-06", register: "7/26 – 9/14", registerEnd: "2027-09-14" },
      { type: "說寫（複試）", examLabel: "11/13（六）、14（日）", examDate: "2027-11-14", register: "8/16 – 9/20", registerEnd: "2027-09-20" },
    ],
  },
  {
    level: "中高級",
    sessions: [
      { type: "聽讀（初試）／一日考", examLabel: "5/22（六）", examDate: "2027-05-22", register: "2/22 – 3/29", registerEnd: "2027-03-29" },
      { type: "說寫（複試）", examLabel: "7/31（六）", examDate: "2027-07-31", register: "5/31 – 6/23", registerEnd: "2027-06-23" },
      { type: "聽讀（初試）", examLabel: "9/25（六）", examDate: "2027-09-25", register: "6/1 – 7/26", registerEnd: "2027-07-26" },
      { type: "說寫（複試）", examLabel: "9/25（六）", examDate: "2027-09-25", register: "6/21 – 8/9", registerEnd: "2027-08-09" },
      { type: "說寫（複試）", examLabel: "12/18（六）", examDate: "2027-12-18", register: "10/12 – 11/11", registerEnd: "2027-11-11" },
    ],
  },
];

/** 2027 年報名費（同一份官方日程） */
const GEPT_FEES_2027 = "2027 年起報名費調整：初級聽讀 630、說寫兩項 950（口說 560／寫作 390）；中級聽讀 900、說寫兩項 1,630（口說 970／寫作 660）、一日考 2,530；中高級聽讀 1,110、說寫兩項 1,850（口說 1,080／寫作 770）、一日考 2,960 元。";

const JLPT_LEVELS = [
  { level: "N5", name: "入門", desc: "基本日語能力", href: "/jlpt-n5" },
  { level: "N4", name: "基礎", desc: "基礎日語能力", href: "/jlpt-n4" },
  { level: "N3", name: "中級", desc: "日常場景溝通", href: "/jlpt-n3" },
  { level: "N2", name: "上級", desc: "日常進階溝通", href: "/jlpt-n2" },
  { level: "N1", name: "最上級", desc: "廣泛場景溝通", href: "/jlpt-n1" },
];

const JLPT_SCHEDULE = [
  {
    year: "2026",
    sessions: [
      { session: "第二回", register: "8/17 – 8/31（已截止）", exam: "12/6（日）" },
    ],
  },
  {
    year: "2027",
    sessions: [
      { session: "第一回", register: "依 jlpt.tw 公告（往年約 3–4 月）", exam: "7/4（日）" },
      { session: "第二回", register: "尚未公告", exam: "尚未公告（往年為 12 月第一個週日）" },
    ],
  },
];

const LEVEL_HREF: Record<string, string> = Object.fromEntries(GEPT_LEVELS.map((l) => [l.level, l.href]));

const TH = "text-left px-3 py-2.5 font-bold text-[#52616B] text-[13px] whitespace-nowrap";
const TD = "px-3 py-3 text-[#263238]";

function OutlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#2457A7] text-[#2457A7] bg-white font-bold text-sm hover:bg-[#F4F7FB] transition no-underline"
    >
      <InfoIcon name="external" size={16} /> {children}
    </a>
  );
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="list-none p-0 m-0 space-y-2 text-sm text-[#52616B]">
      {steps.map((s, i) => (
        <li key={s} className="flex items-start gap-2.5">
          <span className="shrink-0 w-6 h-6 rounded-full bg-[#FDECF1] text-[#C2416A] text-xs font-bold flex items-center justify-center">{i + 1}</span>
          <p className="m-0 pt-0.5 leading-relaxed">{s}</p>
        </li>
      ))}
    </ol>
  );
}

export default function ExamInfoPage() {
  return (
    <div className="bg-white pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        eyebrow="考試日程與報名"
        title="報考資訊"
        desc="全民英檢 GEPT 與 日本語能力試驗 JLPT 報名時間、費用一覽"
        image="/images/pages/exam-info.webp"
      >
        <div className="inline-flex items-start gap-2 text-sm text-[#52616B] bg-white border border-slate-200 rounded-xl px-3.5 py-2.5">
          <InfoIcon name="info" size={18} className="text-[#2457A7] mt-px" />
          <span>資料更新：2026/10/29｜以下資料僅供參考，實際報名時間與費用請以各官方網站公告為準</span>
        </div>
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4">
        {/* 考試切換（錨點） */}
        <nav aria-label="考試類別" className="mb-4 overflow-x-auto">
          <div className="flex gap-1 border-b border-slate-200">
            <a href="#gept" className="whitespace-nowrap px-4 py-2.5 font-bold text-[#C2416A] border-b-2 border-[#E65E83] -mb-px no-underline">全民英檢 GEPT</a>
            <a href="#jlpt" className="whitespace-nowrap px-4 py-2.5 font-bold text-[#52616B] hover:text-[#263238] no-underline">日檢 JLPT</a>
            <a href="#prep" className="whitespace-nowrap px-4 py-2.5 font-bold text-[#52616B] hover:text-[#263238] no-underline">準備建議</a>
          </div>
        </nav>

        {/* ─── 全民英檢 GEPT ─── */}
        <section id="gept" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl p-5 md:p-7 border border-slate-200">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="w-11 h-11 rounded-xl bg-[#FDECF1] text-[#E65E83] flex items-center justify-center"><SubjectIcon name="book" size={26} /></span>
              <h2 className="text-2xl font-black text-[#263238] m-0">全民英檢 GEPT</h2>
            </div>

            {/* 級別與費用 */}
            <div className="mb-8">
              <SectionTitle>考試級別與費用</SectionTitle>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-sm min-w-[560px]">
                  <thead>
                    <tr className="bg-[#F6F4F1]">
                      <th className={TH}>級別</th>
                      <th className={TH}>適用程度</th>
                      <th className={`${TH} text-right`}>聽讀測驗</th>
                      <th className={`${TH} text-right`}>說寫測驗</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GEPT_LEVELS.map((l) => (
                      <tr key={l.level} className="border-t border-slate-100">
                        <td className={TD}>
                          <a href={l.href} className="font-bold text-[#2457A7] no-underline hover:underline">
                            {l.level} {l.eng}
                          </a>
                        </td>
                        <td className={`${TD} text-[#52616B]`}>{l.target}</td>
                        <td className={`${TD} text-right`}>{l.listenRead}</td>
                        <td className={`${TD} text-right`}>{l.speakWrite}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 考試時程 */}
            {[
              { year: 2026, note: "依 LTTC 2025 年 9 月 24 日公告的官方日程整理；報名期間若官網延長，以備註為準。", schedule: GEPT_SCHEDULE_2026 },
              { year: 2027, note: GEPT_FEES_2027 + "依 LTTC 2026 年 10 月公告的官方日程整理。", schedule: GEPT_SCHEDULE_2027 },
            ].map(({ year, note, schedule }) => (
              <details key={year} open className="group mb-6 rounded-xl border border-slate-200">
                <summary className="flex items-center gap-2.5 cursor-pointer list-none px-4 py-3.5 [&::-webkit-details-marker]:hidden">
                  <InfoIcon name="calendar" size={20} className="text-[#E65E83]" />
                  <h3 className="text-lg font-bold text-[#263238] m-0 flex-1">
                    {year} 年考試時程表（各級每一場）
                  </h3>
                  <InfoIcon name="chevron" size={20} className="text-[#52616B] transition group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4">
                  <p className="text-xs text-[#52616B] mt-0 mb-4 leading-relaxed">
                    {note}狀態欄依你今天的日期判斷。
                  </p>
                  {schedule.map((lv) => (
                    <div key={lv.level} className="mb-5 last:mb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FDECF1] text-[#C2416A] text-sm font-bold">{lv.level}</span>
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-sm min-w-[640px]">
                          <thead>
                            <tr className="bg-[#F6F4F1]">
                              <th className={TH}>測驗項目</th>
                              <th className={TH}>測驗日期</th>
                              <th className={TH}>報名期間</th>
                              <th className={TH}>狀態</th>
                              <th className={TH}>練習準備</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lv.sessions.map((x) => (
                              <tr key={lv.level + x.examDate + x.type} className="border-t border-slate-100 align-top">
                                <td className={TD}>{x.type}</td>
                                <td className={`${TD} whitespace-nowrap font-medium`}>{x.examLabel}</td>
                                <td className={`${TD} text-[#52616B]`}>
                                  {x.register}
                                  {x.note && (
                                    <div className="text-xs text-amber-700 mt-0.5">{x.note}</div>
                                  )}
                                </td>
                                <td className={`${TD} whitespace-nowrap`}>
                                  <SessionStatus examDate={x.examDate} registerEnd={x.registerEnd} />
                                </td>
                                <td className={TD}>
                                  {LEVEL_HREF[lv.level] && (
                                    <a
                                      href={LEVEL_HREF[lv.level]}
                                      className="inline-flex items-center gap-1 whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#2457A7] text-white text-xs font-bold no-underline hover:bg-[#1d4a8f]"
                                    >
                                      前往練習 <InfoIcon name="arrow" size={13} />
                                    </a>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ))}

            {/* 報名方式 */}
            <div className="grid md:grid-cols-[1fr_auto] gap-5 md:items-end mt-8">
              <div>
                <SectionTitle>報名方式</SectionTitle>
                <StepList
                  steps={[
                    "至 LTTC 全民英檢官網線上報名",
                    "準備身分證明文件與近期照片",
                    "繳費完成後三個工作天到報名系統確認「已入帳」才算完成；准考證以電子郵件寄發，沒有紙本",
                  ]}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <OutlineLink href="https://www.gept.org.tw/">LTTC 全民英檢官網</OutlineLink>
                <OutlineLink href="https://reg6.lttc.org.tw/GEPT_Exam_New/">全民英檢報名系統</OutlineLink>
              </div>
            </div>
          </div>
        </section>

        {/* ─── JLPT 日本語能力試驗 ─── */}
        <section id="jlpt" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl p-5 md:p-7 border border-slate-200">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="w-11 h-11 rounded-xl bg-[#FDECF1] text-[#E65E83] flex items-center justify-center"><SubjectIcon name="torii" size={26} /></span>
              <h2 className="text-2xl font-black text-[#263238] m-0">日本語能力試驗 JLPT</h2>
            </div>

            {/* 級別說明 */}
            <div className="mb-8">
              <SectionTitle>考試級別說明</SectionTitle>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-sm min-w-[520px]">
                  <thead>
                    <tr className="bg-[#F6F4F1]">
                      <th className={TH}>級別</th>
                      <th className={TH}>程度</th>
                      <th className={TH}>說明</th>
                      <th className={`${TH} text-right`}>報名費（台灣）</th>
                    </tr>
                  </thead>
                  <tbody>
                    {JLPT_LEVELS.map((l) => (
                      <tr key={l.level} className="border-t border-slate-100">
                        <td className={TD}>
                          <a href={l.href} className="font-bold text-[#2457A7] no-underline hover:underline">
                            {l.level}
                          </a>
                        </td>
                        <td className={TD}>{l.name}</td>
                        <td className={`${TD} text-[#52616B]`}>{l.desc}</td>
                        <td className={`${TD} text-right`}>NT$1,500</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 考試時程 */}
            <div className="mb-8">
              <SectionTitle>考試時程表</SectionTitle>
              <div className="grid md:grid-cols-2 gap-4">
                {JLPT_SCHEDULE.map((y) => (
                  <div key={y.year} className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-[#F6F4F1]">
                      <InfoIcon name="calendar" size={18} className="text-[#E65E83]" />
                      <span className="font-bold text-[#263238]">{y.year} 年</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr>
                            <th className={TH}>回次</th>
                            <th className={TH}>報名期間</th>
                            <th className={TH}>考試日期</th>
                          </tr>
                        </thead>
                        <tbody>
                          {y.sessions.map((s) => (
                            <tr key={s.session} className="border-t border-slate-100 align-top">
                              <td className={`${TD} whitespace-nowrap`}>{s.session}</td>
                              <td className={`${TD} text-[#52616B]`}>{s.register}</td>
                              <td className={`${TD} font-medium`}>{s.exam}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 報名方式 */}
            <div className="grid md:grid-cols-[1fr_auto] gap-5 md:items-end">
              <div>
                <SectionTitle>報名方式</SectionTitle>
                <StepList
                  steps={[
                    "台灣考區由 LTTC（財團法人語言訓練測驗中心）代辦",
                    "報名期間至 LTTC 日檢專頁線上報名",
                    "可同時報考不同級別，但同一級別每回只能報名一次",
                  ]}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <OutlineLink href="https://www.lttc.ntu.edu.tw/JLPT.htm">LTTC 日檢報名（台灣）</OutlineLink>
                <OutlineLink href="https://www.jlpt.jp/">JLPT 國際官網</OutlineLink>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 考試準備建議 ─── */}
        <section id="prep" className="mb-10 scroll-mt-20">
          <SectionTitle>考試準備建議</SectionTitle>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-[#E65E83]"><SubjectIcon name="book" size={24} /></span>
                <h3 className="font-bold text-[#263238] text-lg m-0">全民英檢準備</h3>
              </div>
              <p className="text-sm text-[#52616B] leading-relaxed mt-0 mb-3">
                按照「單字 → 文法 → 聽力 → 閱讀 → 口說 → 寫作」的順序練習效果最好。
                使用本平台的模擬測驗了解考試題型。
              </p>
              <a href="/elementary" className="inline-flex items-center gap-1 text-sm text-[#2457A7] font-bold no-underline hover:underline">
                前往英檢練習 <InfoIcon name="arrow" size={14} />
              </a>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-[#E65E83]"><SubjectIcon name="torii" size={24} /></span>
                <h3 className="font-bold text-[#263238] text-lg m-0">JLPT 日檢準備</h3>
              </div>
              <p className="text-sm text-[#52616B] leading-relaxed mt-0 mb-3">
                從五十音開始，搭配單字、文法、聽力循序漸進。建議考前 2–3
                個月密集練習模擬試題。
              </p>
              <a href="/jlpt-n5" className="inline-flex items-center gap-1 text-sm text-[#2457A7] font-bold no-underline hover:underline">
                前往日文練習 <InfoIcon name="arrow" size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <div className="bg-[#FDECF1] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <p className="text-xl font-bold text-[#263238] m-0">不管你準備的是英檢還是日檢</p>
            <p className="text-[#52616B] mt-1 mb-0">本平台提供完全免費的互動式練習，幫助你更有效率地備考！</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a href="/elementary" className="inline-flex items-center gap-1.5 px-5 py-3 bg-[#2457A7] text-white rounded-xl font-bold text-sm hover:bg-[#1d4a8f] transition no-underline">
              英檢練習 <InfoIcon name="arrow" size={16} />
            </a>
            <a href="/jlpt-n5" className="inline-flex items-center gap-1.5 px-5 py-3 border border-[#2457A7] text-[#2457A7] bg-white rounded-xl font-bold text-sm hover:bg-[#F4F7FB] transition no-underline">
              日文練習 <InfoIcon name="arrow" size={16} />
            </a>
          </div>
        </div>

        {/* 最後更新時間 */}
        <p className="text-center text-xs text-[#52616B] mt-6 mb-0">
          資料最後更新：2026 年 10 月 29 日（英檢依 LTTC 2026、2027 官方日程；日檢依 jlpt.tw） ｜ 實際資訊請以各主辦單位官方公告為準
        </p>
      </div>
    </div>
  );
}
