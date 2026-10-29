import type { Metadata } from "next";
import Link from "next/link";
import { HISTORY_GEO_REGIONS, getRegionById } from "@/data/history-geo";
import { notFound } from "next/navigation";
import PageHeader, { SectionTitle } from "@/components/PageHeader";
import HmTopicCard from "@/components/HmTopicCard";

export function generateStaticParams() {
  return HISTORY_GEO_REGIONS.map((r) => ({ regionId: r.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ regionId: string }>;
}): Promise<Metadata> {
  const { regionId } = await params;
  const region = getRegionById(regionId);
  if (!region) return {};
  return {
    title: `歷史地理 ${region.title} | learn.chparenting.com`,
    description: `免費 ${region.title} 歷史地理線上練習：${region.topics.map((t) => t.title).join("、")}。每個主題先看重點再做題，每題附解說，把地名、年代和事件的關係講清楚；免費使用、不用註冊，適合國小高年級到國中複習。`,
    alternates: {
      canonical: `https://learn.chparenting.com/history-geo/${regionId}`,
    },
  };
}

export default async function RegionOverviewPage({
  params,
}: {
  params: Promise<{ regionId: string }>;
}) {
  const { regionId } = await params;
  const region = getRegionById(regionId);
  if (!region) notFound();

  return (
    <div className="bg-white">
      <PageHeader
        eyebrow="歷史地理"
        title={region.title}
        desc={`${region.topics.length} 個主題，選一個開始練習。大人小孩都能練，每題都有詳解。`}
        icon={<span>{region.icon}</span>}
        iconBg="bg-white border border-slate-200"
      >
        <Link href="/history-geo" className="text-sm font-bold text-[#2457A7] no-underline hover:underline">
          ← 回到歷史地理
        </Link>
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        <SectionTitle>{region.title}主題</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {region.topics.map((topic) => {
            const qCount =
              topic.questions.length +
              (topic.readings?.reduce((s, r) => s + r.questions.length, 0) ?? 0);
            return (
              <HmTopicCard
                key={topic.id}
                href={`/history-geo/${region.id}/${topic.id}`}
                icon={topic.icon}
                title={topic.title}
                desc={topic.description}
                chips={[
                  ...(topic.questions.length > 0 ? [`${topic.questions.length} 題練習`] : []),
                  ...(topic.readings && topic.readings.length > 0 ? [`${topic.readings.length} 篇閱讀`] : []),
                  `共 ${qCount} 題`,
                ]}
              />
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link href="/history-geo" className="text-sm font-bold text-[#2457A7] no-underline hover:underline">
            ← 回到歷史地理
          </Link>
        </div>
      </div>
    </div>
  );
}
