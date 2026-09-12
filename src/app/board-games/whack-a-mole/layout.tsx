import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "打地鼠｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "打地鼠：地鼠從洞裡冒出來就點，金色地鼠加倍得分，但炸彈點下去會扣分。全站最簡單的一款，幼兒園小朋友也能玩。 練的是手眼協調、在快速反應中仍要辨認目標。免費線上教育桌遊，不用下載、不用註冊，手機平板都能玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/whack-a-mole" },
};

export default function WhackAMoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="whack-a-mole" />
    </>
  );
}
