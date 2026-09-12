import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "記憶翻牌｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "記憶翻牌：經典翻牌配對。規則最簡單的一款，幼兒園中班以上就能玩。 練的是短期記憶、記住位置而不只是圖案。免費線上教育桌遊，不用下載、不用註冊，手機平板都能玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/memory-match" },
};

export default function MemoryMatchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="memory-match" />
    </>
  );
}
