import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "成語練習｜成語填空、配對與可列印成語學習單 | learn.chparenting.com",
  description: "免費成語線上練習：成語填空（選出正確的字）、成語與意思配對，分基礎和進階兩種程度。還可以產生成語學習單直接列印，附解答，適合國小中高年級在家練習。",
  alternates: { canonical: "https://learn.chparenting.com/chinese-lang/idiom-practice" },
};

export default function IdiomPracticeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
