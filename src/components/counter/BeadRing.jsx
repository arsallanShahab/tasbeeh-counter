import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export const BeadRing = ({ count, target, theme, activeStyle = "glow", onInc, onDec, children }) => {
  const N = Math.max(1, Math.min(target, 33));
  const STEP = (2 * Math.PI) / N;
  const STEP_DEG = 360 / N;
  const R = 70;
  const beadR = Math.max(4.5, Math.min(((2 * Math.PI * R) / N) * 0.42, 9));
  const wrap = useRef(null);
  const drag = useRef(null);

  // Ring rotation — the active (front) bead always sits at top-center.
  // We track cumulative ticks so lap loops continue forward (no snap-back).
  // rotation = -(ticks - 1) * STEP_DEG  →  bead 0 stays at top on the very
  // first count, bead 1 rotates up to top on the second, and so on.
  const [ticks, setTicks] = useState(count);
  const lastCountRef = useRef(count);

  useEffect(() => {
    const prev = lastCountRef.current;
    lastCountRef.current = count;
    if (prev === count) return;
    let delta = count - prev;
    // Auto-loop reset: prev hit lap end (N), count fell back to 0.
    // Keep rotation continuous by treating it as no extra step here —
    // the next tap will rotate the ring forward by one as part of the new lap.
    if (prev === N && count === 0) delta = 0;
    setTicks((t) => Math.max(0, t + delta));
  }, [count, N]);

  const ringDeg = ticks === 0 ? 0 : -(ticks - 1) * STEP_DEG;

  const centerPt = () => {
    if (!wrap.current) return { x: 0, y: 0 };
    const r = wrap.current.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  const angleOf = (e) => {
    const c = centerPt();
    return Math.atan2(e.clientY - c.y, e.clientX - c.x);
  };

  const onDown = (e) => {
    try { wrap.current.setPointerCapture(e.pointerId); } catch { /* noop */ }
    drag.current = {
      prevA: angleOf(e), acc: 0, steps: 0, moved: false,
      sx: e.clientX, sy: e.clientY
    };
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

    if (Math.abs(e.clientX - d.sx) > 6 || Math.abs(e.clientY - d.sy) > 6) {
      d.moved = true;
    }

    const steps = Math.round(d.acc / STEP);
    if (steps !== d.steps) {
      const diff = steps - d.steps;
      for (let k = 0; k < Math.abs(diff); k++) {
        if (diff > 0) onInc();
        else onDec();
      }
      d.steps = steps;
    }
  };

  const onUp = () => {
    const d = drag.current;
    if (d && !d.moved) onInc();
    drag.current = null;
  };

  const lit = count === 0 ? 0 : count >= target ? N : (count % N === 0 ? N : count % N);
  const lap = Math.ceil(count / N);
  const totalLaps = Math.ceil(target / N);
  const p = Math.min(count / target, 1);
  const C = 2 * Math.PI * 92;
  const done = count >= target;

  const beadSpring = { type: "spring", stiffness: 420, damping: 22, mass: 0.6 };

  return (
    <motion.div
      ref={wrap}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="relative flex h-[320px] w-[320px] cursor-pointer select-none items-center justify-center"
      style={{ touchAction: "none" }}
    >
      {/* Soft ambient halo that intensifies with progress (no scale pulse — keeps the ring grounded) */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${theme.glow}26 0%, transparent 60%)`,
          filter: "blur(8px)",
        }}
        animate={{ opacity: 0.3 + p * 0.4 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Completion shockwave — staggered ripples that emerge from the ring and decay outward */}
      <AnimatePresence>
        {done &&
          [0, 0.22, 0.44].map((delay, idx) => (
            <motion.div
              key={`sweep-${idx}`}
              className="pointer-events-none absolute rounded-full"
              style={{
                left: "50%", top: "50%",
                width: "92%", height: "92%",
                marginLeft: "-46%", marginTop: "-46%",
                border: `${1.8 - idx * 0.4}px solid ${theme.gold[1]}`,
                zIndex: 0,
              }}
              initial={{ opacity: 0.55 - idx * 0.12, scale: 1 }}
              animate={{ opacity: 0, scale: 2.1 + idx * 0.25 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.6,
                delay,
                ease: [0.16, 1, 0.3, 1], // quintic ease-out — natural decay
              }}
            />
          ))}
      </AnimatePresence>

      <svg viewBox="0 0 200 200" className="relative h-full w-full" style={{ zIndex: 1 }}>
        <defs>
          <radialGradient id="beadDark" cx="0.35" cy="0.3" r="0.78">
            <stop offset="0%" stopColor={theme.dark[0]} />
            <stop offset="42%" stopColor={theme.dark[1]} />
            <stop offset="100%" stopColor={theme.dark[2]} />
          </radialGradient>
          <radialGradient id="beadGold" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0%" stopColor={theme.gold[0]} />
            <stop offset="48%" stopColor={theme.gold[1]} />
            <stop offset="100%" stopColor={theme.gold[2]} />
          </radialGradient>
          <radialGradient id="beadFront" cx="0.35" cy="0.3" r="0.85">
            <stop offset="0%" stopColor={theme.front[0]} />
            <stop offset="42%" stopColor={theme.front[1]} />
            <stop offset="100%" stopColor={theme.front[2]} />
          </radialGradient>
        </defs>

        {/* progress arc */}
        <circle cx="100" cy="100" r="92" fill="none" stroke="var(--surface2)" strokeWidth="5" />
        <motion.circle
          cx="100" cy="100" r="92"
          fill="none"
          stroke={done ? theme.gold[1] : theme.arc}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={C}
          transform="rotate(-90 100 100)"
          animate={{ strokeDashoffset: C * (1 - p) }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
        />

        {/* thread */}
        <circle cx="100" cy="100" r={R} fill="none" stroke={theme.thread} strokeWidth="1.5" />

        {/* Rotating bead group — physical "thumb slides the bead" feel.
            transform-box + transform-origin pin rotation to the ring center (100,100). */}
        <motion.g
          animate={{ rotate: ringDeg }}
          transition={{ type: "spring", stiffness: 180, damping: 22, mass: 0.9 }}
          style={{ transformBox: "view-box", transformOrigin: "100px 100px" }}
        >
            {Array.from({ length: N }).map((_, idx) => {
              const a = idx * STEP - Math.PI / 2;
              const x = 100 + R * Math.cos(a);
              const y = 100 + R * Math.sin(a);
              const on = idx < lit;
              const front = idx === lit - 1;
              const grad = front ? "beadFront" : on ? "beadGold" : "beadDark";
              const targetR = front ? beadR * 1.5 : on ? beadR * 1.05 : beadR * 0.92;

              return (
                <g key={idx}>
                  {/* Active-style aura behind front bead — static halo so the bead
                      feels anchored to the thread instead of hovering/breathing. */}
                  {front && activeStyle === "glow" && (
                    <motion.circle
                      cx={x} cy={y}
                      fill={theme.glow}
                      initial={{ r: beadR * 1.4, opacity: 0 }}
                      animate={{ r: beadR * 1.8, opacity: 0.18 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  {front && activeStyle === "pulse" && (
                    <motion.circle
                      cx={x} cy={y}
                      fill={theme.glow}
                      initial={{ r: beadR, opacity: 0.4 }}
                      animate={{ r: beadR * 2.6, opacity: 0 }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                  {front && activeStyle === "ring" && (
                    <motion.circle
                      cx={x} cy={y}
                      fill="none"
                      stroke={theme.glow}
                      strokeWidth="1.6"
                      initial={{ r: beadR * 1.45 + 2.5, opacity: 0.9 }}
                      animate={{ r: beadR * 1.7 + 3, opacity: [0.9, 0.4, 0.9] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}

                  {/* The bead itself — pops with a brief overshoot when newly lit,
                      settles with a softer spring on size changes. */}
                  <motion.circle
                    cx={x} cy={y}
                    fill={`url(#${grad})`}
                    stroke="#0007"
                    strokeWidth="0.4"
                    initial={false}
                    animate={
                      front
                        ? { r: [targetR * 0.78, targetR * 1.12, targetR] }
                        : { r: targetR }
                    }
                    transition={
                      front
                        ? { duration: 0.42, ease: [0.22, 1.4, 0.36, 1] }
                        : beadSpring
                    }
                  />

                  {/* Subtle inner highlight to enhance dimensional feel */}
                  {on && (
                    <motion.circle
                      cx={x - targetR * 0.28}
                      cy={y - targetR * 0.32}
                      fill="#fff"
                      initial={false}
                      animate={{ r: targetR * 0.22, opacity: front ? 0.55 : 0.32 }}
                      transition={beadSpring}
                    />
                  )}
                </g>
              );
            })}
        </motion.g>

      </svg>

      <div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        style={{ zIndex: 2 }}
      >
        {children}
      </div>

      <AnimatePresence>
        {totalLaps > 1 && (
          <motion.div
            key={`lap-${Math.max(lap, 1)}`}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-5 text-center"
            style={{ zIndex: 3 }}
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <span
              className="rounded-full px-3 py-1 text-[11px] font-bold whitespace-nowrap backdrop-blur-xl"
              style={{
                background: "color-mix(in srgb, var(--surface) 88%, transparent)",
                color: theme.arc,
                border: "1px solid color-mix(in srgb, var(--line) 60%, transparent)",
                boxShadow:
                  "0 4px 14px -8px color-mix(in srgb, var(--primary) 30%, transparent), inset 0 1px 0 0 color-mix(in srgb, #fff 8%, transparent)",
              }}
            >
              lap {Math.max(lap, 1)} / {totalLaps}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BeadRing;
