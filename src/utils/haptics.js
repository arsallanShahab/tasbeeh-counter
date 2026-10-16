/* ─── Feel which dhikr you're on ─────────────────────────────────────────
   In a set, each count taps once for the first dhikr, twice for the second,
   and so on up to four; a new dhikr opens with the same number of longer
   pulses. Patterns are web-haptics presets: { pattern: [{ duration, delay }] }. */
const MAX = 4;
const pulses = (n, duration, intensity, gap) => ({
  pattern: Array.from({ length: Math.min(Math.max(n, 1), MAX) }, (_, k) => ({ duration, intensity, ...(k ? { delay: gap } : {}) })),
});

// One count: quick ticks, as many as the dhikr's place in the set.
export const countRhythm = (step) => pulses(step + 1, 12, 0.55, 55);

// A dhikr begins: the same number, slower and stronger.
export const stepSignature = (step) => pulses(step + 1, 35, 0.9, 110);

// For navigator.vibrate: [on, off, on, …] in milliseconds.
export const toVibrate = (preset) => preset.pattern.flatMap((v, i) => (i ? [v.delay || 0, v.duration] : [v.duration]));
