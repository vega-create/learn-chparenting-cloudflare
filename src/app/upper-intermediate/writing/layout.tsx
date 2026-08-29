import type { Metadata } from "next";
import WritingSEO from "@/components/seo/WritingSEO";
import { UI_WRITING } from "@/data/writing/upper-intermediate-writing";

export const metadata: Metadata = {
  title: "GEPT 中高級寫作練習｜免費線上練習 | learn.chparenting.com",
  description: "全民英檢中高級寫作練習：題型解析與範例引導，一步步寫出完整句子與段落。免費使用，無需註冊。",
  alternates: { canonical: "https://learn.chparenting.com/upper-intermediate/writing" },
};

export default function UpperIntermediateWritingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <WritingSEO levelName="GEPT 中高級" levelPath="upper-intermediate" language="en" data={UI_WRITING} />
    </>
  );
}
