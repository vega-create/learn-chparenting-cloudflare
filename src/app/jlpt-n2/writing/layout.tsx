import type { Metadata } from "next";
import WritingSEO from "@/components/seo/WritingSEO";
import { N2_WRITING } from "@/data/writing/jlpt-n2-writing";

export const metadata: Metadata = {
  title: "JLPT N2寫作練習｜免費線上練習 | learn.chparenting.com",
  description: "日檢 N2寫作練習：題型解析與範例引導，一步步寫出完整句子與段落。免費使用，無需註冊。",
  alternates: { canonical: "https://learn.chparenting.com/jlpt-n2/writing" },
};

export default function JlptN2WritingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <WritingSEO levelName="JLPT N2" levelPath="jlpt-n2" language="ja" data={N2_WRITING} />
    </>
  );
}
