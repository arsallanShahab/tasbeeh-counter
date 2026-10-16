import { useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { beadMark } from "../../utils/theme";

// Beads on the ring, as on a real misbaha.
export const BEADS = 33;

// Shared bead shading: unlit, counted, and the bead under the thumb.
export const BeadGradients = ({ id, theme }) => (
  <defs>
    <radialGradient id={`${id}-dark`} cx="0.35" cy="0.3" r="0.78">
      <stop offset="0%" stopColor={theme.dark[0]} />
      <stop offset="42%" stopColor={theme.dark[1]} />
      <stop offset="100%" stopColor={theme.dark[2]} />
    </radialGradient>
    <radialGradient id={`${id}-gold`} cx="0.35" cy="0.3" r="0.8">
      <stop offset="0%" stopColor={theme.gold[0]} />
      <stop offset="48%" stopColor={theme.gold[1]} />
      <stop offset="100%" stopColor={theme.gold[2]} />
    </radialGradient>
    <radialGradient id={`${id}-front`} cx="0.35" cy="0.3" r="0.85">
      <stop offset="0%" stopColor={theme.front[0]} />
      <stop offset="42%" stopColor={theme.front[1]} />
      <stop offset="100%" stopColor={theme.front[2]} />
    </radialGradient>
  </defs>
);

export const BeadRing = ({ count, target, theme, activeStyle = "raised", onInc, onDec, children, label }) => {
  const mark = beadMark(activeStyle);
  const N = BEADS;
  const STEP = (2 * Math.PI) / N;
  const STEP_DEG = 360 / N;
  const R = 72;
  const beadR = ((2 * Math.PI * R) / N) * 0.4;
  const gid = useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  const wrap = useRef(null);
  const drag = useRef(null);

  // `ticks` = beads moved so far. It keeps going forward after a loop and only
  // rewinds on a real reset, so the ring never spins backwards on its own.
  const [ticks, setTicks] = useState(count);
  const [prev, setPrev] = useState(count);
  if (prev !== count) {
    setPrev(count);
    if (count === 0 && prev < target) setTicks(0); // reset or undo to zero
    else if (count !== 0) setTicks((t) => Math.max(0, t + (count - prev))); // a loop (target -> 0) keeps ticks
  }

  const ringDeg = ticks === 0 ? 0 : -(ticks - 1) * STEP_DEG;

  const angleOf = (e) => {
    const r = wrap.current.getBoundingClientRect();
    return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
  };

  const onDown = (e) => {
    try {
      wrap.current.setPointerCapture(e.pointerId);
    } catch {
      /* unsupported */
    }
    drag.current = { prevA: angleOf(e), acc: 0, steps: 0, moved: false, sx: e.clientX, sy: e.clientY };
  };

  const onMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const a = angleOf(e);
    let dd = a - d.prevA;
    if (dd > Math.PI) dd -= 2 * Math.PI;
    if (dd < -Math.PI) dd += 2 * Math.PI;
    d.acc += dd;
    d.prevA = a;
    if (Math.abs(e.clientX - d.sx) > 6 || Math.abs(e.clientY - d.sy) > 6) d.moved = true;
    const steps = Math.round(d.acc / STEP);
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

  // Lit beads trail behind the front bead, which always sits at the top.
  const lit = count === 0 ? 0 : count % N === 0 ? N : count % N;
  const front = lit > 0 ? (((ticks - 1) % N) + N) % N : -1;
  const isLit = (i) => lit > 0 && ((front - i + N) % N) < lit;
  const lap = Math.ceil(count / N);
  const totalLaps = Math.ceil(target / N);
  const p = Math.min(count / target, 1);
  const C = 2 * Math.PI * 92;
  const done = count >= target;

  const settle = reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 26, mass: 0.6 };

  return (
    <motion.div
      ref={wrap}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="relative flex aspect-square w-[min(20rem,82vw,46svh)] cursor-pointer select-none items-center justify-center lg:w-[min(24rem,60svh)]"
      style={{ touchAction: "none" }}
      data-tap-skip="true"
      role="button"
      tabIndex={-1}
      aria-label={label}
    >
      <AnimatePresence>
        {done &&
          !reduced &&
          [0, 0.24].map((delay, idx) => (
            <motion.div
              key={`sweep-${idx}`}
              className="pointer-events-none absolute inset-[4%] rounded-full"
              style={{ border: `${1.5 - idx * 0.5}px solid ${theme.gold[1]}` }}
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{ opacity: 0, scale: 1.5 + idx * 0.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
      </AnimatePresence>

      <svg viewBox="0 0 200 200" className="relative h-full w-full" aria-hidden="true">
        <BeadGradients id={gid} theme={theme} />
        <circle cx="100" cy="100" r="92" fill="none" stroke="var(--line)" strokeWidth="1.5" />
        <motion.circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke={done ? theme.gold[1] : theme.arc}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={C}
          transform="rotate(-90 100 100)"
          animate={{ strokeDashoffset: C * (1 - p) }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 24 }}
        />
        <circle cx="100" cy="100" r={R} fill="none" stroke={theme.thread} strokeWidth="1.2" />

        <motion.g
          animate={{ rotate: ringDeg }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 190, damping: 24, mass: 0.85 }}
          style={{ transformBox: "view-box", transformOrigin: "100px 100px" }}
        >
          {Array.from({ length: N }).map((_, i) => {
            const a = i * STEP - Math.PI / 2;
            const x = 100 + R * Math.cos(a);
            const y = 100 + R * Math.sin(a);
            const isFront = i === front;
            const on = isLit(i);
            const frontR = mark === "raised" ? 1.32 : mark === "none" ? 1.02 : 1.14;
            const r = isFront ? beadR * frontR : on ? beadR * 1.02 : beadR * 0.94;
            const out = (d) => [x + Math.cos(a) * d, y + Math.sin(a) * d];
            return (
              <g key={i}>
                {/* Rim light and marker sit on the outer side of the ring. */}
                {isFront && mark === "rim" && (
                  <path
                    d={(() => {
                      const rr = r + 1.3;
                      const at = (d) => [x + rr * Math.cos(a + d), y + rr * Math.sin(a + d)].map((v) => v.toFixed(2)).join(" ");
                      return `M${at(-1.25)} A${rr} ${rr} 0 0 1 ${at(1.25)}`;
                    })()}
                    fill="none"
                    stroke={theme.glow}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.95"
                  />
                )}
                {isFront && mark === "marker" && <circle cx={out(r * 1.9)[0]} cy={out(r * 1.9)[1]} r={beadR * 0.24} fill={theme.glow} />}
                <motion.circle
                  cx={x}
                  cy={y}
                  fill={`url(#${gid}-${isFront && mark !== "none" ? "front" : on ? "gold" : "dark"})`}
                  stroke="#0006"
                  strokeWidth="0.4"
                  initial={false}
                  animate={isFront && !reduced ? { r: [r * 0.86, r * 1.06, r] } : { r }}
                  transition={isFront && !reduced ? { duration: 0.36, ease: [0.22, 1.2, 0.36, 1] } : settle}
                />
                {on && <circle cx={x - r * 0.3} cy={y - r * 0.34} r={r * 0.24} fill="#fff" opacity={isFront ? 0.5 : 0.28} />}
              </g>
            );
          })}
        </motion.g>
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 2 }}>
        {children}
      </div>

      {totalLaps > 1 && (
        <div className="pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2" style={{ zIndex: 3 }}>
          <span className="numerals whitespace-nowrap rounded-full border border-line bg-surface px-3 py-1 text-[0.8125rem] font-medium text-muted">
            Round {Math.max(lap, 1)} of {totalLaps}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default BeadRing;
