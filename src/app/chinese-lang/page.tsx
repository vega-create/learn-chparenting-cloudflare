import type { Metadata } from "next";
import RelatedPosts from "@/components/RelatedPosts";
import Link from "next/link";
import { CHINESE_GRADES, getTotalQuestionCount } from "@/data/chinese-lang";
import SubjectVisitTracker from "@/components/SubjectVisitTracker";
import PageHeader, { SectionTitle } from "@/components/PageHeader";
import SubjectIcon from "@/components/SubjectIcon";
import { TopicCard } from "@/components/MathChineseUI";

export const metadata: Metadata = {
  title: "免費國小國語練習 | 注音・生字・成語・閱讀 | learn.chparenting.com",
  description:
    "免費國小國語線上練習：低年級注音符號、國字筆畫部首、詞語與短文閱讀；中年級成語、句子重組、閱讀理解；高年級成語辨析、修辭文法、長篇閱讀。每題附解說，答錯立刻看懂，不用註冊、手機平板都能用。",
  alternates: { canonical: "https://learn.chparenting.com/chinese-lang" },
};

const GRADE_TABS: Record<string, { name: string; scope: string }> = {
  lower: { name: "低年級", scope: "小一・小二" },
  middle: { name: "中年級", scope: "小三・小四" },
  high: { name: "高年級", scope: "小五・小六" },
};
const LG_COLS: Record<number, string> = { 1: "lg:grid-cols-2", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

export default function ChineseLangPage() {
  const total = getTotalQuestionCount();

  return (
    <div className="">
      <SubjectVisitTracker subject="chinese-lang" />
      <PageHeader
        eyebrow="國小 1–6 年級"
        title="國語學習"
        desc="注音 · 生字 · 成語 · 閱讀 — 小一到小六。每題都有解說，大人小孩都能練，免費、不用註冊。"
        icon={<SubjectIcon name="book" size={40} />}
        image="/images/banners/chinese-lang.webp"
      >
        <span className="inline-block px-3 py-1 rounded-full bg-[#FDECF1] text-[#C2416A] text-sm font-bold">
          {total}+ 題免費練習
        </span>
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* 年級切換（錨點） */}
        <nav className="grid grid-cols-3 gap-2 mb-8" aria-label="選擇年級">
          {CHINESE_GRADES.map((g) => {
            const tab = GRADE_TABS[g.id] ?? { name: g.title, scope: "" };
            return (
              <a key={g.id} href={`#${g.id}`}
                className="block text-center py-3 px-2 rounded-xl bg-white border border-slate-200 no-underline hover:border-[#E65E83] hover:bg-[#FFF5F7] transition">
                <span className="block font-bold text-[#263238]">{tab.name}</span>
                <span className="block text-xs text-[#52616B] mt-0.5">{tab.scope}</span>
              </a>
            );
          })}
        </nav>

        {/* 年級區塊 */}
        <div className="space-y-10">
          {CHINESE_GRADES.map((grade) => {
            const qCount = grade.topics.reduce(
              (s, t) =>
                s +
                t.questions.length +
                (t.readings?.reduce((rs, r) => rs + r.questions.length, 0) ?? 0),
              0
            );
            return (
              <section key={grade.id} id={grade.id} className="scroll-mt-20">
                <SectionTitle
                  action={
                    <Link href={`/chinese-lang/${grade.id}`} className="text-sm text-[#2457A7] hover:underline no-underline shrink-0">
                      {grade.title.replace(/（.*）/, "")}總覽 →
                    </Link>
                  }
                >
                  {grade.title}
                </SectionTitle>
                <p className="text-sm text-[#52616B] -mt-2 mb-4">{grade.topics.length} 個主題 · {qCount} 題練習</p>
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${LG_COLS[grade.topics.length] ?? "lg:grid-cols-4"} gap-4`}>
                  {grade.topics.map((t) => {
                    const chips = [
                      t.questions.length > 0 ? `${t.questions.length} 題練習` : "",
                      t.readings && t.readings.length > 0 ? `${t.readings.length} 篇閱讀` : "",
                      t.listening && t.listening.length > 0 ? "聽力練習" : "",
                    ].filter(Boolean);
                    return (
                      <TopicCard
                        key={t.id}
                        href={`/chinese-lang/${grade.id}/${t.id}`}
                        icon={t.icon}
                        iconImage={`/images/topics/zh-${t.id}.webp`}
                        title={t.title}
                        desc={t.description}
                        chips={chips}
                        filled
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* 成語練習（獨立工具） */}
        <section className="mt-10 rounded-2xl border border-[#F6D5DF] bg-[#FFF5F7] p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/topics/zh-idioms.webp" alt="" className="hidden sm:block w-20 h-20 shrink-0 object-contain" />
            <div className="flex-1 min-w-0">
              <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-[#FDECF1] text-[#C2416A] mb-2">中高年級</span>
              <h2 className="text-xl md:text-2xl font-black text-[#263238] m-0 mb-1">成語練習：填空、配對、學習單</h2>
              <p className="text-[#52616B] m-0">選字填空、成語配意思，還可以印成學習單用手寫</p>
            </div>
            <a href="/chinese-lang/idiom-practice"
              className="shrink-0 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#2457A7] text-white font-bold no-underline hover:bg-[#1d4688] transition">
              開始練習 →
            </a>
          </div>
        </section>

        {/* 學習方式 */}
        <section className="mt-6 rounded-2xl border border-[#D6E2F5] bg-[#EEF3FB] p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-[#263238] m-0 mb-3">選擇適合的年級，從一個主題開始</h2>
          <ol className="grid sm:grid-cols-3 gap-4 list-none p-0 m-0 text-sm text-[#52616B]">
            <li className="flex gap-3"><span className="w-7 h-7 shrink-0 rounded-full bg-white text-[#2457A7] font-bold flex items-center justify-center">1</span><span>選擇<strong className="text-[#263238]">年級程度</strong>，找到適合的主題</span></li>
            <li className="flex gap-3"><span className="w-7 h-7 shrink-0 rounded-full bg-white text-[#2457A7] font-bold flex items-center justify-center">2</span><span>做<strong className="text-[#263238]">互動練習</strong>，每題都有詳解</span></li>
            <li className="flex gap-3"><span className="w-7 h-7 shrink-0 rounded-full bg-white text-[#2457A7] font-bold flex items-center justify-center">3</span><span>挑戰<strong className="text-[#263238]">閱讀理解</strong>，訓練分析能力</span></li>
          </ol>
        </section>

        <RelatedPosts slugs={["zhuyin-practice", "idiom-learning-guide", "children-learning-motivation"]} />

        <div className="text-center mt-8">
          <a href="/" className="text-sm text-[#2457A7] hover:underline no-underline">← 回到首頁</a>
        </div>
      </div>
    </div>
  );
}
