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

/* ─── English: word-level comparison (stricter) ─── */
export function compareTextEn(
  target: string,
  spoken: string,
): { pct: number; matched: number[] } {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^\w\s']/g, "").split(/\s+/).filter(Boolean);

  const targetWords = normalize(target);
  const spokenWords = normalize(spoken);
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
 * Formula:  finalScore = textMatchPct × (0.3 + 0.7 × confidence)
 *   confidence = 1.0  →  multiplier = 1.00  (no penalty)
 *   confidence = 0.8  →  multiplier = 0.86
 *   confidence = 0.5  →  multiplier = 0.65
 *   confidence = 0.3  →  multiplier = 0.51
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

    const weighted = Math.round(rawPct * (0.3 + 0.7 * conf));

    if (weighted > best.pct) {
      best = { pct: weighted, transcript: alt.transcript, matched, confidence: conf, rawPct };
    }
  }

  return best;
}
