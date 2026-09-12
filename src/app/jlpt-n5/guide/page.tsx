import { Metadata } from "next";
import { N5_UNITS } from "@/data/jlpt-n5";
import { JLPT_N5_GUIDES } from "@/data/guides/jlpt-n5-guides";
import GuideOverviewClient from "./GuideOverviewClient";

export const metadata: Metadata = {
  title: "日文 N5 家長陪伴指南 | learn.chparenting.com",
  description: "日檢 N5家長陪伴指南：每個單元 30 秒看完今天要陪什麼、怎麼陪、大約要多久，還有孩子最常卡住的地方和怎麼帶過。不用懂日文也能陪，免費使用。",
};

export default function Page() {
  const units = N5_UNITS.map((u) => ({
    id: u.id,
    title: u.title,
    icon: u.icon,
    hasGuide: !!JLPT_N5_GUIDES[u.id],
    estimatedTime: JLPT_N5_GUIDES[u.id]?.estimatedTime || "15 分鐘",
    learningGoal: JLPT_N5_GUIDES[u.id]?.learningGoal || "",
  }));

  return (
    <GuideOverviewClient
      toolName="日文 N5"
      level="n5"
      toolSlug="japanese"
      ebookSlug="japanese-n5"
      units={units}
    />
  );
}
