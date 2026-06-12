import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "色彩快手｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "色彩快手：Stroop 效應顏色挑戰。免費線上教育桌遊，訓練邏輯思維與專注力，適合國小學童，不用下載直接玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/color-tap" },
};

export default function ColorTapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
