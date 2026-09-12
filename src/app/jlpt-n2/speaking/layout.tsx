import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JLPT N2口說練習｜免費線上練習 | learn.chparenting.com",
  description: "日檢 N2口說練習：跟讀句型與情境對話，可錄下自己的聲音回放比對，練到聽到題目就能開口。免費線上使用、不用註冊，手機就能練，適合每天 5 到 10 分鐘。",
  alternates: { canonical: "https://learn.chparenting.com/jlpt-n2/speaking" },
};

export default function JlptN2SpeakingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
