import { Metadata } from "next";
import { UNITS } from "@/data/elementary";
import { getUnitGuide } from "@/lib/unit-guides";
import GuideOverviewClient from "./GuideOverviewClient";

export const metadata: Metadata = {
  title: "GEPT 初級家長陪伴指南 | learn.chparenting.com",
  description: "全民英檢初級家長陪伴指南：每個單元 30 秒看完今天要陪什麼、怎麼陪、大約要多久，還有孩子最常卡住的地方和怎麼帶過。不用懂英文也能陪，免費使用。",
};

export default function Page() {
  const units = UNITS.map((u) => ({
    id: u.id,
    title: u.title,
    icon: u.icon,
    hasGuide: !!getUnitGuide("elementary", u.id),
    estimatedTime: getUnitGuide("elementary", u.id)?.estimatedTime || "15 分鐘",
    learningGoal: getUnitGuide("elementary", u.id)?.learningGoal || "",
  }));

  return (
    <GuideOverviewClient
      toolName="GEPT 初級"
      level="elementary"
      toolSlug="gept"
      ebookSlug="gept-elementary"
      units={units}
    />
  );
}
