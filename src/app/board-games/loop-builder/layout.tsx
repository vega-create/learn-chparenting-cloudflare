import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "迴圈建造師｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "迴圈建造師：設定「重複幾次」「前進幾步」「轉幾度」三個參數，讓烏龜畫出和目標一樣的圖形。需要一點角度概念，國小高年級以上比較不會卡住。 練的是用重複取代逐步指令（迴圈概念）、從圖形反推需要的參數。免費線上教育桌遊，不用下載、不用註冊，手機平板都能玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/loop-builder" },
};

export default function LoopBuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="loop-builder" />
    </>
  );
}
