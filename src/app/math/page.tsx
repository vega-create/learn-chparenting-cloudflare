import type { Metadata } from "next";
import { MATH_TOPICS } from "@/data/math/topics";
import SubjectVisitTracker from "@/components/SubjectVisitTracker";
import PageHeader, { SectionTitle } from "@/components/PageHeader";
import SubjectIcon from "@/components/SubjectIcon";
import { TopicCard } from "@/components/MathChineseUI";
import { ToolStructuredData } from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "國小數學免費練習｜四則運算線上練習題 - learn.chparenting.com",
  description: "免費國小數學線上練習：基礎運算、分數、小數、百分比、幾何、代數入門、應用題、時間與計量八個主題，每個觀念先講解再做題、附例題步驟與解說。適合國小 1 到 6 年級在家每天練，不用註冊。",
  keywords: ["國小數學練習", "四則運算練習", "國小數學題庫", "數學免費練習", "小學數學"],
  openGraph: {
    title: "國小數學免費練習｜四則運算線上練習題",
    description: "免費國小數學線上練習，涵蓋四則運算、應用題、闖關模式。遊戲化學習讓孩子愛上數學。",
    url: "https://learn.chparenting.com/math/",
    siteName: "learn.chparenting.com",
    locale: "zh_TW",
    type: "website",
  },
  alternates: { canonical: "https://learn.chparenting.com/math" },
};

const GRADE_GROUPS = [
  { key: "basic", name: "基礎", scope: "國小 1–3 年級", desc: "先把計算和生活中的時間、單位練熟，剛開始學的孩子從這裡開始。", tint: "bg-[#FFF5F7] border-[#F6D5DF]", ids: ["basic-arithmetic", "time-measurement"] },
  { key: "advanced", name: "進階", scope: "國小 3–5 年級", desc: "分數、小數、幾何和應用題，把計算用在題目裡。", tint: "bg-[#F3F7FD] border-[#D6E2F5]", ids: ["fractions", "decimals", "geometry", "word-problems"] },
  { key: "challenge", name: "挑戰", scope: "國小 5 年級～國中", desc: "百分比和代數入門，給想往前一步的孩子，也適合大人複習。", tint: "bg-[#F4FAF6] border-[#D5EBDD]", ids: ["percentages", "intro-algebra"] },
];

const GROUP_ICON: Record<string, string> = { basic: "基", advanced: "進", challenge: "挑" };

export default function MathPage() {
  return (
    <div className="bg-white">
      <ToolStructuredData
        name="國小數學免費線上練習"
        description="專為國小生設計的免費數學練習平台，涵蓋四則運算和應用題"
        url="https://learn.chparenting.com/math/"
        educationalLevel="國小"
        subject="數學"
      />
      <SubjectVisitTracker subject="math" />

      <PageHeader
        eyebrow="國小 1–6 年級・國中入門"
        title="數學練習"
        desc="從基礎運算到代數入門，每個主題先看觀念、再做練習、最後限時挑戰。大人小孩都能練，免費、不用註冊。"
        icon={<SubjectIcon name="calculator" size={40} />}
        image="/images/pages/math.webp"
      >
        <nav className="flex flex-wrap gap-2" aria-label="依程度跳到主題">
          {GRADE_GROUPS.map((g) => (
            <a key={g.key} href={`#${g.key}`}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm no-underline hover:border-[#E65E83] transition">
              <span className="font-bold text-[#263238]">{g.name}</span>
              <span className="text-[#52616B] ml-1.5 text-xs">{g.scope}</span>
            </a>
          ))}
          <a href="#times-table" className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-[#263238] no-underline hover:border-[#E65E83] transition">九九乘法</a>
        </nav>
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* 九九乘法練習（獨立工具） */}
        <section id="times-table" className="scroll-mt-20 mb-8 rounded-2xl border border-[#D6E2F5] bg-[#EEF3FB] p-5 md:p-7">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="flex-1 min-w-0">
              <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-[#FDECF1] text-[#C2416A] mb-2">推薦練習・二年級起</span>
              <h2 className="text-2xl font-black text-[#263238] m-0 mb-1">九九乘法練習</h2>
              <p className="text-[#52616B] m-0">自己選要練幾的乘法，答錯的題目最後會再練一次；熟了還能挑戰多位數乘法。</p>
            </div>
            <div className="hidden lg:flex gap-3" aria-hidden="true">
              {["3 × 4 = 12", "6 × 7 = ?", "8 × 9 = 72"].map((t, i) => (
                <span key={t} className={`px-4 py-3 rounded-xl bg-white border border-slate-200 text-lg font-black text-[#263238] ${i === 1 ? "-translate-y-1 text-[#C2416A]" : ""}`}>{t}</span>
              ))}
            </div>
            <a href="/math/times-table"
              className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2457A7] text-white font-bold no-underline hover:bg-[#1d4688] transition">
              開始練習 →
            </a>
          </div>
        </section>

        {/* Topics by grade */}
        <div className="space-y-6">
          {GRADE_GROUPS.map((group) => (
            <section key={group.key} id={group.key} className={`scroll-mt-20 rounded-2xl border p-4 md:p-6 ${group.tint}`}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
                <span className="w-9 h-9 rounded-xl bg-[#E65E83] text-white flex items-center justify-center font-black" aria-hidden="true">{GROUP_ICON[group.key]}</span>
                <h2 className="text-xl md:text-2xl font-black text-[#263238] m-0">{group.name}</h2>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[#52616B]">{group.scope}</span>
                <p className="w-full md:w-auto md:flex-1 text-sm text-[#52616B] m-0">{group.desc}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {group.ids.map((id) => {
                  const t = MATH_TOPICS.find((x) => x.id === id);
                  if (!t) return null;
                  return (
                    <TopicCard
                      key={t.id}
                      href={`/math/${t.id}`}
                      icon={t.icon}
                      title={t.title}
                      meta={t.grade}
                      desc={t.concepts.map((c) => c.title).join("、")}
                      chips={[`${t.concepts.length} 個觀念`, `${t.practices.length} 題練習`, "限時挑戰"]}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* How to use */}
        <section className="mt-10 bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
          <SectionTitle>怎麼練最有效</SectionTitle>
          <ol className="grid sm:grid-cols-3 gap-4 list-none p-0 m-0 text-sm text-[#52616B]">
            <li className="flex gap-3"><span className="w-7 h-7 shrink-0 rounded-full bg-[#FDECF1] text-[#C2416A] font-bold flex items-center justify-center">1</span><span>先看<strong className="text-[#263238]">觀念教學</strong>，理解原理和範例</span></li>
            <li className="flex gap-3"><span className="w-7 h-7 shrink-0 rounded-full bg-[#FDECF1] text-[#C2416A] font-bold flex items-center justify-center">2</span><span>做<strong className="text-[#263238]">互動練習</strong>，每題都有詳解</span></li>
            <li className="flex gap-3"><span className="w-7 h-7 shrink-0 rounded-full bg-[#FDECF1] text-[#C2416A] font-bold flex items-center justify-center">3</span><span>挑戰<strong className="text-[#263238]">限時計算</strong>，訓練速度和準確</span></li>
          </ol>
        </section>

        {/* 關於這個練習（原本頁首的介紹文字，移到下方） */}
        <section className="mt-6 bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
          <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-[#FDECF1] text-[#C2416A] mb-3">免費數學練習</span>
          <h2 className="text-xl font-bold text-[#263238] m-0 mb-3">國小數學免費線上練習｜四則運算題庫</h2>
          <p className="text-[#52616B] leading-relaxed mb-4">專為國小生設計的免費數學練習平台，涵蓋加減乘除四則運算和應用題。闖關模式讓孩子越練越有成就感，不像傳統測驗那麼枯燥。適合每天做完功課後當作小複習，也可以用來加強比較弱的單元。</p>
          <ul className="grid sm:grid-cols-2 gap-1.5 list-none p-0 m-0">
            {["四則運算、應用題完整題型", "闖關模式，練習更有動力", "適合國小 1-6 年級", "不需要帳號，免費直接練習"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-[#263238]">
                <span className="text-[#2457A7] font-bold">✓</span>{item}
              </li>
            ))}
          </ul>
        </section>

        <div className="text-center mt-8">
          <a href="/" className="text-sm text-[#2457A7] hover:underline no-underline">← 回到首頁</a>
        </div>
      </div>
    </div>
  );
}
