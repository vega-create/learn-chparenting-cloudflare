import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "常見問題 | learn.chparenting.com 免費親子學習平台",
  description: "親子多元學習平台常見問題：免費使用、適合年齡、學習內容、手機支援等。所有功能完全免費，不需要花補習費。",
  alternates: { canonical: "https://learn.chparenting.com/faq" },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
