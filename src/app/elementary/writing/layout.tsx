import type { Metadata } from "next";
import WritingSEO from "@/components/seo/WritingSEO";
import { ELEM_WRITING } from "@/data/writing/elementary-writing";

export const metadata: Metadata = {
  title: "GEPT 初級寫作練習｜免費線上練習 | learn.chparenting.com",
  description: "全民英檢初級寫作練習：句子重組、中翻英、段落排序、引導式寫作四種題型，每題附範例與解析，從一句話練到一段，寫完可對照範例修改。免費線上使用、不用註冊，手機平板都能用。",
  alternates: { canonical: "https://learn.chparenting.com/elementary/writing" },
};

export default function ElementaryWritingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <WritingSEO levelName="GEPT 初級" levelPath="elementary" language="en" data={ELEM_WRITING} />
    </>
  );
}
