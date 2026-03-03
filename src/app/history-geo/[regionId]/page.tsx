import type { Metadata } from "next";
import Link from "next/link";
import { HISTORY_GEO_REGIONS, getRegionById } from "@/data/history-geo";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return HISTORY_GEO_REGIONS.map((r) => ({ regionId: r.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ regionId: string }>;
}): Promise<Metadata> {
  const { regionId } = await params;
  const region = getRegionById(regionId);
  if (!region) return {};
  return {
    title: `歷史地理 ${region.title} | learn.chparenting.com`,
    description: `免費 ${region.title} 歷史地理線上練習：${region.topics.map((t) => t.title).join("、")}。互動式題目，即時回饋。`,
    alternates: {
      canonical: `https://learn.chparenting.com/history-geo/${regionId}`,
    },
  };
}

export default async function RegionOverviewPage({
  params,
}: {
  params: Promise<{ regionId: string }>;
}) {
  const { regionId } = await params;
  const region = getRegionById(regionId);
  if (!region) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/history-geo"
        className="text-sm text-emerald-500 hover:underline no-underline"
      >
        ← 回到歷史地理
      </Link>

      <div className="text-center mt-4 mb-8">
        <div className="text-5xl mb-2">{region.icon}</div>
        <h1 className="text-2xl font-black text-slate-800">{region.title}</h1>
        <p className="text-sm text-slate-500 mt-1">
          {region.topics.length} 個主題 · 選擇下方主題開始練習
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {region.topics.map((topic) => {
          const qCount =
            topic.questions.length +
            (topic.readings?.reduce(
              (s, r) => s + r.questions.length,
              0
            ) ?? 0);
          return (
            <Link
              key={topic.id}
              href={`/history-geo/${region.id}/${topic.id}`}
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
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
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
          href="/history-geo"
          className="text-sm text-emerald-500 hover:underline no-underline"
        >
          ← 回到歷史地理
        </Link>
      </div>
    </div>
  );
}
