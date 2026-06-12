import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "記憶旋律｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "記憶旋律：記住燈光順序。免費線上教育桌遊，訓練邏輯思維與專注力，適合國小學童，不用下載直接玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/memory-sequence" },
};

export default function MemorySequenceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
