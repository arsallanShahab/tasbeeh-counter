import { memo, useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { BeadGradients } from "./BeadRing";
import { shade } from "../../utils/theme";

// A circular arc (constant curvature) in a 340 x 240 view box, so the string
// drapes naturally. Its ends run past both edges.
const VB_W = 340;
const VB_H = 240;
const CROWN_Y = 86;
const END_Y = 172;
const HALF_SPAN = 205; // half the chord, past the 170 half-width
const ARC_R = (HALF_SPAN * HALF_SPAN + (END_Y - CROWN_Y) ** 2) / (2 * (END_Y - CROWN_Y));
const ARC_CY = CROWN_Y + ARC_R;
const THETA = Math.asin(HALF_SPAN / ARC_R);
const LENGTH = 2 * THETA * ARC_R;

const pointAt = (s) => {
  const t = (Math.max(0, Math.min(LENGTH, s)) - LENGTH / 2) / ARC_R;
  return [VB_W / 2 + ARC_R * Math.sin(t), ARC_CY - ARC_R * Math.cos(t)];
};

const [X0, Y0] = pointAt(0);
const [X1, Y1] = pointAt(LENGTH);
const PATH = `M${X0} ${Y0} A${ARC_R} ${ARC_R} 0 0 1 ${X1} ${Y1}`;
const R = 7.2;
const SPACING = 2 * R + 1.4; // a hairline between beads
const CENTER = LENGTH / 2;
const GAP = SPACING * 2.2; // the parting at the crown
const LEFT_END = CENTER - GAP / 2 - SPACING / 2; // next bead to count waits here
const RIGHT_END = CENTER + GAP / 2 + SPACING / 2; // the last counted bead rests here
const SIDE = Math.ceil(LEFT_END / SPACING) + 2; // beads rendered on each side
const NUMBER_TOP = ((CROWN_Y + R + 34) / VB_H) * 100; // clear of the crown

// Where bead `g` sits after `o` counts: waiting beads pack left of the gap,
// counted ones right of it, and the crossing bead travels the gap in one beat.
const placeOf = (g, o) => {
  const p = o - g;
  if (p <= 0) return LEFT_END + p * SPACING;
  if (p >= 1) return RIGHT_END + (p - 1) * SPACING;
  return LEFT_END + p * (RIGHT_END - LEFT_END);
};

// 0 at rest, 1 halfway across the gap.
const liftOf = (g, o) => {
  const p = o - g;
  return p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0;
};

// One bead with a soft contact shadow, moved as a single transformed group
// (no per-circle attribute updates). Memoised, so only beads whose look
// changes re-render on a count.
const FlowBead = memo(function FlowBead({ g, offset, fill, shine, halo, haloColor, shadowId }) {
  const x = useTransform(offset, (o) => pointAt(placeOf(g, o))[0]);
  const baseY = useTransform(offset, (o) => pointAt(placeOf(g, o))[1]);
  const y = useTransform(offset, (o) => pointAt(placeOf(g, o))[1] - liftOf(g, o) * 5);
  const scale = useTransform(offset, (o) => 1 + liftOf(g, o) * 0.1);
  const shadowY = useTransform(baseY, (v) => v + 2.6);
  const opacity = useTransform(offset, (o) => {
    const v = placeOf(g, o);
    return v < R || v > LENGTH - R ? 0 : 1;
  });
  return (
    <motion.g style={{ opacity }}>
      <motion.g style={{ x, y: shadowY }}>
        <ellipse rx={R * 1.05} ry={R * 0.55} fill={`url(#${shadowId})`} opacity="0.9" />
      </motion.g>
      <motion.g style={{ x, y, scale }}>
        {halo && <circle r={R * 1.65} fill="none" stroke={haloColor} strokeWidth="1" opacity="0.5" />}
        <circle r={R} fill={fill} stroke="#0005" strokeWidth="0.4" />
        <circle cx={-R * 0.3} cy={-R * 0.34} r={R * 0.26} fill="#fff" opacity={shine} />
      </motion.g>
    </motion.g>
  );
});

// A twisted cord: soft shadow, body, and a short dashed highlight for the twist.
const Cord = ({ color }) => (
  <g fill="none" strokeLinecap="round">
    <path d={PATH} stroke="#000" strokeOpacity="0.12" strokeWidth="3.2" transform="translate(0 1.8)" />
    <path d={PATH} stroke={shade(color, -18)} strokeWidth="2.6" />
    <path d={PATH} stroke={color} strokeWidth="1.8" />
    <path d={PATH} stroke={shade(color, 45)} strokeWidth="0.9" strokeDasharray="1.6 2.6" strokeOpacity="0.8" />
  </g>
);

// Beads on an arched string that runs edge to edge. Each count carries the
// next bead across the gap at the crown, from left to right.
export const BeadStrand = ({ count, target, theme, activeStyle = "glow", onInc, onDec, children, label }) => {
  const gid = useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  const wrap = useRef(null);
  const drag = useRef(null);

  // Beads moved so far: continues after a loop, rewinds on a reset.
  const [ticks, setTicks] = useState(count);
  const [prev, setPrev] = useState(count);
  if (prev !== count) {
    setPrev(count);
    if (count === 0 && prev < target) setTicks(0);
    else if (count !== 0) setTicks((t) => Math.max(0, t + (count - prev)));
  }

  const offset = useSpring(ticks, { stiffness: 240, damping: 28, mass: 0.9 });
  useEffect(() => {
    if (reduced) offset.jump(ticks);
    else offset.set(ticks);
  }, [ticks, reduced, offset]);

  // Drag along the string: every bead-width moved is one count.
  const pxPerBead = () => {
    const w = wrap.current?.getBoundingClientRect().width || VB_W;
    return SPACING * (w / VB_W);
  };
  const onDown = (e) => {
    drag.current = { x: e.clientX, y: e.clientY, steps: 0, moved: false };
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - d.y)) d.moved = true;
    if (!d.moved) return;
    const steps = Math.trunc(dx / pxPerBead());
    if (steps !== d.steps) {
      const diff = steps - d.steps;
      for (let k = 0; k < Math.abs(diff); k++) (diff > 0 ? onInc : onDec)();
      d.steps = steps;
    }
  };
  const onUp = () => {
    if (drag.current && !drag.current.moved) onInc();
    drag.current = null;
  };

  const done = count >= target;
  const beads = [];
  for (let g = ticks - SIDE; g <= ticks + SIDE; g++) beads.push(g);

  return (
    <div
      ref={wrap}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={() => (drag.current = null)}
      className="relative flex w-screen max-w-none flex-1 cursor-pointer select-none flex-col justify-end lg:w-[min(40rem,50vw)] lg:flex-none"
      style={{ touchAction: "pan-y" }}
      data-tap-skip="true"
      role="button"
      tabIndex={-1}
      aria-label={label}
    >
      {/* The whole column is the touch target; the strand sits at its foot. */}
      <div className="relative w-full" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        <BeadGradients id={gid} theme={theme} />
        <defs>
          <radialGradient id={`${gid}-shadow`}>
            <stop offset="0%" stopColor="#000" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <Cord color={done ? theme.gold[1] : theme.thread} />
        {beads.map((g) => {
          const counted = count > 0 && g < ticks && g >= ticks - count;
          const isFront = count > 0 && g === ticks - 1;
          const isNext = g === ticks && !done;
          return (
            <FlowBead
              key={g}
              g={g}
              offset={offset}
              fill={`url(#${gid}-${isFront ? "front" : counted ? "gold" : "dark"})`}
              shine={isFront ? 0.5 : counted ? 0.3 : 0.12}
              halo={isNext && activeStyle !== "plain"}
              haloColor={theme.glow}
              shadowId={`${gid}-shadow`}
            />
          );
        })}
      </svg>

      <div className="pointer-events-none absolute inset-x-0 flex flex-col items-center" style={{ top: `${NUMBER_TOP}%` }}>
        {children}
      </div>
      </div>
    </div>
  );
};

export default BeadStrand;
