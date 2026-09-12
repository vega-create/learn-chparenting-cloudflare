import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "圍棋｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "圍棋：9×9 小棋盤的入門圍棋，你執黑先行與 AI 對弈。9×9 是圍棋最常見的入門盤面，沒學過也能從規則開始，國小中年級以上。 練的是「氣」的概念：棋子的生存條件、圈地與攻防的取捨。免費線上教育桌遊，不用下載、不用註冊，手機平板都能玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/go-game" },
};

export default function GoGameLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="go-game" />
    </>
  );
}
