import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "登入 | learn.chparenting.com",
  description: "登入親子多元學習平台，同步學習進度與成就。",
  alternates: { canonical: "https://learn.chparenting.com/login" },
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
