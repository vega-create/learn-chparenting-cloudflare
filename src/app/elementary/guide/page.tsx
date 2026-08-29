import { Metadata } from "next";
import { UNITS } from "@/data/elementary";
import { getUnitGuide } from "@/lib/unit-guides";
import GuideOverviewClient from "./GuideOverviewClient";

export const metadata: Metadata = {
  title: "GEPT 初級家長陪伴指南 | learn.chparenting.com",
  description: "不知道怎麼陪孩子學英文？30 秒看完就知道今天陪什麼、怎麼陪、要多久。GEPT 初級每單元家長指南。",
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
