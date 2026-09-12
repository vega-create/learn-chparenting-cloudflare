import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "免費兒童打字練習 | 鍵盤入門・速度訓練 | learn.chparenting.com",
  description: "免費兒童打字練習：從認識鍵盤與手指位置開始，句子打字、落下文字、速度測試、限時挑戰四種模式，中英文都能練，即時顯示速度與正確率。適合剛接觸電腦的國小生，不用下載、不用註冊。",
  alternates: { canonical: "https://learn.chparenting.com/typing-game" },
};

export default function TypingGameLayout({ children }: { children: React.ReactNode }) {
  return children;
}
