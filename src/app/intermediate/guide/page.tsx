import { Metadata } from "next";
import { INTER_UNITS } from "@/data/intermediate";
import { GEPT_INTERMEDIATE_GUIDES } from "@/data/guides/gept-intermediate-guides";
import GuideOverviewClient from "./GuideOverviewClient";

export const metadata: Metadata = {
  title: "GEPT 中級家長陪伴指南 | learn.chparenting.com",
  description: "全民英檢中級家長陪伴指南：每個單元 30 秒看完今天要陪什麼、怎麼陪、大約要多久，還有孩子最常卡住的地方和怎麼帶過。不用懂英文也能陪，免費使用。",
};

export default function Page() {
  const units = INTER_UNITS.map((u) => ({
    id: u.id,
    title: u.title,
    icon: u.icon,
    hasGuide: !!GEPT_INTERMEDIATE_GUIDES[u.id],
    estimatedTime: GEPT_INTERMEDIATE_GUIDES[u.id]?.estimatedTime || "15 分鐘",
    learningGoal: GEPT_INTERMEDIATE_GUIDES[u.id]?.learningGoal || "",
  }));

  return (
    <GuideOverviewClient
      toolName="GEPT 中級"
      level="intermediate"
      toolSlug="gept"
      ebookSlug="gept-intermediate"
      units={units}
    />
  );
}
