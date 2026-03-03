import type { MusicLevel } from "./types";
export type { MusicQ, MusicTopic, MusicLevel, MusicConcept, ConceptAudioDemo, ConceptImage } from "./types";

// Intro
import notes from "./intro/notes";
import rhythm from "./intro/rhythm";
import pitch from "./intro/pitch";

// Basic
import scales from "./basic/scales";
import intervals from "./basic/intervals";
import dynamics from "./basic/dynamics";

// Advanced
import chords from "./advanced/chords";
import form from "./advanced/form";
import knowledge from "./advanced/knowledge";

export const MUSIC_LEVELS: MusicLevel[] = [
  {
    id: "intro",
    title: "入門篇",
    icon: "🎵",
    color: "from-pink-500 to-pink-600",
    border: "border-pink-200",
    accentColor: "text-pink-600",
    topics: [notes, rhythm, pitch],
  },
  {
    id: "basic",
    title: "基礎篇",
    icon: "🎹",
    color: "from-violet-500 to-violet-600",
    border: "border-violet-200",
    accentColor: "text-violet-600",
    topics: [scales, intervals, dynamics],
  },
  {
    id: "advanced",
    title: "進階篇",
    icon: "🎼",
    color: "from-cyan-500 to-cyan-600",
    border: "border-cyan-200",
    accentColor: "text-cyan-600",
    topics: [chords, form, knowledge],
  },
];

export function getLevelById(levelId: string) {
  return MUSIC_LEVELS.find((l) => l.id === levelId);
}

export function getTopicByIds(levelId: string, topicId: string) {
  const level = getLevelById(levelId);
  if (!level) return undefined;
  const topic = level.topics.find((t) => t.id === topicId);
  if (!topic) return undefined;
  return { level, topic };
}

export function getTotalQuestionCount(): number {
  return MUSIC_LEVELS.reduce(
    (sum, l) => sum + l.topics.reduce((ts, t) => ts + t.questions.length, 0),
    0
  );
}
