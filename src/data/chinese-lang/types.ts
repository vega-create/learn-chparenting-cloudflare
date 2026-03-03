/** 選擇題 */
export interface ChineseQ {
  s: string;        // 題幹
  opts: string[];   // 4 選項
  ans: number;      // 正確答案 index (0-3)
  explain?: string; // 解說（可選）
}

/** 閱讀理解 */
export interface ChineseReading {
  passage: string;
  questions: { q: string; opts: string[]; ans: number }[];
}

/** 聽力題 — TTS 播放 text，選正確選項 */
export interface ChineseListening {
  text: string;       // TTS 要唸的字/詞
  hint?: string;      // 可選提示（例如「這是一種動物」）
  opts: string[];     // 4 選項（注音或國字）
  ans: number;        // 正確答案 index
  explain?: string;
}

/** 練習主題 */
export interface ChineseTopic {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;    // Tailwind gradient e.g. "from-orange-400 to-orange-500"
  border: string;   // e.g. "border-orange-200"
  questions: ChineseQ[];
  readings?: ChineseReading[];
  listening?: ChineseListening[];
}

/** 年級 */
export interface ChineseGrade {
  id: string;
  title: string;
  icon: string;
  color: string;
  border: string;
  accentColor: string;
  topics: ChineseTopic[];
}
