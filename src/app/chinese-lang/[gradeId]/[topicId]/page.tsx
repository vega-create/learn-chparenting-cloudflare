import ClientPage from "./ClientPage";
import { getGradeById, getTopicByIds } from "@/data/chinese-lang";
import ChineseLangSEOContent from "@/components/seo/ChineseLangSEOContent";
import type { Metadata } from "next";

export function generateStaticParams() {
  return [
    // lower
    { gradeId: "lower", topicId: "zhuyin" },
    { gradeId: "lower", topicId: "characters" },
    { gradeId: "lower", topicId: "vocabulary" },
    { gradeId: "lower", topicId: "reading" },
    // middle
    { gradeId: "middle", topicId: "idioms" },
    { gradeId: "middle", topicId: "reading" },
    { gradeId: "middle", topicId: "writing" },
    // high
    { gradeId: "high", topicId: "idioms" },
    { gradeId: "high", topicId: "reading" },
    { gradeId: "high", topicId: "grammar" },
  ];
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ gradeId: string; topicId: string }>;
}): Promise<Metadata> {
  const { gradeId, topicId } = await params;
  const parent = getGradeById(gradeId);
  const found = getTopicByIds(gradeId, topicId);
  if (!parent || !found) return {};
  const topic = found.topic;
  return {
    title: `${topic.title}（${parent.title.replace(/（.*）/, "")}）｜國小國語練習 | learn.chparenting.com`,
    description: `免費國小國語「${parent.title}」${topic.title}線上練習：${topic.description}。每題附解說，答錯可立刻看懂，不限次數反覆練習；適合國小學童，免費使用、不用註冊，手機平板都能用。`,
    alternates: { canonical: `https://learn.chparenting.com/chinese-lang/${gradeId}/${topicId}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ gradeId: string; topicId: string }>;
}) {
  const { gradeId, topicId } = await params;
  const found = getTopicByIds(gradeId, topicId);

  return (
    <>
      <ClientPage />
      {found && <ChineseLangSEOContent grade={found.grade} topic={found.topic} />}
    </>
  );
}
