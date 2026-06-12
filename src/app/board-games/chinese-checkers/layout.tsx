import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "跳棋｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "跳棋：經典跳棋策略遊戲。免費線上教育桌遊，訓練邏輯思維與專注力，適合國小學童，不用下載直接玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/chinese-checkers" },
};

export default function ChineseCheckersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
