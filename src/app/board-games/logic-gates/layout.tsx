import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "邏輯閘門｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "邏輯閘門：看 AND、OR、NOT 邏輯閘的輸入，判斷輸出是 0 還是 1。概念抽象但規則很少，國小高年級到國中最合適。 練的是理解「而且」「或者」「不是」的差別、正向推導與反向推導。免費線上教育桌遊，不用下載、不用註冊，手機平板都能玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/logic-gates" },
};

export default function LogicGatesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="logic-gates" />
    </>
  );
}
