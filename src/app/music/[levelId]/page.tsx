import type { Metadata } from "next";
import Link from "next/link";
import { MUSIC_LEVELS, getLevelById } from "@/data/music";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return MUSIC_LEVELS.map((l) => ({ levelId: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ levelId: string }>;
}): Promise<Metadata> {
  const { levelId } = await params;
  const level = getLevelById(levelId);
  if (!level) return {};
  return {
    title: `樂理 ${level.title} | learn.chparenting.com`,
    description: `免費樂理 ${level.title} 線上練習：${level.topics.map((t) => t.title).join("、")}。互動式題目，即時回饋。`,
    alternates: {
      canonical: `https://learn.chparenting.com/music/${levelId}`,
    },
  };
}

export default async function LevelOverviewPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  const level = getLevelById(levelId);
  if (!level) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/music"
        className="text-sm text-pink-500 hover:underline no-underline"
      >
        ← 回到樂理基礎
      </Link>

      <div className="text-center mt-4 mb-8">
        <div className="text-5xl mb-2">{level.icon}</div>
        <h1 className="text-2xl font-black text-slate-800">{level.title}</h1>
        <p className="text-sm text-slate-500 mt-1">
          {level.topics.length} 個主題 · 選擇下方主題開始練習
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {level.topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/music/${level.id}/${topic.id}`}
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
                <span className="text-xs px-2.5 py-1 rounded-full bg-pink-50 text-pink-600">
                  ✏️ {topic.questions.length} 題練習
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          href="/music"
          className="text-sm text-pink-500 hover:underline no-underline"
        >
          ← 回到樂理基礎
        </Link>
      </div>
    </div>
  );
}
