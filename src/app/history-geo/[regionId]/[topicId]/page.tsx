import ClientPage from "./ClientPage";
import { getRegionById, getTopicByIds } from "@/data/history-geo";
import HistGeoSEOContent from "@/components/seo/HistGeoSEOContent";
import type { Metadata } from "next";

export function generateStaticParams() {
  return [
    // taiwan
    { regionId: "taiwan", topicId: "taiwan-history" },
    { regionId: "taiwan", topicId: "taiwan-geography" },
    { regionId: "taiwan", topicId: "taiwan-culture" },
    // asia
    { regionId: "asia", topicId: "asia-history" },
    { regionId: "asia", topicId: "asia-geography" },
    // world
    { regionId: "world", topicId: "world-history" },
    { regionId: "world", topicId: "world-geography" },
    { regionId: "world", topicId: "world-culture" },
  ];
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ regionId: string; topicId: string }>;
}): Promise<Metadata> {
  const { regionId, topicId } = await params;
  const parent = getRegionById(regionId);
  const found = getTopicByIds(regionId, topicId);
  if (!parent || !found) return {};
  const topic = found.topic;
  return {
    title: `${topic.title}（${parent.title}）｜社會科練習 | learn.chparenting.com`,
    description: `免費歷史地理「${parent.title}」${topic.title}線上練習：${topic.description}。互動式題目即時回饋，適合國小學童，免費使用無需註冊。`,
    alternates: { canonical: `https://learn.chparenting.com/history-geo/${regionId}/${topicId}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ regionId: string; topicId: string }>;
}) {
  const { regionId, topicId } = await params;
  const found = getTopicByIds(regionId, topicId);

  return (
    <>
      <ClientPage />
      {found && (
        <HistGeoSEOContent region={found.region} topic={found.topic} />
      )}
    </>
  );
}
