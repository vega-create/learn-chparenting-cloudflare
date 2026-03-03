import type { HistGeoRegion } from "./types";
export type { HistGeoQ, HistGeoReading, HistGeoTopic, HistGeoRegion } from "./types";

// Taiwan
import taiwanHistory from "./taiwan/history";
import taiwanGeography from "./taiwan/geography";
import taiwanCulture from "./taiwan/culture";

// Asia
import asiaHistory from "./asia/history";
import asiaGeography from "./asia/geography";

// World
import worldHistory from "./world/history";
import worldGeography from "./world/geography";
import worldCulture from "./world/culture";

export const HISTORY_GEO_REGIONS: HistGeoRegion[] = [
  {
    id: "taiwan",
    title: "台灣篇",
    icon: "🇹🇼",
    color: "from-emerald-500 to-emerald-600",
    border: "border-emerald-200",
    accentColor: "text-emerald-600",
    topics: [taiwanHistory, taiwanGeography, taiwanCulture],
  },
  {
    id: "asia",
    title: "亞洲篇",
    icon: "🌏",
    color: "from-amber-500 to-amber-600",
    border: "border-amber-200",
    accentColor: "text-amber-600",
    topics: [asiaHistory, asiaGeography],
  },
  {
    id: "world",
    title: "世界篇",
    icon: "🌍",
    color: "from-indigo-500 to-indigo-600",
    border: "border-indigo-200",
    accentColor: "text-indigo-600",
    topics: [worldHistory, worldGeography, worldCulture],
  },
];

export function getRegionById(regionId: string) {
  return HISTORY_GEO_REGIONS.find((r) => r.id === regionId);
}

export function getTopicByIds(regionId: string, topicId: string) {
  const region = getRegionById(regionId);
  if (!region) return undefined;
  const topic = region.topics.find((t) => t.id === topicId);
  if (!topic) return undefined;
  return { region, topic };
}

export function getTotalQuestionCount(): number {
  return HISTORY_GEO_REGIONS.reduce(
    (sum, r) =>
      sum +
      r.topics.reduce(
        (ts, t) =>
          ts + t.questions.length + (t.readings?.reduce((rs, rd) => rs + rd.questions.length, 0) ?? 0),
        0
      ),
    0
  );
}
