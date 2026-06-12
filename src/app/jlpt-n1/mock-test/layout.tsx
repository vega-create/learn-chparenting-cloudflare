import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JLPT N1模擬測驗｜免費線上練習 | learn.chparenting.com",
  description: "日檢 N1免費線上模擬測驗，全真題型即時計分，考前實戰演練。免費使用，無需註冊。",
  alternates: { canonical: "https://learn.chparenting.com/jlpt-n1/mock-test" },
};

export default function JlptN1MockTestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
