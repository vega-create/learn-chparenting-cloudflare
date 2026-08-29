import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "表情密碼｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "表情密碼：破解表情符號方程式。免費線上教育桌遊，訓練邏輯思維與專注力，適合國小學童，不用下載直接玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/emoji-puzzle" },
};

export default function EmojiPuzzleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="emoji-puzzle" />
    </>
  );
}
