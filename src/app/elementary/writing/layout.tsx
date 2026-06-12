import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GEPT 初級寫作練習｜免費線上練習 | learn.chparenting.com",
  description: "全民英檢初級寫作練習：題型解析與範例引導，一步步寫出完整句子與段落。免費使用，無需註冊。",
  alternates: { canonical: "https://learn.chparenting.com/elementary/writing" },
};

export default function ElementaryWritingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
