import type { Metadata } from "next";
import { NOINDEX_FOLLOW } from "@/lib/seo";
import { DashboardNav } from "./DashboardNav";

// 個人儀表板要登入才有內容，對搜尋者沒有東西，不進索引；分頁列是 client 元件所以拆到 DashboardNav
export const metadata: Metadata = {
  title: "我的學習 | learn.chparenting.com",
  robots: NOINDEX_FOLLOW,
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardNav>{children}</DashboardNav>;
}
