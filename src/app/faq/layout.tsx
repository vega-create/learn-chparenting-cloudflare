import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "常見問題 | learn.chparenting.com 免費親子學習平台",
  description: "learn.chparenting.com 常見問題：是不是真的免費、要不要註冊、適合幾歲、有哪些科目、手機平板能不能用、學習進度怎麼保存、和官方全民英檢有沒有關係。所有功能免費，沒有付費方案。",
  alternates: { canonical: "https://learn.chparenting.com/faq" },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
