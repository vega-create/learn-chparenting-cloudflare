import type { Metadata } from "next";
import BoardGameSEO from "@/components/seo/BoardGameSEO";

export const metadata: Metadata = {
  title: "心算氣球｜免費線上心算遊戲，初中高三種程度可選速度 | learn.chparenting.com",
  description: "心算氣球：算式氣球一顆一顆掉下來，算出答案打破它。初級 20 以內加減、中級 100 以內加減與九九乘法、高級兩位數加減與乘除，掉落速度慢中快可選。免費線上玩，不用註冊。",
  alternates: { canonical: "https://learn.chparenting.com/board-games/balloon-math" },
};

export default function BalloonMathLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardGameSEO id="balloon-math" />
    </>
  );
}
