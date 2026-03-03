export interface HistGeoQ {
  s: string;        // 題幹
  opts: string[];   // 4 選項
  ans: number;      // 正確答案 index (0-3)
  explain?: string; // 解說
}

export interface HistGeoReading {
  passage: string;
  questions: { q: string; opts: string[]; ans: number }[];
}

export interface HistGeoTopic {
  id: string;           // URL slug
  title: string;        // 顯示名稱
  icon: string;         // emoji
  description: string;  // 卡片描述
  color: string;        // Tailwind gradient (e.g. "from-emerald-500 to-emerald-600")
  border: string;       // border 色
  questions: HistGeoQ[];
  readings?: HistGeoReading[];
}

export interface HistGeoRegion {
  id: string;           // "taiwan" | "asia" | "world"
  title: string;
  icon: string;
  color: string;
  border: string;
  accentColor: string;  // Tailwind text color for active states
  topics: HistGeoTopic[];
}
