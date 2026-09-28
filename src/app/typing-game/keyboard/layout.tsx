import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "鍵盤位置練習｜基準鍵、上排、下排分階段打字練習 | learn.chparenting.com",
  description: "免費鍵盤位置練習：畫面上的鍵盤會標出要按哪個鍵、用哪根手指，從基準鍵 ASDF JKL; 開始，分六個階段練到整個鍵盤。可切換顯示注音位置，適合第一次學打字的國小生。",
  alternates: { canonical: "https://learn.chparenting.com/typing-game/keyboard" },
};

export default function KeyboardPracticeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
