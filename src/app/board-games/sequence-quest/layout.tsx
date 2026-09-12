import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "數列探險｜免費兒童益智桌遊線上玩 | learn.chparenting.com",
  description: "數列探險：給一段數列，要推出下一個數字。等差題國小中年級可以做，等比和費氏數列建議高年級以上。 練的是算相鄰兩數的差或倍數、辨認不只一種規律的可能性。免費線上教育桌遊，不用下載、不用註冊，手機平板都能玩。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/sequence-quest" },
};

export default function SequenceQuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="sequence-quest" />
    </>
  );
}
