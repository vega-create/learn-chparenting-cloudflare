import ClientPage from "./ClientPage";
import { getLevelById, getTopicByIds } from "@/data/music";
import MusicTopicSEO from "@/components/seo/MusicTopicSEO";
import type { Metadata } from "next";

export function generateStaticParams() {
  return [
    // intro
    { levelId: "intro", topicId: "notes" },
    { levelId: "intro", topicId: "rhythm" },
    { levelId: "intro", topicId: "pitch" },
    // basic
    { levelId: "basic", topicId: "scales" },
    { levelId: "basic", topicId: "intervals" },
    { levelId: "basic", topicId: "dynamics" },
    // advanced
    { levelId: "advanced", topicId: "chords" },
    { levelId: "advanced", topicId: "form" },
    { levelId: "advanced", topicId: "knowledge" },
  ];
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ levelId: string; topicId: string }>;
}): Promise<Metadata> {
  const { levelId, topicId } = await params;
  const parent = getLevelById(levelId);
  const found = getTopicByIds(levelId, topicId);
  if (!parent || !found) return {};
  const topic = found.topic;
  return {
    title: `${topic.title}（${parent.title}）｜音樂常識練習 | learn.chparenting.com`,
    description: `免費樂理「${parent.title}」${topic.title}線上練習：${topic.description}。互動式題目即時回饋，適合國小學童，免費使用無需註冊。`,
    alternates: { canonical: `https://learn.chparenting.com/music/${levelId}/${topicId}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ levelId: string; topicId: string }>;
}) {
  const { levelId, topicId } = await params;
  const found = getTopicByIds(levelId, topicId);

  return (
    <>
      <ClientPage />
      {found && (
        <MusicTopicSEO
          level={{ id: found.level.id, title: found.level.title }}
          topic={found.topic}
          siblings={found.level.topics
            .filter((t) => t.id !== found.topic.id)
            .map((t) => ({ id: t.id, title: t.title, icon: t.icon }))}
        />
      )}
    </>
  );
}
