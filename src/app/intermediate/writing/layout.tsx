import type { Metadata } from "next";
import WritingSEO from "@/components/seo/WritingSEO";
import { INTER_WRITING } from "@/data/writing/intermediate-writing";

export const metadata: Metadata = {
  title: "GEPT 中級寫作練習｜免費線上練習 | learn.chparenting.com",
  description: "全民英檢中級寫作練習：句子重組、中翻英、段落排序、引導式寫作四種題型，每題附範例與解析，從一句話練到一段，寫完可對照範例修改。免費線上使用、不用註冊，手機平板都能用。",
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
