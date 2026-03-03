import { Metadata } from "next";
import { N4_UNITS } from "@/data/jlpt-n4";
import { JLPT_N4_GUIDES } from "@/data/guides/jlpt-n4-guides";
import GuideOverviewClient from "./GuideOverviewClient";

export const metadata: Metadata = {
  title: "日文 N4 家長陪伴指南 | learn.chparenting.com",
  description: "不知道怎麼陪孩子學日文？30 秒看完就知道今天陪什麼、怎麼陪、要多久。JLPT N4 每單元家長指南。",
};

export default function Page() {
  const units = N4_UNITS.map((u) => ({
    id: u.id,
    title: u.title,
    icon: u.icon,
    hasGuide: !!JLPT_N4_GUIDES[u.id],
    estimatedTime: JLPT_N4_GUIDES[u.id]?.estimatedTime || "15 分鐘",
    learningGoal: JLPT_N4_GUIDES[u.id]?.learningGoal || "",
  }));

  return (
    <GuideOverviewClient
      toolName="日文 N4"
      level="n4"
      toolSlug="japanese"
      ebookSlug="japanese-n4"
      units={units}
    />
  );
}
