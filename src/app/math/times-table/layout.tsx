import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "九九乘法練習｜免費線上九九乘法表測驗 | learn.chparenting.com",
  description: "免費九九乘法線上練習：自己選要練 2 到 9 哪幾個乘法，可照順序或打亂出題，答錯的題目最後會再練一次。附完整九九乘法表對照，手機、平板、電腦都能用，不用註冊。",
  alternates: { canonical: "https://learn.chparenting.com/math/times-table" },
};

export default function TimesTableLayout({ children }: { children: React.ReactNode }) {
  return children;
}
