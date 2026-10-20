import { WebHaptics } from "web-haptics";

// Counting feedback: a soft tick per count, a longer mark for moments; the app reports ringer and battery saver.
// What the device tells us. ringer: normal | vibrate | silent.
const device = { ringer: "normal", powerSave: false, lowBattery: false, known: false };
export const setDeviceState = (patch) => Object.assign(device, patch);
export const knowsRingerMode = () => device.known;

// The browser's battery reading, where it gives one (Chrome on Android).
if (typeof navigator !== "undefined" && navigator.getBattery) {
  navigator
    .getBattery()
    .then((b) => {
      const update = () => (device.lowBattery = !b.charging && b.level <= 0.15);
      update();
      b.addEventListener("levelchange", update);
      b.addEventListener("chargingchange", update);
    })
    .catch(() => {});
}

// A dhikr is felt at its target, with the tick. Long counts (200 and up) are also
// marked every 100, but never in the last tenth, where it would run into the target.
export function isMilestone(count, target) {
  if (!(target >= 200) || count <= 0 || count >= target || target - count < target / 10) return false;
  return count % 100 === 0;
}
// Milliseconds the motor runs: a tick per count, a mark for moments.
const PULSE = { soft: { tick: 6, mark: 14 }, firm: { tick: 14, mark: 26 } };
const GAP = 70;
const MIN_COUNT_GAP = 45;

let driver = null;
export const setHapticDriver = (fn) => (driver = fn);

let iosHaptics = null;
let lastTick = 0;

function playPulses(pulses) {
  if (typeof navigator.vibrate === "function") {
    navigator.vibrate(pulses.flatMap((d, i) => (i ? [GAP, d] : [d])));
    return;
  }
  // iPhone browsers have no vibrate; web-haptics taps the system switch instead.
  iosHaptics ||= new WebHaptics();
  iosHaptics.trigger(pulses.map((d, i) => ({ duration: d, intensity: 1, ...(i ? { delay: GAP } : {}) })));
}

/* kind: count | milestone | step | target | tap. n: pulses in a rhythm (1-4). */
export function haptic(kind, { enabled = true, strength = "soft", milestonesOnly = false, n = 1 } = {}) {
  if (!enabled || device.ringer === "silent" || typeof navigator === "undefined") return;
  const major = kind === "milestone" || kind === "step" || kind === "target";
  if (!major && (milestonesOnly || device.powerSave || device.lowBattery)) return;
  const now = performance.now();
  if (kind === "count" && now - lastTick < MIN_COUNT_GAP) return;
  lastTick = now;
  const count = Math.min(Math.max(n, 1), 4);
  try {
    if (driver) return driver(kind, { strength, n: count });
    const p = PULSE[strength] || PULSE.soft;
    const pulses =
      kind === "target" ? [p.mark, p.mark] : kind === "step" ? Array(count).fill(p.mark) : kind === "milestone" ? [p.mark] : Array(count).fill(p.tick);
    playPulses(pulses);
  } catch {
    // no vibration on this device
  }
}

// Sounds are synthesised once and replayed.
export const SOUNDS = ["bead", "click"];

// Each sound as a function of time in seconds, with its length.
const VOICES = {
  bead: {
    len: 0.09,
    at: (t, noise) =>
      Math.exp(-t / 0.011) * (0.62 * Math.sin(2 * Math.PI * 2350 * t) + 0.38 * Math.sin(2 * Math.PI * 3720 * t)) +
      (t < 0.002 ? noise * 0.5 * (1 - t / 0.002) : 0),
  },
  click: { len: 0.04, at: (t) => Math.exp(-t / 0.0045) * Math.sin(2 * Math.PI * 1250 * t) },
  chime: {
    len: 1.4,
    at: (t) => Math.min(1, t / 0.004) * Math.exp(-t / 0.38) * (0.7 * Math.sin(2 * Math.PI * 880 * t) + 0.3 * Math.sin(2 * Math.PI * 1320 * t)),
  },
};
const VOLUME = { bead: 0.32, click: 0.22, chime: 0.16 };

let ctx = null;
const buffers = {};
let lastSound = 0;

function audio() {
  if (!ctx) {
    // Ambient mixes with the person's own audio and obeys the iPhone silent switch.
    try {
      if (navigator.audioSession) navigator.audioSession.type = "ambient";
    } catch {
      // older browsers
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function buffer(c, name) {
  if (buffers[name]) return buffers[name];
  const v = VOICES[name];
  const b = c.createBuffer(1, Math.ceil(c.sampleRate * v.len), c.sampleRate);
  const data = b.getChannelData(0);
  let seed = 7;
  for (let i = 0; i < data.length; i++) {
    seed = (seed * 16807) % 2147483647;
    data[i] = v.at(i / c.sampleRate, (seed / 2147483647) * 2 - 1);
  }
  return (buffers[name] = b);
}

/* kind: count | target. type: the chosen count sound. */
export function sound(kind, { enabled = true, type = "bead" } = {}) {
  if (!enabled || device.ringer !== "normal" || typeof window === "undefined") return;
  const now = performance.now();
  if (kind === "count" && now - lastSound < 35) return;
  lastSound = now;
  try {
    const c = audio();
    if (!c) return;
    const name = kind === "target" ? "chime" : VOICES[type] ? type : "bead";
    const src = c.createBufferSource();
    const gain = c.createGain();
    src.buffer = buffer(c, name);
    gain.gain.value = VOLUME[name];
    src.connect(gain).connect(c.destination);
    src.onended = () => src.disconnect();
    src.start();
  } catch {
    // no audio on this device
  }
}
