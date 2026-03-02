import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "免費兒童打字練習 | 鍵盤入門・速度訓練 | learn.chparenting.com",
  description: "免費兒童打字練習，從認識鍵盤開始，逐步提升打字速度和正確率。適合剛接觸電腦的小朋友。",
  alternates: { canonical: "https://learn.chparenting.com/typing-game" },
};

export default function TypingGameLayout({ children }: { children: React.ReactNode }) {
  return children;
}
