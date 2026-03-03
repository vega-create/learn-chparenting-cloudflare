/**
 * Music audio utility using Web Audio API
 * Plays notes, chords, scales, and rhythm demos directly in the browser
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Resume if suspended (autoplay policy)
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

// Note frequencies (Hz) - C4 = middle C
export const NOTE_FREQ: Record<string, number> = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  // Sharps
  "C#4": 277.18, "D#4": 311.13, "F#4": 369.99, "G#4": 415.30, "A#4": 466.16,
  "C#3": 138.59, "D#3": 155.56, "F#3": 185.00, "G#3": 207.65, "A#3": 233.08,
  // Flats (same as sharps enharmonically)
  "Db4": 277.18, "Eb4": 311.13, "Gb4": 369.99, "Ab4": 415.30, "Bb4": 466.16,
};

export interface AudioStep {
  freqs: number[];     // frequencies to play simultaneously (chord = multiple)
  duration: number;    // seconds
  volume?: number;     // 0-1, default 0.3
  wave?: OscillatorType; // "sine" | "square" | "triangle" | "sawtooth"
}

export interface MusicAudioDemo {
  label: string;       // button text e.g. "🔊 聽聽看"
  steps: AudioStep[];
  gap?: number;        // seconds between steps, default 0.05
}

/** Play a single tone */
function playTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  volume = 0.3,
  wave: OscillatorType = "sine",
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = freq;
  osc.type = wave;
  gain.gain.setValueAtTime(volume, startTime);
  // Smooth fade-out to avoid clicks
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration - 0.02);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

/** Play a click/tick sound (for rhythm demos) */
function playClick(
  ctx: AudioContext,
  startTime: number,
  strong: boolean,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = strong ? 1000 : 700;
  osc.type = "sine";
  const vol = strong ? 0.5 : 0.25;
  gain.gain.setValueAtTime(vol, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);
  osc.start(startTime);
  osc.stop(startTime + 0.1);
}

/** Play a full audio demo (sequence of steps) */
export function playDemo(demo: MusicAudioDemo) {
  const ctx = getCtx();
  const gap = demo.gap ?? 0.05;
  let time = ctx.currentTime + 0.05;

  for (const step of demo.steps) {
    const vol = step.volume ?? 0.3;
    const wave = step.wave ?? "sine";
    for (const freq of step.freqs) {
      playTone(ctx, freq, time, step.duration, vol, wave);
    }
    time += step.duration + gap;
  }
}

/** Play a rhythm pattern with clicks */
export function playRhythm(bpm: number, pattern: ("strong" | "weak" | "medium")[]) {
  const ctx = getCtx();
  const beatDuration = 60 / bpm;
  let time = ctx.currentTime + 0.05;

  for (const beat of pattern) {
    playClick(ctx, time, beat === "strong");
    // Medium is between strong and weak
    if (beat === "medium") {
      playClick(ctx, time, false);
    }
    time += beatDuration;
  }
}

// ========== Preset Demos ==========

/** Play C major scale ascending */
export function playCMajorScale() {
  const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
  playDemo({
    label: "",
    steps: notes.map(n => ({ freqs: [NOTE_FREQ[n]], duration: 0.4 })),
    gap: 0.05,
  });
}

/** Play A natural minor scale ascending */
export function playAMinorScale() {
  const notes = ["A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4"];
  playDemo({
    label: "",
    steps: notes.map(n => ({ freqs: [NOTE_FREQ[n]], duration: 0.4 })),
    gap: 0.05,
  });
}

/** Play a chord (all notes at once) */
export function playChord(noteNames: string[], duration = 1.5) {
  playDemo({
    label: "",
    steps: [{ freqs: noteNames.map(n => NOTE_FREQ[n]), duration }],
  });
}

/**
 * Play from ConceptAudioDemo data format (compact arrays)
 * steps: [freq, duration, volume?][]
 * chord: [freqs[], duration]
 */
export function playDemoFromData(data: {
  steps: [number, number, number?][];
  chord?: [number[], number];
  gap?: number;
}) {
  const ctx = getCtx();
  const gap = data.gap ?? 0.05;
  let time = ctx.currentTime + 0.05;

  // If chord, play all at once
  if (data.chord) {
    const [freqs, dur] = data.chord;
    for (const f of freqs) {
      playTone(ctx, f, time, dur, 0.25, "sine");
    }
    return;
  }

  // Sequential steps
  for (const step of data.steps) {
    const [freq, dur, vol] = step;
    playTone(ctx, freq, time, dur, vol ?? 0.3, "sine");
    time += dur + gap;
  }
}
