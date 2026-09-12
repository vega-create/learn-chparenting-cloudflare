import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JLPT N3模擬測驗｜免費線上練習 | learn.chparenting.com",
  description: "日檢 N3免費線上模擬測驗：題型比照正式測驗，計時作答、交卷即時計分，答錯的題目可回看解說，考前先熟悉節奏最有效。免費使用、不用註冊，可重複練習。",
  alternates: { canonical: "https://learn.chparenting.com/jlpt-n3/mock-test" },
};

export default function JlptN3MockTestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
