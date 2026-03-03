import { Metadata } from "next";
import { UI_UNITS } from "@/data/upper-intermediate";
import { GEPT_UPPER_INTERMEDIATE_GUIDES } from "@/data/guides/gept-upper-intermediate-guides";
import GuideOverviewClient from "./GuideOverviewClient";

export const metadata: Metadata = {
  title: "GEPT 中高級家長陪伴指南 | learn.chparenting.com",
  description: "不知道怎麼陪孩子學英文？30 秒看完就知道今天陪什麼、怎麼陪、要多久。GEPT 中高級每單元家長指南。",
};

export default function Page() {
  const units = UI_UNITS.map((u) => ({
    id: u.id,
    title: u.title,
    icon: u.icon,
    hasGuide: !!GEPT_UPPER_INTERMEDIATE_GUIDES[u.id],
    estimatedTime: GEPT_UPPER_INTERMEDIATE_GUIDES[u.id]?.estimatedTime || "20 分鐘",
    learningGoal: GEPT_UPPER_INTERMEDIATE_GUIDES[u.id]?.learningGoal || "",
  }));

  return (
    <GuideOverviewClient
      toolName="GEPT 中高級"
      level="upper-intermediate"
      toolSlug="gept"
      ebookSlug="gept-upper-intermediate"
      units={units}
    />
  );
}
