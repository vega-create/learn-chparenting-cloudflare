import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "圖案大師｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "圖案大師：每題給一個 3×3 的圖案方格，其中一格是空的，要從選項裡找出符合規律的圖案。沒有文字門檻，認得圖形就能玩，幼兒園大班到國小中年級最合適。 練的是觀察圖形的重複與變化、從有限線索歸納規律。免費線上教育桌遊，不用下載、不用註冊，手機平板都能玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/pattern-master" },
};

export default function PatternMasterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="pattern-master" />
    </>
  );
}
