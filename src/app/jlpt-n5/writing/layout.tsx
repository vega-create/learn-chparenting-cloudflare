import type { Metadata } from "next";
import WritingSEO from "@/components/seo/WritingSEO";
import { N5_WRITING } from "@/data/writing/jlpt-n5-writing";

export const metadata: Metadata = {
  title: "JLPT N5寫作練習｜免費線上練習 | learn.chparenting.com",
  description: "日檢 N5寫作練習：題型解析與範例引導，一步步寫出完整句子與段落。免費使用，無需註冊。",
  alternates: { canonical: "https://learn.chparenting.com/jlpt-n5/writing" },
};

export default function JlptN5WritingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <WritingSEO levelName="JLPT N5" levelPath="jlpt-n5" language="ja" data={N5_WRITING} />
    </>
  );
}
