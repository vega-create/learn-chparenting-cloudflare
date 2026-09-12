import type { Metadata } from "next";
import AchievementsGallery from "./AchievementsGallery";

export const metadata: Metadata = {
  title: "學習成就 | learn.chparenting.com 免費親子學習平台",
  description:
    "學習成就徽章：完成第一個單元、第一場桌遊、每日挑戰，累積 5 個英檢或日檢單元、3 個數學或樂理主題，都會解鎖對應徽章。用看得見的進度幫孩子維持動機，登入後跨裝置同步。",
  alternates: { canonical: "https://learn.chparenting.com/achievements" },
};

export default function AchievementsPage() {
  return <AchievementsGallery />;
}
