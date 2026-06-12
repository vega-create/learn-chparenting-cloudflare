import ClientPage from "./ClientPage";
import { getTopicById } from "@/data/math/topics";
import type { Metadata } from "next";

export function generateStaticParams() {
  return [
    { topic: "basic-arithmetic" },
    { topic: "fractions" },
    { topic: "decimals" },
    { topic: "percentages" },
    { topic: "geometry" },
    { topic: "intro-algebra" },
    { topic: "word-problems" },
    { topic: "time-measurement" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const t = getTopicById(topic);
  if (!t) return {};
  return {
    title: `${t.title}練習｜${t.grade}免費數學題庫 | learn.chparenting.com`,
    description: `免費${t.title}線上練習，適合${t.grade}：觀念講解搭配互動題目，即時對答案，循序漸進打好數學基礎。`,
    alternates: { canonical: `https://learn.chparenting.com/math/${t.id}` },
  };
}

export default function Page() {
  return <ClientPage />;
}
