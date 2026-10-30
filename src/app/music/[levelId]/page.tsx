import type { Metadata } from "next";
import Link from "next/link";
import { MUSIC_LEVELS, getLevelById } from "@/data/music";
import { notFound } from "next/navigation";
import PageHeader, { SectionTitle } from "@/components/PageHeader";
import HmTopicCard from "@/components/HmTopicCard";

export function generateStaticParams() {
  return MUSIC_LEVELS.map((l) => ({ levelId: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ levelId: string }>;
}): Promise<Metadata> {
  const { levelId } = await params;
  const level = getLevelById(levelId);
  if (!level) return {};
  return {
    title: `樂理 ${level.title} | learn.chparenting.com`,
    description: `免費樂理 ${level.title} 線上練習：${level.topics.map((t) => t.title).join("、")}。每個主題先看觀念再做題，每題附解說；不需要會樂器，免費使用、不用註冊，適合學樂器前後的孩子打基礎。`,
    alternates: {
      canonical: `https://learn.chparenting.com/music/${levelId}`,
    },
  };
}

export default async function LevelOverviewPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  const level = getLevelById(levelId);
  if (!level) notFound();

  return (
    <div className="">
      <PageHeader
        eyebrow="樂理基礎"
        title={level.title}
        desc={`${level.topics.length} 個主題，先看觀念再做題。不需要會樂器，大人小孩都能練。`}
        icon={<span>{level.icon}</span>}
        iconBg="bg-white border border-slate-200"
      >
        <Link href="/music" className="text-sm font-bold text-[#2457A7] no-underline hover:underline">
          ← 回到樂理基礎
        </Link>
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        <SectionTitle>{level.title}主題</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {level.topics.map((topic) => (
            <HmTopicCard
              key={topic.id}
              href={`/music/${level.id}/${topic.id}`}
              icon={topic.icon}
              title={topic.title}
              desc={topic.description}
              chips={[...(topic.concepts && topic.concepts.length > 0 ? ["觀念教學"] : []), `${topic.questions.length} 題練習`]}
              cta={topic.concepts && topic.concepts.length > 0 ? "先看觀念再練習" : "開始練習"}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/music" className="text-sm font-bold text-[#2457A7] no-underline hover:underline">
            ← 回到樂理基礎
          </Link>
        </div>
      </div>
    </div>
  );
}
