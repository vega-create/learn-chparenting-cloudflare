import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "程式路徑｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "程式路徑：在 5×5 的格子裡，先把方向指令一個一個排成一串「程式」，再按執行讓機器人走。不需要任何程式基礎，看得懂箭頭就能玩，國小中年級起最合適。 練的是把一連串動作先想好再執行（序列思考）、執行後回頭找哪一步錯了（除錯）。免費線上教育桌遊，不用下載、不用註冊，手機平板都能玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/code-path" },
};

export default function CodePathLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="code-path" />
    </>
  );
}
