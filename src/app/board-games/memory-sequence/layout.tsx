import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "記憶旋律｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "記憶旋律：看燈光閃爍的順序，再照同樣順序點回去。前幾輪很簡單，後面難度上升快，各年齡都能找到自己的極限。 練的是順序記憶（記得住內容也要記得住次序）、專注力：中途分心就斷了。免費線上教育桌遊，不用下載、不用註冊，手機平板都能玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/memory-sequence" },
};

export default function MemorySequenceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="memory-sequence" />
    </>
  );
}
