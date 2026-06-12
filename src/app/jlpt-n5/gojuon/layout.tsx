import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "五十音表｜平假名・片假名對照練習 | learn.chparenting.com",
  description: "日文五十音互動學習表：平假名、片假名對照、發音練習與記憶測驗，日文入門第一步，免費線上使用。",
  alternates: { canonical: "https://learn.chparenting.com/jlpt-n5/gojuon" },
};

export default function GojuonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
