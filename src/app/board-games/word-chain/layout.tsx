import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "接龍大師｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "接龍大師：英文單字接龍挑戰。免費線上教育桌遊，訓練邏輯思維與專注力，適合國小學童，不用下載直接玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/word-chain" },
};

export default function WordChainLayout({ children }: { children: React.ReactNode }) {
  return children;
}
