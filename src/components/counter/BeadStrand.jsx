import { memo, useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { BeadGradients } from "./BeadRing";
import { beadMark, shade } from "../../utils/theme";
import { useIsDesktop } from "../../hooks/useMediaQuery";

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
const CENTER = LENGTH / 2;

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const smooth = (t) => t * t * (3 - 2 * t);
// Within one beat: waiting beads slide up early; counted ones move only when
// the crossing bead lands on them.
const settleEarly = (u) => 1 - (1 - clamp01(u / 0.6)) ** 2;
const settleLate = (u) => smooth(clamp01((u - 0.45) / 0.55));

// Spacing, gap and rest points for a bead radius.
const makeGeom = (R) => {
  const SPACING = 2 * R + 1.6; // a hairline between beads
  const GAP = SPACING * 2.7; // the parting at the crown
  const LEFT_END = CENTER - GAP / 2 - SPACING / 2; // next bead to count waits here
  const RIGHT_END = CENTER + GAP / 2 + SPACING / 2; // the last counted bead rests here
  // Where bead `g` sits after `o` counts. The crossing bead eases across the gap.
  const placeOf = (g, o) => {
    const p = o - g;
    if (p <= 0) {
      const k = Math.floor(p);
      return LEFT_END + (k + settleEarly(p - k)) * SPACING;
    }
    if (p >= 1) {
      const q = p - 1;
      const k = Math.floor(q);
      return RIGHT_END + (k + settleLate(q - k)) * SPACING;
    }
    return LEFT_END + smooth(p) * (RIGHT_END - LEFT_END);
  };
  return {
    R,
    placeOf,
    cross: RIGHT_END - LEFT_END,
    side: Math.ceil(LEFT_END / SPACING) + 2, // beads rendered on each side
    numberTop: ((CROWN_Y + R + 30) / VB_H) * 100, // clear of the crown
  };
};
// Bigger beads on phones, where the strand is drawn smaller.
const GEOM_DESKTOP = makeGeom(9.4);
const GEOM_MOBILE = makeGeom(12);

// An arc of a circle of radius `r` around the bead, between two angles (degrees).
const rimArc = (r, from, to) => {
  const p = (d) => `${(r * Math.cos((d * Math.PI) / 180)).toFixed(2)} ${(r * Math.sin((d * Math.PI) / 180)).toFixed(2)}`;
  return `M${p(from)} A${r} ${r} 0 0 1 ${p(to)}`;
};

// 0 at rest, 1 halfway across the gap.
const liftOf = (g, o) => {
  const p = o - g;
  return p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0;
};

// One bead with a soft contact shadow, moved as a single transformed group
// (no per-circle attribute updates). Memoised, so only beads whose look
// changes re-render on a count.
const FlowBead = memo(function FlowBead({ g, geom, offset, countedFrom, darkFill, goldFill, highlight, haloColor, shadowId }) {
  const { R, placeOf } = geom;
  const x = useTransform(offset, (o) => pointAt(placeOf(g, o))[0]);
  const baseY = useTransform(offset, (o) => pointAt(placeOf(g, o))[1]);
  const y = useTransform(offset, (o) => pointAt(placeOf(g, o))[1] - liftOf(g, o) * R * 0.7);
  const scale = useTransform(offset, (o) => 1 + liftOf(g, o) * 0.1);
  const shadowY = useTransform(baseY, (v) => v + R * 0.28);
  // Turns gold while crossing, not before it moves.
  const gold = useTransform(offset, (o) => (g >= countedFrom ? smooth(clamp01((o - g - 0.2) / 0.55)) : 0));
  const shine = useTransform(gold, (t) => 0.14 + t * 0.26);
  const opacity = useTransform(offset, (o) => {
    const v = placeOf(g, o);
    return v < R || v > LENGTH - R ? 0 : 1;
  });
  return (
    <motion.g data-g={g} style={{ opacity }}>
      <motion.g style={{ x, y: shadowY }}>
        <ellipse rx={R * 1.05} ry={R * 0.55} fill={`url(#${shadowId})`} opacity="0.9" />
      </motion.g>
      <motion.g style={{ x, y, scale }}>
        <motion.g
          initial={false}
          animate={highlight === "raised" ? { scale: 1.16, y: -R * 0.3 } : { scale: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <circle r={R} fill={darkFill} stroke="#0005" strokeWidth="0.4" />
          <motion.circle r={R} fill={goldFill} style={{ opacity: gold }} />
          <motion.circle cx={-R * 0.3} cy={-R * 0.34} r={R * 0.26} fill="#fff" style={{ opacity: shine }} />
          {highlight === "rim" && (
            <motion.path
              d={rimArc(R + 1.4, -160, -20)}
              fill="none"
              stroke={haloColor}
              strokeWidth="1.6"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.95 }}
              transition={{ duration: 0.25 }}
            />
          )}
          {highlight === "marker" && (
            <motion.circle
              cy={-R * 1.55}
              r={R * 0.2}
              fill={haloColor}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </motion.g>
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
export const BeadStrand = ({ count, target, theme, activeStyle = "raised", onInc, onDec, children, label }) => {
  const gid = useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  const wrap = useRef(null);
  const drag = useRef(null);
  const geom = useIsDesktop() ? GEOM_DESKTOP : GEOM_MOBILE;

  // Beads moved so far: continues after a loop, rewinds on a reset.
  const [ticks, setTicks] = useState(count);
  const [prev, setPrev] = useState(count);
  if (prev !== count) {
    setPrev(count);
    if (count === 0 && prev < target) setTicks(0);
    else if (count !== 0) setTicks((t) => Math.max(0, t + (count - prev)));
  }

  const offset = useSpring(ticks, { stiffness: 170, damping: 24, mass: 1 });
  useEffect(() => {
    if (reduced) offset.jump(ticks);
    else offset.set(ticks);
  }, [ticks, reduced, offset]);

  // The crossing bead follows the finger, one bead per swipe; release past
  // halfway (or with a flick) to count, otherwise it slides back.
  const crossPx = () => {
    const w = wrap.current?.getBoundingClientRect().width || VB_W;
    return geom.cross * (w / VB_W);
  };
  const onDown = (e) => {
    drag.current = { x: e.clientX, y: e.clientY, moved: false, p: 0, v: 0, t: e.timeStamp, lx: e.clientX };
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(e.clientY - d.y)) return;
      d.moved = true;
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
    const dt = Math.max(1, e.timeStamp - d.t);
    d.v = (e.clientX - d.lx) / dt;
    d.t = e.timeStamp;
    d.lx = e.clientX;
    d.p = Math.max(count > 0 ? -1 : 0, Math.min(1, dx / crossPx()));
    offset.jump(ticks + d.p);
  };
  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (!d.moved) return onInc();
    const flick = Math.abs(d.v) > 0.35 && Math.sign(d.v) === Math.sign(d.p) && Math.abs(d.p) > 0.12;
    if (Math.abs(d.p) >= 0.5 || flick) (d.p > 0 ? onInc : onDec)();
    else offset.set(ticks);
  };
  const onCancel = () => {
    if (drag.current?.moved) offset.set(ticks);
    drag.current = null;
  };

  const done = count >= target;
  const beads = [];
  for (let g = ticks - geom.side; g <= ticks + geom.side; g++) beads.push(g);

  return (
    <div
      ref={wrap}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onCancel}
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
          const isNext = g === ticks && !done;
          return (
            <FlowBead
              key={g}
              g={g}
              geom={geom}
              offset={offset}
              countedFrom={ticks - count}
              darkFill={`url(#${gid}-dark)`}
              goldFill={`url(#${gid}-gold)`}
              highlight={isNext ? beadMark(activeStyle) : null}
              haloColor={theme.glow}
              shadowId={`${gid}-shadow`}
            />
          );
        })}
      </svg>

      <div className="pointer-events-none absolute inset-x-0 flex flex-col items-center" style={{ top: `${geom.numberTop}%` }}>
        {children}
      </div>
      </div>
    </div>
  );
};

export default BeadStrand;
