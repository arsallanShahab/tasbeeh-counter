import { BEAD_THEMES } from "../constants/dhikrData";

export function shade(hex, pct) {
  const h = hex.replace("#", "");
  if (h.length !== 6) return hex;
  
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  
  const t = pct < 0 ? 0 : 255;
  const p = Math.abs(pct) / 100;
  const mix = (c) => Math.round((t - c) * p + c).toString(16).padStart(2, "0");
  
  return "#" + mix(r) + mix(g) + mix(b);
}

export function buildCustom(dark, gold) {
  return {
    id: "custom",
    name: "Custom",
    dark: [shade(dark, 45), dark, shade(dark, -45)],
    gold: [shade(gold, 55), gold, shade(gold, -40)],
    front: [shade(gold, 80), shade(gold, 15), shade(gold, -25)],
    glow: gold,
    thread: shade(dark, -20),
    arc: gold,
  };
}

export function resolveBeadTheme(settings) {
  if (settings.beadTheme === "custom") {
    const c = settings.customBead || { dark: "#15302a", gold: "#d8a93a" };
    return buildCustom(c.dark, c.gold);
  }
  return BEAD_THEMES.find((t) => t.id === settings.beadTheme) || BEAD_THEMES[0];
}
