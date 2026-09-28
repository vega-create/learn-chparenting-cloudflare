import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "踩地雷｜免費線上兒童踩地雷（不用猜） | learn.chparenting.com",
  description: "免費線上踩地雷：6×6、8×8、10×10 三種大小。第一下一定安全，每一盤都先確認過不用猜也解得完。手機可以切換挖開和插旗，也可以長按插旗。不用下載、不用註冊。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/minesweeper" },
};

export default function MinesweeperLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="minesweeper" />
    </>
  );
}
