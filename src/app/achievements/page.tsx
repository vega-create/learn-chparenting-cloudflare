import type { Metadata } from "next";
import AchievementsGallery from "./AchievementsGallery";

export const metadata: Metadata = {
  title: "學習成就 | learn.chparenting.com 免費親子學習平台",
  description:
    "查看你在親子多元學習平台上獲得的學習成就徽章。完成單元、遊戲、每日挑戰，解鎖更多成就！",
  alternates: { canonical: "https://learn.chparenting.com/achievements" },
};

export default function AchievementsPage() {
  return <AchievementsGallery />;
}
