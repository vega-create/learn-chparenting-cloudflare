import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "跳棋｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "跳棋：你執藍棋在下方，AI 執紅棋在上方。規則比圍棋單純，國小低年級就能上手。 練的是利用對方棋子做跳板、全盤調度而不是只推一顆。免費線上教育桌遊，不用下載、不用註冊，手機平板都能玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/chinese-checkers" },
};

export default function ChineseCheckersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="chinese-checkers" />
    </>
  );
}
