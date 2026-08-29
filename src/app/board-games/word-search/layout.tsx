import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "單字搜尋｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "單字搜尋：在字母方陣中找單字。免費線上教育桌遊，訓練邏輯思維與專注力，適合國小學童，不用下載直接玩。",
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
