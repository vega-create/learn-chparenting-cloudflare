import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "色彩快手｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "色彩快手：螢幕出現一個顏色的「文字」，但字本身是別的顏色。要認得顏色的國字，國小中年級以上比較適合。 練的是抑制直覺反應（讀字是自動的，要壓下來）、在干擾下維持專注。免費線上教育桌遊，不用下載、不用註冊，手機平板都能玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/color-tap" },
};

export default function ColorTapLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="color-tap" />
    </>
  );
}
