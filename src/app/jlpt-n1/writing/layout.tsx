import type { Metadata } from "next";
import WritingSEO from "@/components/seo/WritingSEO";
import { N1_WRITING } from "@/data/writing/jlpt-n1-writing";

export const metadata: Metadata = {
  title: "JLPT N1寫作練習｜免費線上練習 | learn.chparenting.com",
  description: "日檢 N1寫作練習：題型解析與範例引導，從單句到短文一步一步寫，每題附解析與常見錯誤提醒，寫完可對照範例修改，適合每週練兩三篇。免費線上使用、不用註冊，手機平板都能用。",
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
