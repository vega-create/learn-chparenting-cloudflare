import { Metadata } from "next";
import { INTER_UNITS } from "@/data/intermediate";
import { GEPT_INTERMEDIATE_GUIDES } from "@/data/guides/gept-intermediate-guides";
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
  const unit = INTER_UNITS.find((u) => u.id === num);
  const title = unit ? `${unit.title} 家長陪伴指南` : "家長陪伴指南";

  return {
    title: `${title} | GEPT 中級 | learn.chparenting.com`,
    description: `不知道怎麼陪孩子學${unit?.title || "英文"}？30 秒看完就知道今天陪什麼、怎麼陪、要多久。`,
  };
}

export function generateStaticParams() {
  return INTER_UNITS.map((u) => ({ unitId: `unit-${String(u.id).padStart(2, "0")}` }));
}

export default async function Page({ params }: Props) {
  const { unitId } = await params;
  const num = getUnitNum(unitId);
  const unit = INTER_UNITS.find((u) => u.id === num);
  const guide = GEPT_INTERMEDIATE_GUIDES[num];

  if (!unit || !guide) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800">找不到此指南</h1>
        <a href="/intermediate/guide" className="text-indigo-600 hover:underline mt-4 inline-block">
          ← 返回 GEPT 中級指南總覽
        </a>
      </div>
    );
  }

  const nextNum = num + 1;
  const hasNext = INTER_UNITS.some((u) => u.id === nextNum) && !!GEPT_INTERMEDIATE_GUIDES[nextNum];
  const nextGuideUrl = hasNext ? `/intermediate/guide/unit-${String(nextNum).padStart(2, "0")}` : undefined;
  const pdfUrl = `/worksheets/gept/intermediate/${unitId}.pdf`;
  const unitUrl = `/intermediate/unit/${num}`;

  return (
    <GuidePageClient
      unitTitle={`第${num}單元：${unit.title}`}
      unitId={unitId}
      level="intermediate"
      toolSlug="gept"
      toolName="GEPT 中級"
      ebookSlug="gept-intermediate"
      color="blue"
      guide={guide}
      pdfUrl={pdfUrl}
      nextGuideUrl={nextGuideUrl}
      unitUrl={unitUrl}
    />
  );
}
