import { Metadata } from "next";
import { N5_UNITS } from "@/data/jlpt-n5";
import { JLPT_N5_GUIDES } from "@/data/guides/jlpt-n5-guides";
import GuidePageClient from "./GuidePageClient";

interface Props {
  params: Promise<{ unitId: string }>;
}

function getUnitNum(unitId: string): number {
  const m = unitId.match(/unit-(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { unitId } = await params;
  const num = getUnitNum(unitId);
  const unit = N5_UNITS.find((u) => u.id === num);
  const title = unit ? `${unit.title} 家長陪伴指南` : "家長陪伴指南";

  return {
    title: `${title} | 日文 N5 | learn.chparenting.com`,
    description: `不知道怎麼陪孩子學${unit?.title || "日文"}？30 秒看完就知道今天陪什麼、怎麼陪、要多久。`,
  };
}

export function generateStaticParams() {
  return N5_UNITS.map((u) => ({ unitId: `unit-${String(u.id).padStart(2, "0")}` }));
}

export default async function Page({ params }: Props) {
  const { unitId } = await params;
  const num = getUnitNum(unitId);
  const unit = N5_UNITS.find((u) => u.id === num);
  const guide = JLPT_N5_GUIDES[num];

  if (!unit || !guide) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800">找不到此指南</h1>
        <a href="/jlpt-n5/guide" className="text-indigo-600 hover:underline mt-4 inline-block">
          ← 返回日文 N5 指南總覽
        </a>
      </div>
    );
  }

  const nextNum = num + 1;
  const hasNext = N5_UNITS.some((u) => u.id === nextNum) && !!JLPT_N5_GUIDES[nextNum];
  const nextGuideUrl = hasNext ? `/jlpt-n5/guide/unit-${String(nextNum).padStart(2, "0")}` : undefined;
  const pdfUrl = `/worksheets/japanese/n5/${unitId}.pdf`;
  const unitUrl = `/jlpt-n5/unit/${num}`;

  return (
    <GuidePageClient
      unitTitle={`第${num}單元：${unit.title}`}
      unitId={unitId}
      level="n5"
      toolSlug="japanese"
      toolName="日文 N5"
      ebookSlug="japanese-n5"
      color="red"
      guide={guide}
      pdfUrl={pdfUrl}
      nextGuideUrl={nextGuideUrl}
      unitUrl={unitUrl}
    />
  );
}
