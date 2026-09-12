import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "迷你數獨｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "迷你數獨：用水果圖案代替數字的 4×4 數獨。用水果不用數字，不會加減法也能玩，國小低年級就可以開始。 練的是同時考慮橫、直、宮格三個條件、刪去法。免費線上教育桌遊，不用下載、不用註冊，手機平板都能玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/mini-sudoku" },
};

export default function MiniSudokuLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="mini-sudoku" />
    </>
  );
}
