import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GEPT 中級口說練習｜免費線上練習 | learn.chparenting.com",
  description: "全民英檢中級口說練習：跟讀句型與情境對話，練出開口的自信。免費使用，無需註冊。",
  alternates: { canonical: "https://learn.chparenting.com/intermediate/speaking" },
};

export default function IntermediateSpeakingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
