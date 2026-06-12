import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GEPT 初級模擬測驗｜免費線上練習 | learn.chparenting.com",
  description: "全民英檢初級免費線上模擬測驗，全真題型即時計分，考前實戰演練。免費使用，無需註冊。",
  alternates: { canonical: "https://learn.chparenting.com/elementary/mock-test" },
};

export default function ElementaryMockTestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
