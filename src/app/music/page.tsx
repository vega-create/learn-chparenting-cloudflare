import type { Metadata } from "next";
import Link from "next/link";
import { MUSIC_LEVELS, getTotalQuestionCount } from "@/data/music";
import SubjectVisitTracker from "@/components/SubjectVisitTracker";
import PageHeader, { SectionTitle } from "@/components/PageHeader";
import SubjectIcon from "@/components/SubjectIcon";
import HmTopicCard, { HmAboutBox } from "@/components/HmTopicCard";
import RelatedPosts from "@/components/RelatedPosts";

export const metadata: Metadata = {
  title: "免費樂理基礎練習 | 音符・音階・和弦・音樂常識 | learn.chparenting.com",
  description:
    "免費樂理線上練習：入門的音符與休止符、節拍與拍號、音高與譜號，基礎的音階與調性、音程、力度與速度記號，進階的和弦、曲式、音樂常識。每題附解說，不需要會樂器，適合學樂器前後的孩子打基礎，不用註冊。",
  alternates: { canonical: "https://learn.chparenting.com/music" },
};

const LEVEL_DESC: Record<string, string> = {
  intro: "從看懂樂譜開始",
  basic: "認識音階、音程與記號",
  advanced: "和弦、曲式與音樂常識",
};

export default function MusicPage() {
  const total = getTotalQuestionCount();

  return (
    <div className="">
      <SubjectVisitTracker subject="music" />
      <PageHeader
        eyebrow="音樂與樂理"
        title="樂理基礎"
        desc="音符 · 節拍 · 音階 · 和弦，從入門到進階。不需要會樂器，大人小孩都能練。"
        icon={<SubjectIcon name="music" size={40} />}
        iconBg="bg-[#9B5BD1]"
        image="/images/banners/music.webp"
      >
        <span className="inline-block px-3 py-1 rounded-full bg-[#FDECF1] text-[#C2416A] text-sm font-bold">
          {total}+ 題免費練習
        </span>
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* 程度快速切換 */}
        <nav aria-label="選擇程度" className="grid grid-cols-3 gap-2 sm:gap-4 mb-10">
          {MUSIC_LEVELS.map((level) => (
            <a key={level.id} href={`#${level.id}`}
              className="flex items-center gap-3 bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 no-underline hover:border-[#E65E83] transition-colors">
              <span className="text-2xl sm:text-3xl shrink-0" aria-hidden="true">{level.icon}</span>
              <span className="min-w-0">
                <span className="block font-bold text-[#263238] text-sm sm:text-lg">{level.title}</span>
                <span className="hidden sm:block text-xs text-[#52616B]">{LEVEL_DESC[level.id]}</span>
              </span>
            </a>
          ))}
        </nav>

        <div className="space-y-10">
          {MUSIC_LEVELS.map((level) => {
            const qCount = level.topics.reduce((s, t) => s + t.questions.length, 0);
            return (
              <section key={level.id} id={level.id} className="scroll-mt-24">
                <SectionTitle
                  action={
                    <Link href={`/music/${level.id}`} className="text-sm font-bold text-[#2457A7] no-underline hover:underline shrink-0">
                      {level.title}總覽 →
                    </Link>
                  }
                >
                  {level.title}
                  <span className="ml-2 text-sm font-normal text-[#52616B]">{level.topics.length} 個主題 · {qCount} 題</span>
                </SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {level.topics.map((t) => (
                    <HmTopicCard
                      key={t.id}
                      href={`/music/${level.id}/${t.id}`}
                      icon={t.icon}
                      image={`/images/topics/mu-${t.id}.webp`}
                      title={t.title}
                      desc={t.description}
                      chips={[...(t.concepts && t.concepts.length > 0 ? ["觀念教學"] : []), `${t.questions.length} 題練習`]}
                      cta={t.concepts && t.concepts.length > 0 ? "先看觀念再練習" : "開始練習"}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <RelatedPosts slugs={["music-theory-for-kids", "children-learning-motivation", "board-games-benefits-for-kids"]} />

        <HmAboutBox>
          <ol className="grid sm:grid-cols-3 gap-3 list-none p-0 m-0">
            <li className="flex gap-2"><span className="text-[#E65E83] font-bold">1.</span><span>選擇<strong>程度等級</strong>，從入門開始</span></li>
            <li className="flex gap-2"><span className="text-[#E65E83] font-bold">2.</span><span>做<strong>互動練習</strong>，每題都有詳解</span></li>
            <li className="flex gap-2"><span className="text-[#E65E83] font-bold">3.</span><span>循序漸進，<strong>建立樂理基礎</strong></span></li>
          </ol>
        </HmAboutBox>
      </div>
    </div>
  );
}
