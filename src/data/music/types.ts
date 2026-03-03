export interface MusicQ {
  s: string;        // 題幹
  opts: string[];   // 4 選項
  ans: number;      // 正確答案 index (0-3)
  explain?: string; // 解說
}

export interface MusicTopic {
  id: string;           // URL slug
  title: string;        // 顯示名稱
  icon: string;         // emoji
  description: string;  // 卡片描述
  color: string;        // Tailwind gradient
  border: string;       // border 色
  questions: MusicQ[];
}

export interface MusicLevel {
  id: string;           // "intro" | "basic" | "advanced"
  title: string;
  icon: string;
  color: string;
  border: string;
  accentColor: string;  // Tailwind text color for active states
  topics: MusicTopic[];
}
