import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JLPT N5模擬測驗｜免費線上練習 | learn.chparenting.com",
  description: "日檢 N5免費線上模擬測驗，全真題型即時計分，考前實戰演練。免費使用，無需註冊。",
  alternates: { canonical: "https://learn.chparenting.com/jlpt-n5/mock-test" },
};

export default function JlptN5MockTestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
