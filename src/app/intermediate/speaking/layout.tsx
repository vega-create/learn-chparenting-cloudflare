import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GEPT 中級口說練習｜免費線上練習 | learn.chparenting.com",
  description: "全民英檢中級口說練習：跟讀句型與情境對話，可錄下自己的聲音回放比對，練到聽到題目就能開口。免費線上使用、不用註冊，手機就能練，適合每天 5 到 10 分鐘。",
  alternates: { canonical: "https://learn.chparenting.com/intermediate/speaking" },
};

export default function IntermediateSpeakingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
