/**
 * Speech scoring utilities for pronunciation practice.
 *
 * Key improvements over the original scoring:
 * 1. Incorporates Speech API `confidence` score (0-1) — low-confidence
 *    recognition (= poor pronunciation) pulls the score down.
 * 2. English: uses Levenshtein distance instead of naive substring matching.
 * 3. Japanese: uses LCS (Longest Common Subsequence) matching instead of
 *    greedy forward scan — handles kanji↔hiragana differences gracefully
 *    (e.g. AI returns "私" but target says "わたし").
 * 4. Prevents double-counting of matched words/characters.
 */

/* ─── Levenshtein distance ─── */
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  let curr = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      curr[j] = a[i - 1] === b[j - 1]
        ? prev[j - 1]
        : 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

/* ─── Number ↔ word mappings for speech recognition normalization ─── */
const NUM_TO_WORD: Record<string, string> = {
  "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four",
  "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
  "10": "ten", "11": "eleven", "12": "twelve", "13": "thirteen",
  "14": "fourteen", "15": "fifteen", "16": "sixteen", "17": "seventeen",
  "18": "eighteen", "19": "nineteen", "20": "twenty", "30": "thirty",
  "40": "forty", "50": "fifty", "60": "sixty", "70": "seventy",
  "80": "eighty", "90": "ninety", "100": "hundred",
};
const WORD_TO_NUM: Record<string, string> = {};
for (const [k, v] of Object.entries(NUM_TO_WORD)) WORD_TO_NUM[v] = k;

/**
 * Normalize text to handle Speech API quirks:
 *  - "700" or "7:00" → "seven oclock"
 *  - single numbers "7" → "seven"
 *  - "o'clock" → "oclock" (strip apostrophe for matching)
 */
function normalizeEnglish(s: string): string[] {
  let t = s.toLowerCase();
  // Expand time patterns: "700" → "7 oclock", "7:00" → "7 oclock"
  t = t.replace(/\b(\d{1,2}):?00\b/g, "$1 oclock");
  // Convert digit numbers to words: "7" → "seven"
  t = t.replace(/\b(\d{1,2})\b/g, (_, n) => NUM_TO_WORD[n] || n);
  // Normalize o'clock → oclock
  t = t.replace(/o'clock/g, "oclock");
  return t.replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
}

/* ─── English: word-level comparison (stricter) ─── */
export function compareTextEn(
  target: string,
  spoken: string,
): { pct: number; matched: number[] } {
  const targetWords = normalizeEnglish(target);
  const spokenWords = normalizeEnglish(spoken);
  const matched: number[] = [];
  const used = new Set<number>(); // prevent double-counting spoken words

  targetWords.forEach((tw, ti) => {
    for (let si = 0; si < spokenWords.length; si++) {
      if (used.has(si)) continue;
      const sw = spokenWords[si];

      // Exact match
      if (sw === tw) {
        matched.push(ti);
        used.add(si);
        return;
      }

      // Fuzzy: only for words > 5 chars, allow ≤ 20 % edit distance
      if (tw.length > 5) {
        const maxDist = Math.max(1, Math.floor(tw.length * 0.2));
        if (levenshtein(sw, tw) <= maxDist) {
          matched.push(ti);
          used.add(si);
          return;
        }
      }
    }
  });

  return {
    pct: Math.round((matched.length / Math.max(targetWords.length, 1)) * 100),
    matched,
  };
}

/* ─── Japanese: character-level LCS comparison ─── */
export function compareTextJa(
  target: string,
  spoken: string,
): { pct: number; matched: number[] } {
  const clean = (s: string) =>
    s.replace(/[\s。、！？「」（）\u3000・～〜…ー]/g, "");

  const targetChars = Array.from(clean(target));
  const spokenChars = Array.from(clean(spoken));
  const m = targetChars.length;
  const n = spokenChars.length;

  if (m === 0) return { pct: 0, matched: [] };
  if (n === 0) return { pct: 0, matched: [] };

  // LCS (Longest Common Subsequence) — handles kanji↔hiragana mismatches
  // gracefully by finding the best alignment instead of greedy forward scan
  // which breaks when e.g. AI returns "私" but target says "わたし".
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (targetChars[i - 1] === spokenChars[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find which target positions were matched
  const matched: number[] = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (targetChars[i - 1] === spokenChars[j - 1]) {
      matched.push(i - 1);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  matched.reverse();

  return {
    pct: Math.round((matched.length / m) * 100),
    matched,
  };
}

/* ─── Score a speech recognition result with confidence weighting ─── */
export interface ScoredResult {
  pct: number;
  transcript: string;
  matched: number[];
  confidence: number;
  rawPct: number; // text-match % before confidence weighting
}

/**
 * Given the alternatives from `SpeechRecognitionResult`, pick the best one
 * factoring in both text-match accuracy and the API's `confidence` score.
 *
 * Tiered scoring:
 *   rawPct = 100% (all words/chars matched) → floor at 85%, confidence fine-tunes 85-100
 *   rawPct < 100% → standard formula: rawPct × (0.3 + 0.7 × confidence)
 *
 * This prevents the frustrating "AI detected the correct word but score is low" issue,
 * especially for single-word pronunciation where confidence tends to be lower.
 */
export function scoreSpeechResult(
  alternatives: { transcript: string; confidence: number }[],
  targetText: string,
  compareFn: (target: string, spoken: string) => { pct: number; matched: number[] },
): ScoredResult {
  let best: ScoredResult = {
    pct: 0,
    transcript: "",
    matched: [],
    confidence: 0,
    rawPct: 0,
  };

  for (const alt of alternatives) {
    const { pct: rawPct, matched } = compareFn(targetText, alt.transcript);

    // confidence: 0-1 from Speech API. Use 0.85 fallback if unavailable (0 or NaN).
    const conf =
      alt.confidence > 0 && alt.confidence <= 1 ? alt.confidence : 0.85;

    let weighted = Math.round(rawPct * (0.3 + 0.7 * conf));

    // Tiered: if ALL words/chars matched, floor at 85%
    // This ensures "correct recognition → high score" regardless of confidence
    if (rawPct >= 100) {
      weighted = Math.max(85, weighted);
    }

    if (weighted > best.pct) {
      best = { pct: weighted, transcript: alt.transcript, matched, confidence: conf, rawPct };
    }
  }

  return best;
}

/* ─── Pronunciation feedback tip (做法 1) ─── */

/**
 * Returns a contextual pronunciation tip based on score and match quality.
 * Used in ResultDisplay to guide the learner on how to improve.
 */
export function getPronunciationTip(pct: number, rawPct: number): string {
  if (rawPct >= 100 && pct >= 95) return "發音非常標準！繼續保持 👏";
  if (rawPct >= 100 && pct >= 85) return "辨識正確！語調可以再自然一點 🎯";
  if (rawPct >= 100) return "辨識正確！放慢速度，把每個音節唸清楚 💡";
  if (rawPct >= 80) return "很接近了！注意標紅的部分，再聽一次示範 🐢";
  if (rawPct >= 50) return "部分正確！仔細聽示範音檔，模仿語調和重音 💪";
  return "再聽一次示範，放慢速度逐字練習 🔄";
}

/* ─── Character-level diff for single words (做法 2) ─── */

/**
 * Uses LCS to find which characters in `target` are matched by `spoken`.
 * Returns an array of matched character indices in the target string.
 * Useful for highlighting letter-by-letter differences when AI hears
 * a different word (e.g. target "apple", spoken "appeal").
 */
export function charLevelDiff(target: string, spoken: string): number[] {
  const t = Array.from(target.toLowerCase().replace(/[^\w]/g, ""));
  const s = Array.from(spoken.toLowerCase().replace(/[^\w]/g, ""));
  const m = t.length, n = s.length;
  if (m === 0 || n === 0) return [];

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (t[i - 1] === s[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const matched: number[] = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (t[i - 1] === s[j - 1]) { matched.push(i - 1); i--; j--; }
    else if (dp[i - 1][j] > dp[i][j - 1]) i--;
    else j--;
  }
  return matched.reverse();
}
