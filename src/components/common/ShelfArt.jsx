import { useId } from "react";

/* Spot illustrations for the Library's shelves. One hand-drawn style: theme
   colours only (so light, dark and every theme follow), architecture, sky,
   objects and geometry, never people. Decorative; the shelf title names it. */
const SOFT = "color-mix(in srgb, var(--primary) 13%, var(--surface))";
const PAPER = "var(--surface)";
const INK = "var(--primary)";
// The logo's gold: the theme gold is darkened for text and reads brown in a drawing.
const GOLD = "#d4a13a";
const line = { stroke: INK, strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

// Sunrise behind a dome and minaret: the day's routine.
const Routine = () => (
  <>
    <circle cx="32" cy="32" r="30" fill={SOFT} />
    <circle cx="32" cy="27" r="11" fill={GOLD} opacity="0.85" />
    <g stroke={GOLD} strokeWidth="1.6" strokeLinecap="round">
      <path d="M32 9.5v3M19.5 14.5l2 2M44.5 14.5l-2 2M14 25.5h3M50 25.5h-3" />
    </g>
    <path d="M19 40c0-7.5 5.5-12.6 13-14 7.5 1.4 13 6.5 13 14Z" fill={PAPER} {...line} />
    <path d="M32 26v-3.5" {...line} />
    <circle cx="32" cy="21.2" r="1.4" fill={INK} />
    <path d="M16 40h32v13H16Z" fill={PAPER} {...line} />
    <path d="M29 53v-5.2c0-1.9 1.3-3.4 3-4 1.7.6 3 2.1 3 4V53" fill={SOFT} {...line} />
    <path d="M49 29h5v24h-5Z" fill={PAPER} {...line} />
    <path d="M48.5 29l3-6.5 3 6.5Z" fill={INK} />
    <path d="M12 53h40" {...line} />
  </>
);

// Crescent, star and a hanging lantern: special days and nights.
const Seasons = ({ id }) => {
  const star = Array.from({ length: 16 }, (_, i) => {
    const a = ((i * 22.5 - 90) * Math.PI) / 180;
    const r = i % 2 ? 1.9 : 3.8;
    return `${(46 + r * Math.cos(a)).toFixed(2)},${(26.5 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return (
    <>
      <circle cx="32" cy="32" r="30" fill={SOFT} />
      <mask id={id}>
        <rect width="64" height="64" fill="#fff" />
        <circle cx="44.5" cy="28" r="11.5" fill="#000" />
      </mask>
      <circle cx="38" cy="34" r="14.5" fill={GOLD} mask={`url(#${id})`} />
      <polygon points={star} fill={GOLD} />
      <g transform="translate(1 4)">
        <path d="M17 4v10" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M13 14h8l-1.6 3h-4.8Z" fill={INK} />
        <path d="M13.6 17h6.8v12.5c0 2.6-1.6 4.1-3.4 4.6-1.8-.5-3.4-2-3.4-4.6Z" fill={PAPER} {...line} strokeWidth="1.6" />
        <rect x="15.6" y="20" width="2.8" height="9" rx="1.4" fill={GOLD} />
        <path d="M17 34.3v3.2" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </>
  );
};

// Prayer beads strung as a heart, one bead in gold: for the heart. Beads are
// spaced evenly along the curve, not by angle, so they don't bunch at the cusps.
const heart = (() => {
  const pt = (t) => {
    const x = 16 * Math.sin(t) ** 3;
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return [32 + x * 1.22, 29.5 - y * 1.22];
  };
  const dense = Array.from({ length: 721 }, (_, i) => pt(Math.PI + (i / 720) * Math.PI * 2)); // from the bottom tip
  const len = [0];
  for (let i = 1; i < dense.length; i++) len.push(len[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
  const N = 18;
  return Array.from({ length: N }, (_, k) => dense[len.findIndex((l) => l >= (len[len.length - 1] * k) / N)]);
})();
const Heart = () => (
  <>
    <circle cx="32" cy="32" r="30" fill={SOFT} />
    <path d={`M${heart.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L")} Z`} fill="none" stroke={INK} strokeOpacity="0.45" strokeWidth="1" />
    <path d={`M${heart[0][0].toFixed(2)} ${heart[0][1].toFixed(2)}v6`} stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
    <path d={`M${(heart[0][0] - 2.2).toFixed(2)} ${(heart[0][1] + 6).toFixed(2)}h4.4l-.8 4.2h-2.8Z`} fill={INK} />
    {heart.map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={i === 13 ? 3.3 : 2.6} fill={i === 13 ? GOLD : INK} />
    ))}
  </>
);

// A tasbih loop hanging from a gold pin: yours, pinned to Today.
const loop = Array.from({ length: 11 }, (_, i) => {
  const a = ((-60 + i * 30) * Math.PI) / 180;
  return [32 + 11.5 * Math.cos(a), 37 + 13 * Math.sin(a)];
});
const Yours = () => (
  <>
    <circle cx="32" cy="32" r="30" fill={SOFT} />
    <ellipse cx="32" cy="37" rx="11.5" ry="13" fill="none" stroke={INK} strokeOpacity="0.45" strokeWidth="1" />
    <path d="M32 16.5V24" {...line} />
    <circle cx="32" cy="13" r="4" fill={GOLD} />
    {loop.map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={i === 5 ? 3 : 2.6} fill={i === 5 ? GOLD : INK} />
    ))}
  </>
);

// An arched doorway: the moments of the day, from leaving home onwards.
const Moments = () => (
  <>
    <circle cx="32" cy="32" r="30" fill={SOFT} />
    <path d="M19 53V31a13 13 0 0 1 26 0v22" fill={PAPER} {...line} />
    <path d="M24.5 53V32.5a7.5 7.5 0 0 1 15 0V53Z" fill={SOFT} {...line} />
    <path d="M32 15.5l2 2.5-2 2.5-2-2.5Z" fill={GOLD} />
    <circle cx="36" cy="44" r="1.5" fill={GOLD} />
    <path d="M13 53h38" {...line} />
  </>
);

// The eight-pointed star of the logo: the Names of Allah.
const starPts = (cx, cy, ro, ri, n = 8) =>
  Array.from({ length: n * 2 }, (_, i) => {
    const a = ((i * (180 / n) - 90) * Math.PI) / 180;
    const r = i % 2 ? ri : ro;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
const Names = () => (
  <>
    <circle cx="32" cy="32" r="30" fill={SOFT} />
    <polygon points={starPts(32, 32, 19, 13.5)} fill={PAPER} {...line} />
    <circle cx="32" cy="32" r="9.5" fill="none" stroke={INK} strokeOpacity="0.45" strokeWidth="1" />
    <polygon points={starPts(32, 32, 7.2, 3.8)} fill={GOLD} />
  </>
);

// An open book on a rehal: more remembrance.
const More = () => (
  <>
    <circle cx="32" cy="32" r="30" fill={SOFT} />
    <path d="M21 41l22 13M43 41L21 54" {...line} />
    <path d="M32 24c-5-2.5-11-2.8-17-1v19c6-1.8 12-1.5 17 1Z" fill={PAPER} {...line} />
    <path d="M32 24c5-2.5 11-2.8 17-1v19c-6-1.8-12-1.5-17 1Z" fill={PAPER} {...line} />
    <g stroke={INK} strokeOpacity="0.45" strokeWidth="1.2" strokeLinecap="round">
      <path d="M19 28.5c3.5-.7 6.5-.5 9.5.6M19 33c3.5-.7 6.5-.5 9.5.6M45 28.5c-3.5-.7-6.5-.5-9.5.6M45 33c-3.5-.7-6.5-.5-9.5.6" />
    </g>
    <path d="M32 43v7.5l1.6-1.8 1.6 1.8V44" fill={GOLD} />
  </>
);

const ART = { yours: Yours, routine: Routine, moments: Moments, heart: Heart, seasons: Seasons, names: Names, more: More };

// `fallback` renders for shelves that have no drawing yet.
export const ShelfArt = ({ shelf, size = 48, className = "", fallback = null }) => {
  const id = useId().replace(/:/g, "");
  const Art = ART[shelf];
  if (!Art) return fallback;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={`shrink-0 ${className}`} aria-hidden="true" focusable="false">
      <Art id={`${id}-m`} />
    </svg>
  );
};

export default ShelfArt;
