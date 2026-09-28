import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "免費兒童打字練習 | 鍵盤入門・速度訓練 | learn.chparenting.com",
  description: "國小生免費打字練習：句子打字、落下文字、限時挑戰、速度測試四種玩法，中文和英文打字都能練，即時顯示速度與正確率。不用下載、不用註冊，打開就能練。",
  alternates: { canonical: "https://learn.chparenting.com/typing-game" },
};

export default function TypingGameLayout({ children }: { children: React.ReactNode }) {
  return children;
}
