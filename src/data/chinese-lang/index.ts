import type { ChineseGrade, ChineseTopic } from "./types";

import zhuyinTopic from "./lower/zhuyin";
import charactersTopic from "./lower/characters";
import lowerVocabTopic from "./lower/vocabulary";
import lowerReadingTopic from "./lower/reading";

import idiomsTopic from "./middle/idioms";
import middleReadingTopic from "./middle/reading";
import writingTopic from "./middle/writing";

import highIdiomsTopic from "./high/idioms";
import highReadingTopic from "./high/reading";
import grammarTopic from "./high/grammar";

export type { ChineseGrade, ChineseTopic };
export type { ChineseQ, ChineseReading } from "./types";

export const CHINESE_GRADES: ChineseGrade[] = [
  {
    id: "lower",
    title: "低年級（小一小二）",
    icon: "🌱",
    color: "from-orange-400 to-orange-500",
    border: "border-orange-200",
    accentColor: "orange-500",
    topics: [zhuyinTopic, charactersTopic, lowerVocabTopic, lowerReadingTopic],
  },
  {
    id: "middle",
    title: "中年級（小三小四）",
    icon: "📖",
    color: "from-sky-400 to-sky-500",
    border: "border-sky-200",
    accentColor: "sky-500",
    topics: [idiomsTopic, middleReadingTopic, writingTopic],
  },
  {
    id: "high",
    title: "高年級（小五小六）",
    icon: "🚀",
    color: "from-purple-500 to-purple-600",
    border: "border-purple-200",
    accentColor: "purple-600",
    topics: [highIdiomsTopic, highReadingTopic, grammarTopic],
  },
];

export function getGradeById(id: string): ChineseGrade | undefined {
  return CHINESE_GRADES.find((g) => g.id === id);
}

export function getTopicByIds(
  gradeId: string,
  topicId: string
): { grade: ChineseGrade; topic: ChineseTopic } | undefined {
  const grade = getGradeById(gradeId);
  if (!grade) return undefined;
  const topic = grade.topics.find((t) => t.id === topicId);
  if (!topic) return undefined;
  return { grade, topic };
}

/** 所有題目總數 */
export function getTotalQuestionCount(): number {
  return CHINESE_GRADES.reduce(
    (sum, g) =>
      sum +
      g.topics.reduce(
        (ts, t) =>
          ts +
          t.questions.length +
          (t.readings?.reduce((rs, r) => rs + r.questions.length, 0) ?? 0),
        0
      ),
    0
  );
}
