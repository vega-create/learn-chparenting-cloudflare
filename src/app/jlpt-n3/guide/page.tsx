import { Metadata } from "next";
import { N3_UNITS } from "@/data/jlpt-n3";
import { JLPT_N3_GUIDES } from "@/data/guides/jlpt-n3-guides";
import GuideOverviewClient from "./GuideOverviewClient";

export const metadata: Metadata = {
  title: "日文 N3 家長陪伴指南 | learn.chparenting.com",
  description: "不知道怎麼陪孩子學日文？30 秒看完就知道今天陪什麼、怎麼陪、要多久。JLPT N3 每單元家長指南。",
};

export default function Page() {
  const units = N3_UNITS.map((u) => ({
    id: u.id,
    title: u.title,
    icon: u.icon,
    hasGuide: !!JLPT_N3_GUIDES[u.id],
    estimatedTime: JLPT_N3_GUIDES[u.id]?.estimatedTime || "15 分鐘",
    learningGoal: JLPT_N3_GUIDES[u.id]?.learningGoal || "",
  }));

  return (
    <GuideOverviewClient
      toolName="日文 N3"
      level="n3"
      toolSlug="japanese"
      ebookSlug="japanese-n3"
      units={units}
    />
  );
}
