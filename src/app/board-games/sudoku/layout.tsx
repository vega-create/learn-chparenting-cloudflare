import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "數獨｜免費線上 6×6、9×9 兒童數獨 | learn.chparenting.com",
  description: "免費線上數獨：6×6 和 9×9 共四種程度，每一題都只有一個答案、不用猜。填錯會提示，可以開筆記記下可能的數字，有三次提示。手機平板都能玩，不用下載、不用註冊。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/sudoku" },
};

export default function SudokuLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="sudoku" />
    </>
  );
}
