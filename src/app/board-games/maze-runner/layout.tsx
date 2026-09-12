import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "迷宮探險｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "迷宮探險：從左上角走到右下角。操作簡單，幼兒園大班以上都能玩，高難度的迷宮對大人也有挑戰。 練的是路徑規劃、空間方向感。免費線上教育桌遊，不用下載、不用註冊，手機平板都能玩。",
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
