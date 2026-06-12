import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "圖案大師｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "圖案大師：找出缺失的圖案規律。免費線上教育桌遊，訓練邏輯思維與專注力，適合國小學童，不用下載直接玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/pattern-master" },
};

export default function PatternMasterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
