import type { Metadata } from "next";
import Link from "next/link";
import { HISTORY_GEO_REGIONS, getTotalQuestionCount } from "@/data/history-geo";
import SubjectVisitTracker from "@/components/SubjectVisitTracker";
import PageHeader, { SectionTitle } from "@/components/PageHeader";
import SubjectIcon from "@/components/SubjectIcon";
import HmTopicCard, { HmAboutBox } from "@/components/HmTopicCard";

export const metadata: Metadata = {
  title: "免費歷史地理練習 | 台灣・亞洲・世界 | learn.chparenting.com",
  description:
    "免費歷史地理線上練習：台灣歷史、地理、文化，亞洲歷史與地理，世界歷史、地理與文化，共八個主題。每題附解說，把地名、年代、事件之間的關係講清楚，不是背答案。適合國小高年級到國中，不用註冊。",
  alternates: { canonical: "https://learn.chparenting.com/history-geo" },
};

const REGION_DESC: Record<string, string> = {
  taiwan: "認識我們的家鄉",
  asia: "探索鄰近的亞洲國家",
  world: "看見更大的世界",
};

function topicQCount(t: { questions: unknown[]; readings?: { questions: unknown[] }[] }) {
  return t.questions.length + (t.readings?.reduce((rs, r) => rs + r.questions.length, 0) ?? 0);
}

export default function HistoryGeoPage() {
  const total = getTotalQuestionCount();

  return (
    <div className="bg-white">
      <SubjectVisitTracker subject="history-geo" />
      <PageHeader
        eyebrow="社會科練習"
        title="歷史地理"
        desc="台灣 · 亞洲 · 世界的歷史、地理與文化，每題都有詳解。大人小孩都能練，一起拓展視野。"
        icon={<SubjectIcon name="globe" size={40} />}
        iconBg="bg-[#1F9A7A]"
        image="/images/pages/history-geo.webp"
      >
        <span className="inline-block px-3 py-1 rounded-full bg-[#FDECF1] text-[#C2416A] text-sm font-bold">
          {total}+ 題免費練習
        </span>
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* 地區快速切換 */}
        <nav aria-label="選擇地區" className="grid grid-cols-3 gap-2 sm:gap-4 mb-10">
          {HISTORY_GEO_REGIONS.map((region) => (
            <a key={region.id} href={`#${region.id}`}
              className="flex items-center gap-3 bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 no-underline hover:border-[#E65E83] transition-colors">
              <span className="text-2xl sm:text-3xl shrink-0" aria-hidden="true">{region.icon}</span>
              <span className="min-w-0">
                <span className="block font-bold text-[#263238] text-sm sm:text-lg">{region.title}</span>
                <span className="hidden sm:block text-xs text-[#52616B]">{REGION_DESC[region.id]}</span>
              </span>
            </a>
          ))}
        </nav>

        <div className="space-y-10">
          {HISTORY_GEO_REGIONS.map((region) => {
            const qCount = region.topics.reduce((s, t) => s + topicQCount(t), 0);
            return (
              <section key={region.id} id={region.id} className="scroll-mt-24">
                <SectionTitle
                  action={
                    <Link href={`/history-geo/${region.id}`} className="text-sm font-bold text-[#2457A7] no-underline hover:underline shrink-0">
                      {region.title}總覽 →
                    </Link>
                  }
                >
                  {region.title}
                  <span className="ml-2 text-sm font-normal text-[#52616B]">{region.topics.length} 個主題 · {qCount} 題</span>
                </SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {region.topics.map((t) => (
                    <HmTopicCard
                      key={t.id}
                      href={`/history-geo/${region.id}/${t.id}`}
                      icon={t.icon}
                      title={t.title}
                      desc={t.description}
                      chips={[
                        ...(t.questions.length > 0 ? [`${t.questions.length} 題練習`] : []),
                        ...(t.readings && t.readings.length > 0 ? [`${t.readings.length} 篇閱讀`] : []),
                      ]}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <HmAboutBox>
          <ol className="grid sm:grid-cols-3 gap-3 list-none p-0 m-0">
            <li className="flex gap-2"><span className="text-[#E65E83] font-bold">1.</span><span>選擇<strong>地區範圍</strong>，從台灣到世界</span></li>
            <li className="flex gap-2"><span className="text-[#E65E83] font-bold">2.</span><span>做<strong>互動練習</strong>，每題都有詳解</span></li>
            <li className="flex gap-2"><span className="text-[#E65E83] font-bold">3.</span><span>學習<strong>歷史文化</strong>，拓展國際視野</span></li>
          </ol>
        </HmAboutBox>
      </div>
    </div>
  );
}
