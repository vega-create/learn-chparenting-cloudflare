import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JLPT N4口說練習｜免費線上練習 | learn.chparenting.com",
  description: "日檢 N4口說練習：跟讀句型與情境對話，練出開口的自信。免費使用，無需註冊。",
  alternates: { canonical: "https://learn.chparenting.com/jlpt-n4/speaking" },
};

export default function JlptN4SpeakingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
