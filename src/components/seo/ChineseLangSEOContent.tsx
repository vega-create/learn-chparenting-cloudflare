import PracticeTopicSEO from "./PracticeTopicSEO";
import type { ChineseGrade, ChineseTopic } from "@/data/chinese-lang";

const BASE = "https://learn.chparenting.com";

const TIPS = [
  "一次做 10 題就好，答錯的字、詞或成語當場寫一次，比重看十次有效",
  "答錯先問孩子「你是怎麼想的」——注音和國字的錯常常是同一個原因重複出現",
  "閱讀題可以先請孩子把短文唸出聲音，唸過一次理解會好很多",
  "隔幾天再做同一組題目，記得住的才算真的學會了",
];

export default function ChineseLangSEOContent({
  grade,
  topic,
}: {
  grade: ChineseGrade;
  topic: ChineseTopic;
}) {
  const explained = topic.questions.filter((q) => q.explain);
  const readingCount = topic.readings?.length ?? 0;
  const listeningCount = topic.listening?.length ?? 0;
  const totalQ =
    topic.questions.length +
    (topic.readings?.reduce((s, r) => s + r.questions.length, 0) ?? 0) +
    listeningCount;
  const gradeName = grade.title.replace(/（.*）/, "");

  // 閱讀理解主題沒有單題解說，改用短文開頭作為內容樣本
  const passage = topic.readings?.[0]?.passage;

  return (
    <PracticeTopicSEO
      h1={`${topic.title}（${gradeName}）｜${totalQ} 題免費國語線上練習`}
      topicTitle={topic.title}
      description={topic.description}
      totalQuestions={totalQ}
      explainedCount={explained.length}
      keyPoints={explained.slice(0, 10).map((q) => q.explain!)}
      keyPointsHeading={`📖 ${topic.title}重點整理`}
      sampleQuestions={topic.questions.slice(0, 3).map((q) => q.s)}
      passageExcerpt={explained.length === 0 && passage ? passage.slice(0, 120) : undefined}
      readingCount={readingCount}
      listeningCount={listeningCount}
      audienceNote={`依${gradeName}程度設計，免費使用、不需註冊。`}
      tips={TIPS}
      faqs={[
        {
          q: "這個主題適合幾年級？",
          a: `題目依${gradeName}的國語程度設計。低年級建議家長陪著唸題目，中高年級大多可以自己完成。`,
        },
        explained.length > 0
          ? {
              q: "答錯了看得到解釋嗎？",
              a: `可以。這個主題有 ${explained.length} 題附解說，作答後立刻顯示，答錯當下就知道為什麼。`,
            }
          : {
              q: "閱讀理解要怎麼練？",
              a: `這個主題有 ${readingCount} 篇短文、共 ${totalQ} 道理解題。建議先讀完整篇再作答，不要邊讀邊找答案。`,
            },
        {
          q: "需要註冊或付費嗎？",
          a: "不用。所有題目免費開放，不需要註冊帳號，手機和電腦都可以直接練習。",
        },
      ]}
      siblings={grade.topics
        .filter((t) => t.id !== topic.id)
        .map((t) => ({ href: `/chinese-lang/${grade.id}/${t.id}`, label: `${t.icon} ${t.title}` }))}
      siblingsHeading={`${gradeName}的其他主題`}
      backHref="/chinese-lang"
      backLabel="回到國語學習總覽"
      theme={{
        summary: "bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border-orange-100",
        chevron: "text-orange-600",
        link: "text-orange-600 hover:text-orange-800",
      }}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "LearningResource",
        name: `${topic.title}（${gradeName}）`,
        description: topic.description,
        url: `${BASE}/chinese-lang/${grade.id}/${topic.id}`,
        inLanguage: "zh-TW",
        learningResourceType: "Quiz",
        educationalLevel: gradeName,
        isAccessibleForFree: true,
        teaches: topic.title,
        numberOfItems: totalQ,
      }}
    />
  );
}
