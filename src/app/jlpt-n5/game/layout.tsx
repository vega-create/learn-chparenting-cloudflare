import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JLPT N5單字遊戲｜免費線上練習 | learn.chparenting.com",
  description: "用互動遊戲記單字，配對、選擇、限時挑戰，邊玩邊複習日檢 N5核心字彙。免費使用，無需註冊。",
  alternates: { canonical: "https://learn.chparenting.com/jlpt-n5/game" },
};

export default function JlptN5GameLayout({ children }: { children: React.ReactNode }) {
  return children;
}
