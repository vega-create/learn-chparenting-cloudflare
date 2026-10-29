import type { Metadata } from "next";
import Link from "next/link";
import { CHINESE_GRADES, getGradeById } from "@/data/chinese-lang";
import { notFound } from "next/navigation";
import { PracticeHeader, TopicCard } from "@/components/MathChineseUI";

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
    description: `免費國小國語 ${grade.title} 線上練習：${grade.topics.map((t) => t.title).join("、")}。每個主題先看觀念再做題，每題附解說，答錯立刻看懂；免費使用、不用註冊，手機平板都能用，適合在家每天練 10 分鐘。`,
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

  const others = CHINESE_GRADES.filter((g) => g.id !== grade.id);
  const lgCols = grade.topics.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <PracticeHeader
          backHref="/chinese-lang"
          backLabel="回到國語學習"
          eyebrow="國語學習"
          title={grade.title}
          desc={`${grade.topics.length} 個主題 · 選擇下方主題開始練習`}
          icon={grade.icon}
        />

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${lgCols} gap-4`}>
          {grade.topics.map((topic) => {
            const qCount =
              topic.questions.length +
              (topic.readings?.reduce(
                (s, r) => s + r.questions.length,
                0
              ) ?? 0);
            const chips = [
              topic.questions.length > 0 ? `${topic.questions.length} 題練習` : "",
              topic.readings && topic.readings.length > 0 ? `${topic.readings.length} 篇閱讀` : "",
              `共 ${qCount} 題`,
            ].filter(Boolean);
            return (
              <TopicCard
                key={topic.id}
                href={`/chinese-lang/${grade.id}/${topic.id}`}
                icon={topic.icon}
                title={topic.title}
                desc={topic.description}
                chips={chips}
                filled
              />
            );
          })}
        </div>

        <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-sm font-bold text-[#263238] mb-3">其他年級</div>
          <div className="flex flex-wrap gap-2">
            {others.map((g) => (
              <Link key={g.id} href={`/chinese-lang/${g.id}`}
                className="px-4 py-2 rounded-xl border border-[#2457A7] text-[#2457A7] bg-white text-sm font-bold no-underline hover:bg-[#EEF3FB]">
                {g.title}
              </Link>
            ))}
            <Link href="/chinese-lang/idiom-practice"
              className="px-4 py-2 rounded-xl border border-slate-200 text-[#263238] bg-white text-sm font-bold no-underline hover:bg-slate-50">
              成語填空・配對・學習單
            </Link>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/chinese-lang"
            className="text-sm text-[#2457A7] hover:underline no-underline"
          >
            ← 回到國語學習
          </Link>
        </div>
      </div>
    </div>
  );
}
