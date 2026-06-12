import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "圍棋｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "圍棋：9×9 入門圍棋對弈。免費線上教育桌遊，訓練邏輯思維與專注力，適合國小學童，不用下載直接玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/go-game" },
};

export default function GoGameLayout({ children }: { children: React.ReactNode }) {
  return children;
}
