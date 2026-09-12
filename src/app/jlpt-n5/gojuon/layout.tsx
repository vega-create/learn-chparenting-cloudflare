import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "五十音表｜平假名・片假名對照練習 | learn.chparenting.com",
  description: "五十音表免費線上學習：平假名、片假名對照，每個假名可按了聽發音、跟著唸，附記憶測驗確認記住了沒。日文入門第一步，適合兒童與初學者，不用註冊、手機就能練。",
  alternates: { canonical: "https://learn.chparenting.com/jlpt-n5/gojuon" },
};

export default function GojuonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
