import ClientPage from "./ClientPage";
import { getModuleById } from "@/data/finance/modules";
import type { Metadata } from "next";

export function generateStaticParams() {
  return [
    { module: "money-basics" },
    { module: "needs-vs-wants" },
    { module: "savings-calculator" },
    { module: "allowance-budget" },
    { module: "red-envelope" },
    { module: "expense-tracker" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string }>;
}): Promise<Metadata> {
  const { module } = await params;
  const m = getModuleById(module);
  if (!m) return {};
  return {
    title: `${m.title}｜兒童理財教育免費教材 | learn.chparenting.com`,
    description: `兒童理財教育「${m.title}」：${m.description}。互動式學習，免費線上使用，幫孩子從小建立正確金錢觀。`,
    alternates: { canonical: `https://learn.chparenting.com/finance/${m.id}` },
  };
}

export default function Page() {
  return <ClientPage />;
}
