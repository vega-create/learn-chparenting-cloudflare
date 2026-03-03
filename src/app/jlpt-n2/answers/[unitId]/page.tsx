import { Metadata } from "next";
import { N2_UNITS } from "@/data/jlpt-n2";
import AnswerPageClient from "./AnswerPageClient";

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
  const unit = N2_UNITS.find((u) => u.id === num);
  const title = unit ? `${unit.title} 答案與解析` : "答案與解析";

  return {
    title: `${title} | 日文 N2 | learn.chparenting.com`,
    description: `日文 N2${unit?.title || ""}練習單答案與詳細解析，幫助孩子理解每一題的解題思路。`,
  };
}

export function generateStaticParams() {
  return N2_UNITS.map((u) => ({ unitId: `unit-${String(u.id).padStart(2, "0")}` }));
}

export default async function Page({ params }: Props) {
  const { unitId } = await params;
  const num = getUnitNum(unitId);
  const unit = N2_UNITS.find((u) => u.id === num);

  if (!unit) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800">找不到此單元</h1>
        <a href="/jlpt-n2" className="text-blue-600 hover:underline mt-4 inline-block">← 返回日文 N2</a>
      </div>
    );
  }

  // Build answers from quiz data
  const answers = unit.quiz.map((q) => ({
    question: q.s,
    options: q.opts,
    answer: q.ans,
    explanation: "", // Will be populated with AI-generated explanations later
  }));

  const nextNum = num + 1;
  const hasNext = N2_UNITS.some((u) => u.id === nextNum);
  const nextUnitUrl = hasNext ? `/jlpt-n2/answers/unit-${String(nextNum).padStart(2, "0")}` : undefined;
  const pdfUrl = `/worksheets/japanese/n2/${unitId}.pdf`;

  return (
    <AnswerPageClient
      unitTitle={`第${num}單元：${unit.title}`}
      unitId={unitId}
      level="n2"
      toolSlug="japanese"
      toolName="日文 N2"
      ebookSlug="japanese-n2"
      color="emerald"
      answers={answers}
      nextUnitUrl={nextUnitUrl}
      pdfUrl={pdfUrl}
    />
  );
}
