import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "迴圈建造師｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "迴圈建造師：用迴圈畫出圖形。免費線上教育桌遊，訓練邏輯思維與專注力，適合國小學童，不用下載直接玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/loop-builder" },
};

export default function LoopBuilderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
