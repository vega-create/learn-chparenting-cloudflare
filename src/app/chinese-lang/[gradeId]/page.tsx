import type { Metadata } from "next";
import Link from "next/link";
import { CHINESE_GRADES, getGradeById } from "@/data/chinese-lang";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return CHINESE_GRADES.map((g) => ({ gradeId: g.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gradeId: string }>;
}): Promise<Metadata> {
  const { gradeId } = await params;
  const grade = getGradeById(gradeId);
  if (!grade) return {};
  return {
    title: `國語 ${grade.title} | learn.chparenting.com`,
    description: `免費國小國語 ${grade.title} 線上練習：${grade.topics.map((t) => t.title).join("、")}。互動式題目，即時回饋。`,
    alternates: {
      canonical: `https://learn.chparenting.com/chinese-lang/${gradeId}`,
    },
  };
}

export default async function GradeOverviewPage({
  params,
}: {
  params: Promise<{ gradeId: string }>;
}) {
  const { gradeId } = await params;
  const grade = getGradeById(gradeId);
  if (!grade) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/chinese-lang"
        className="text-sm text-orange-500 hover:underline no-underline"
      >
        ← 回到國語學習
      </Link>

      <div className="text-center mt-4 mb-8">
        <div className="text-5xl mb-2">{grade.icon}</div>
        <h1 className="text-2xl font-black text-slate-800">{grade.title}</h1>
        <p className="text-sm text-slate-500 mt-1">
          {grade.topics.length} 個主題 · 選擇下方主題開始練習
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {grade.topics.map((topic) => {
          const qCount =
            topic.questions.length +
            (topic.readings?.reduce(
              (s, r) => s + r.questions.length,
              0
            ) ?? 0);
          return (
            <Link
              key={topic.id}
              href={`/chinese-lang/${grade.id}/${topic.id}`}
              className={`bg-white rounded-2xl overflow-hidden border ${topic.border} shadow-sm hover-lift no-underline transition-all hover:shadow-lg`}
            >
              <div
                className={`bg-gradient-to-r ${topic.color} p-4 text-white`}
              >
                <div className="text-3xl mb-1">{topic.icon}</div>
                <div className="text-lg font-bold">{topic.title}</div>
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-600 mb-3">
                  {topic.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {topic.questions.length > 0 && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-600">
                      ✏️ {topic.questions.length} 題練習
                    </span>
                  )}
                  {topic.readings && topic.readings.length > 0 && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
                      📗 {topic.readings.length} 篇閱讀
                    </span>
                  )}
                  <span className="text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-600">
                    共 {qCount} 題
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <Link
          href="/chinese-lang"
          className="text-sm text-orange-500 hover:underline no-underline"
        >
          ← 回到國語學習
        </Link>
      </div>
    </div>
  );
}
