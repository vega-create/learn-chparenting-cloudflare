import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "快速排序｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "快速排序：給一組打亂的數字，用最快速度依序點成正確順序。低年級可以練兩位數，高年級的題目會出現較大的數。 練的是數字大小的直覺判斷、先掃過全部再動手。免費線上教育桌遊，不用下載、不用註冊，手機平板都能玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/speed-sort" },
};

export default function SpeedSortLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="speed-sort" />
    </>
  );
}
