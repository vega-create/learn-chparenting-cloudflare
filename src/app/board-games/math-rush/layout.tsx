import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "數學衝刺｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "數學衝刺：限時內盡量算對算式。難度自動調整，從一位數加法到多位數運算都有，國小各年級都適用。 練的是心算的速度與穩定度、在時間壓力下維持正確率。免費線上教育桌遊，不用下載、不用註冊，手機平板都能玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/math-rush" },
};

export default function MathRushLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="math-rush" />
    </>
  );
}
