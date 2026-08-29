import type { Metadata } from "next";
import WritingSEO from "@/components/seo/WritingSEO";
import { INTER_WRITING } from "@/data/writing/intermediate-writing";

export const metadata: Metadata = {
  title: "GEPT 中級寫作練習｜免費線上練習 | learn.chparenting.com",
  description: "全民英檢中級寫作練習：題型解析與範例引導，一步步寫出完整句子與段落。免費使用，無需註冊。",
  alternates: { canonical: "https://learn.chparenting.com/intermediate/writing" },
};

export default function IntermediateWritingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <WritingSEO levelName="GEPT 中級" levelPath="intermediate" language="en" data={INTER_WRITING} />
    </>
  );
}
