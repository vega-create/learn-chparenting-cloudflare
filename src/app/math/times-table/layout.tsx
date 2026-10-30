import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "九九乘法練習｜九九乘法表到多位數乘法線上練習 | learn.chparenting.com",
  description: "免費乘法線上練習：基礎是 2 到 9 的九九乘法，可照順序或打亂出題；進階、高階是兩位數、三位數乘一位數和兩位數，隨機出題。答錯的題目最後會再練一次，附九九乘法表，不用註冊。",
  alternates: { canonical: "https://learn.chparenting.com/math/times-table" },
};

export default function TimesTableLayout({ children }: { children: React.ReactNode }) {
  return <div className="">{children}</div>;
}
