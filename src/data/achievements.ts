export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
}

export type AchievementCategory =
  | "milestone"
  | "mastery"
  | "games"
  | "consistency"
  | "explorer"
  | "fun";

export const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  milestone: "新手里程碑",
  mastery: "學科精通",
  games: "桌遊成就",
  consistency: "持續學習",
  explorer: "探索達人",
  fun: "趣味成就",
};

export const ACHIEVEMENTS: Achievement[] = [
  // ── 新手里程碑 ──
  {
    id: "first-steps",
    name: "學習起步",
    description: "完成第一個學習單元",
    icon: "🌱",
    category: "milestone",
  },
  {
    id: "first-game",
    name: "遊戲新手",
    description: "完成第一場桌遊",
    icon: "🎮",
    category: "milestone",
  },
  {
    id: "first-challenge",
    name: "挑戰初體驗",
    description: "完成第一次每日挑戰",
    icon: "✨",
    category: "milestone",
  },

  // ── 學科精通 ──
  {
    id: "english-learner",
    name: "英語小達人",
    description: "完成 5 個英檢單元",
    icon: "📘",
    category: "mastery",
  },
  {
    id: "japanese-learner",
    name: "日語小達人",
    description: "完成 5 個日文單元",
    icon: "🇯🇵",
    category: "mastery",
  },
  {
    id: "math-whiz",
    name: "數學小天才",
    description: "完成 3 個數學主題",
    icon: "🔢",
    category: "mastery",
  },
  {
    id: "music-maestro",
    name: "音樂小老師",
    description: "完成 3 個樂理單元",
    icon: "🎵",
    category: "mastery",
  },

  // ── 桌遊成就 ──
  {
    id: "game-master",
    name: "桌遊大師",
    description: "在任意桌遊中獲得 3 顆星",
    icon: "⭐",
    category: "games",
  },
  {
    id: "memory-king",
    name: "記憶王",
    description: "記憶翻牌得到 100 分以上",
    icon: "🧠",
    category: "games",
  },
  {
    id: "speed-demon",
    name: "快速反應王",
    description: "色彩快手得到 80 分以上",
    icon: "⚡",
    category: "games",
  },
  {
    id: "game-collector",
    name: "桌遊收藏家",
    description: "玩過 10 款不同桌遊",
    icon: "🎲",
    category: "games",
  },

  // ── 持續學習 ──
  {
    id: "three-day-streak",
    name: "三日連續",
    description: "連續 3 天使用平台學習",
    icon: "🔥",
    category: "consistency",
  },
  {
    id: "week-warrior",
    name: "一週勇士",
    description: "連續 7 天使用平台學習",
    icon: "💪",
    category: "consistency",
  },

  // ── 探索達人 ──
  {
    id: "curious-explorer",
    name: "好奇探險家",
    description: "試用過 3 種不同學習工具",
    icon: "🔍",
    category: "explorer",
  },
  {
    id: "all-rounder",
    name: "全方位學習者",
    description: "試用過 6 種不同學習工具",
    icon: "🌈",
    category: "explorer",
  },
  {
    id: "platform-master",
    name: "平台達人",
    description: "試用過全部 9 種學習工具",
    icon: "👑",
    category: "explorer",
  },

  // ── 趣味成就 ──
  {
    id: "night-owl",
    name: "夜貓子學霸",
    description: "在晚上 10 點後學習",
    icon: "🦉",
    category: "fun",
  },
  {
    id: "early-bird",
    name: "早起的鳥兒",
    description: "在早上 7 點前學習",
    icon: "🐦",
    category: "fun",
  },
];

export const ACHIEVEMENT_MAP = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a])
) as Record<string, Achievement>;
