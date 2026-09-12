import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JLPT N2單字遊戲｜免費線上練習 | learn.chparenting.com",
  description: "日檢 N2單字遊戲：配對、選擇、限時挑戰三種玩法，出題來自日檢 N2各單元的核心字彙，邊玩邊複習。免費線上使用、不用註冊，手機平板都能玩，適合每天 10 分鐘。",
  alternates: { canonical: "https://learn.chparenting.com/jlpt-n2/game" },
};

export default function JlptN2GameLayout({ children }: { children: React.ReactNode }) {
  return children;
}
