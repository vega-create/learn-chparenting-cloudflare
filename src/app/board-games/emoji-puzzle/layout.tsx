import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "表情密碼｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "表情密碼：用表情符號代替未知數的方程式。不用學過代數也能玩，是接觸「未知數」概念很好的起點，國小中年級起。 練的是代數的入門概念（符號代表一個固定的數）、多步驟推理。免費線上教育桌遊，不用下載、不用註冊，手機平板都能玩。",
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
