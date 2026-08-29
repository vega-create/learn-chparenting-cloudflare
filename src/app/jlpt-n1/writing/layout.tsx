import type { Metadata } from "next";
import WritingSEO from "@/components/seo/WritingSEO";
import { N1_WRITING } from "@/data/writing/jlpt-n1-writing";

export const metadata: Metadata = {
  title: "JLPT N1寫作練習｜免費線上練習 | learn.chparenting.com",
  description: "日檢 N1寫作練習：題型解析與範例引導，一步步寫出完整句子與段落。免費使用，無需註冊。",
  alternates: { canonical: "https://learn.chparenting.com/jlpt-n1/writing" },
};

export default function JlptN1WritingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <WritingSEO levelName="JLPT N1" levelPath="jlpt-n1" language="ja" data={N1_WRITING} />
    </>
  );
}
