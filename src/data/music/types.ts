export interface MusicQ {
  s: string;        // 題幹
  opts: string[];   // 4 選項
  ans: number;      // 正確答案 index (0-3)
  explain?: string; // 解說
}

export interface MusicConcept {
  title: string;        // 小節標題
  explanation: string;  // 1-2 句說明
  keyPoints: string[];  // 重點條列
  visual?: string;      // 視覺圖示（monospace 呈現）
}

export interface MusicTopic {
  id: string;           // URL slug
  title: string;        // 顯示名稱
  icon: string;         // emoji
  description: string;  // 卡片描述
  color: string;        // Tailwind gradient
  border: string;       // border 色
  concepts?: MusicConcept[];  // 觀念教學
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
