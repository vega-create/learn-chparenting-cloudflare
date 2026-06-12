import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "迷你數獨｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "迷你數獨：4x4 / 6x6 數獨挑戰。免費線上教育桌遊，訓練邏輯思維與專注力，適合國小學童，不用下載直接玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/mini-sudoku" },
};

export default function MiniSudokuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
