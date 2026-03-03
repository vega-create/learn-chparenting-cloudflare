export interface MusicQ {
  s: string;        // 題幹
  opts: string[];   // 4 選項
  ans: number;      // 正確答案 index (0-3)
  explain?: string; // 解說
}

export interface ConceptAudioDemo {
  label: string;                // 按鈕文字 e.g. "🔊 聽全音符"
  /** 每個步驟的音符：[頻率Hz, 秒數, 音量0-1(預設0.3)] */
  steps: [number, number, number?][];
  /** 同時播放多個音（和弦）：[[頻率1,頻率2,...], 秒數] */
  chord?: [number[], number];
  gap?: number;                 // 步驟間隔秒數，預設 0.05
}

export interface ConceptImage {
  src: string;          // 圖片路徑 e.g. "/music/quarter-note.svg"
  label: string;        // 下方標籤 e.g. "四分音符"
  sublabel?: string;    // 副標籤 e.g. "1 拍"
}

export interface MusicConcept {
  title: string;        // 小節標題
  explanation: string;  // 1-2 句說明
  keyPoints: string[];  // 重點條列
  visual?: string;      // 視覺圖示（monospace 呈現）
  images?: ConceptImage[];     // 圖片展示
  audioDemos?: ConceptAudioDemo[];  // 聲音示範
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
