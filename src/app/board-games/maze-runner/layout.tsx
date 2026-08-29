import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "迷宮探險｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "迷宮探險：找出迷宮的出路。免費線上教育桌遊，訓練邏輯思維與專注力，適合國小學童，不用下載直接玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/maze-runner" },
};

export default function MazeRunnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="maze-runner" />
    </>
  );
}
