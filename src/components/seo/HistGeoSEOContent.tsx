import PracticeTopicSEO from "./PracticeTopicSEO";
import type { HistGeoRegion, HistGeoTopic } from "@/data/history-geo";

const BASE = "https://learn.chparenting.com";

const TIPS = [
  "一次做 10 題就好，做完把答錯的題目解說唸一次，比一口氣做完整組有效",
  "答錯不用馬上糾正，先問孩子「你為什麼選這個？」，常常會發現是題目讀太快",
  "隔幾天再做一次同一組題目，記得住的才是真的學會了",
  "遇到有興趣的題目，可以延伸查地圖或紀錄片，這個主題最適合往外延伸",
];

export default function HistGeoSEOContent({
  region,
  topic,
}: {
  region: HistGeoRegion;
  topic: HistGeoTopic;
}) {
  const explained = topic.questions.filter((q) => q.explain);
  const readingCount = topic.readings?.length ?? 0;
  const totalQ =
    topic.questions.length +
    (topic.readings?.reduce((s, r) => s + r.questions.length, 0) ?? 0);

  return (
    <PracticeTopicSEO
      h1={`${topic.title}（${region.title}）｜${totalQ} 題免費線上練習`}
      topicTitle={topic.title}
      description={topic.description}
      totalQuestions={totalQ}
      explainedCount={explained.length}
      keyPoints={explained.slice(0, 10).map((q) => q.explain!)}
      keyPointsHeading={`📖 ${topic.title}重點知識`}
      sampleQuestions={topic.questions.slice(0, 3).map((q) => q.s)}
      readingCount={readingCount}
      audienceNote="適合國小到國中階段，免費使用、不需註冊。"
      tips={TIPS}
      faqs={[
        {
          q: "這個主題適合幾年級？",
          a: `題目以國小社會科的範圍為主，中高年級可以自己作答，低年級建議家長陪著唸題目。國中生也可以當作複習${topic.title}的快速測驗。`,
        },
        {
          q: "答錯了看得到解釋嗎？",
          a: `可以。這個主題有 ${explained.length} 題附解說，作答後立刻顯示，不用等全部做完才知道對錯。`,
        },
        {
          q: "需要註冊或付費嗎？",
          a: "不用。所有題目免費開放，不需要註冊帳號，手機和電腦都可以直接練習。",
        },
      ]}
      siblings={region.topics
        .filter((t) => t.id !== topic.id)
        .map((t) => ({ href: `/history-geo/${region.id}/${t.id}`, label: `${t.icon} ${t.title}` }))}
      siblingsHeading={`${region.title}的其他主題`}
      backHref="/history-geo"
      backLabel="回到歷史地理總覽"
      theme={{
        summary: "bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-emerald-100",
        chevron: "text-emerald-600",
        link: "text-emerald-600 hover:text-emerald-800",
      }}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "LearningResource",
        name: `${topic.title}（${region.title}）`,
        description: topic.description,
        url: `${BASE}/history-geo/${region.id}/${topic.id}`,
        inLanguage: "zh-TW",
        learningResourceType: "Quiz",
        educationalLevel: "國小",
        isAccessibleForFree: true,
        teaches: topic.title,
        numberOfItems: totalQ,
      }}
    />
  );
}
