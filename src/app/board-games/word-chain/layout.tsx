import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "接龍大師｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "接龍大師：英文單字接龍：用上一個單字的最後一個字母開頭，接出新的單字。需要一定英文字彙量，建議學過 GEPT 初級或國小三年級以上的英文。 練的是從既有字彙中快速搜尋、英文拼字。免費線上教育桌遊，不用下載、不用註冊，手機平板都能玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/word-chain" },
};

export default function WordChainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="word-chain" />
    </>
  );
}
