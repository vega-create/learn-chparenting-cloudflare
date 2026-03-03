/**
 * Fire-and-forget practice counter. Works for ALL users (anonymous + logged in).
 * Debounced: only fires once per 30 seconds to avoid double-counting when
 * multiple completion sounds play in quick succession.
 */
let lastTracked = 0;

export function trackPractice() {
  const now = Date.now();
  if (now - lastTracked < 30_000) return; // skip if < 30s since last track
  lastTracked = now;

  try {
    fetch("/api/track-practice", { method: "POST" }).catch(() => {});
  } catch {
    // silently ignore
  }
}
