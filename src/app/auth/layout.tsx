import type { Metadata } from "next";
import { NOINDEX_FOLLOW } from "@/lib/seo";

// OAuth 回呼頁，只是過場，不進索引
export const metadata: Metadata = {
  title: "登入中 | learn.chparenting.com",
  robots: NOINDEX_FOLLOW,
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
