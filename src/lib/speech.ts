// Shared speech synthesis utilities with natural voice selection (EN + JA)

type LangKey = "en" | "ja";

const voiceCache: Record<LangKey, SpeechSynthesisVoice | null> = { en: null, ja: null };
let voicesLoaded = false;

function loadVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return;
  voicesLoaded = true;

  // ---- English voice priority ----
  const enRank = [
    (v: SpeechSynthesisVoice) => v.name.includes("Google US English"),
    (v: SpeechSynthesisVoice) => v.name.includes("Google UK English Female"),
    (v: SpeechSynthesisVoice) => /Samantha.*(Premium|Enhanced)/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.name === "Samantha",
    (v: SpeechSynthesisVoice) => /Natural/i.test(v.name) && v.lang.startsWith("en"),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("en") && !/(Compact|Novelty)/i.test(v.name),
  ];
  for (const test of enRank) {
    const found = voices.find(test);
    if (found) { voiceCache.en = found; break; }
  }
  if (!voiceCache.en) voiceCache.en = voices.find(v => v.lang.startsWith("en")) ?? null;

  // ---- Japanese voice priority ----
  const jaRank = [
    (v: SpeechSynthesisVoice) => v.name.includes("Google 日本語"),
    (v: SpeechSynthesisVoice) => /Kyoko.*(Premium|Enhanced)/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.name === "Kyoko",
    (v: SpeechSynthesisVoice) => /O-Ren|Hattori/i.test(v.name),
    (v: SpeechSynthesisVoice) => /Natural/i.test(v.name) && v.lang.startsWith("ja"),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("ja") && !/(Compact|Novelty)/i.test(v.name),
  ];
  for (const test of jaRank) {
    const found = voices.find(test);
    if (found) { voiceCache.ja = found; break; }
  }
  if (!voiceCache.ja) voiceCache.ja = voices.find(v => v.lang.startsWith("ja")) ?? null;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export const speak = (text: string, rate = 0.85, langOrOnEnd?: string | (() => void), onEnd?: () => void) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  if (!voicesLoaded) loadVoices();

  // Support both (text, rate, lang, onEnd) and (text, rate, onEnd)
  let lang = "en-US";
  let cb = onEnd;
  if (typeof langOrOnEnd === "string") { lang = langOrOnEnd; }
  else if (typeof langOrOnEnd === "function") { cb = langOrOnEnd; }

  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = rate;
  const key: LangKey = lang.startsWith("ja") ? "ja" : "en";
  if (voiceCache[key]) u.voice = voiceCache[key];
  if (cb) u.onend = cb;
  window.speechSynthesis.speak(u);
};

export const speakJa = (text: string, rate = 0.85, onEnd?: () => void) => speak(text, rate, "ja-JP", onEnd);
export const speakEn = (text: string, rate = 0.85, onEnd?: () => void) => speak(text, rate, "en-US", onEnd);

export const stopSpeaking = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
};

export const pauseSpeaking = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.pause();
};

export const resumeSpeaking = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.resume();
};
