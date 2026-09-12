import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "單字搜尋｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "單字搜尋：在 10×10 的字母方陣裡找出藏起來的英文單字。認得英文字母就能玩，不會拼也可以照著找，國小低年級起。 練的是字母序列的視覺辨識、有系統地掃描而不是亂找。免費線上教育桌遊，不用下載、不用註冊，手機平板都能玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/word-search" },
};

export default function WordSearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="word-search" />
    </>
  );
}
