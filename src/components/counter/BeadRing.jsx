import React, { useRef } from "react";

export const BeadRing = ({ count, target, theme, activeStyle = "glow", onInc, onDec, children }) => {
  const N = Math.max(1, Math.min(target, 33));
  const STEP = (2 * Math.PI) / N;
  const R = 70;
  const beadR = Math.max(4.5, Math.min(((2 * Math.PI * R) / N) * 0.42, 9));
  const wrap = useRef(null);
  const drag = useRef(null);

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
    try {
      wrap.current.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    drag.current = {
      prevA: angleOf(e),
      acc: 0,
      steps: 0,
      moved: false,
      sx: e.clientX,
      sy: e.clientY
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
    
    const steps = Math.round(d.acc / STEP); // one full revolution drag = one lap
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
    if (d && !d.moved) {
      onInc();
    }
    drag.current = null;
  };

  const lit = count === 0 ? 0 : count >= target ? N : (count % N === 0 ? N : count % N);
  const lap = Math.ceil(count / N);
  const totalLaps = Math.ceil(target / N);
  const p = Math.min(count / target, 1);
  const C = 2 * Math.PI * 92;

  return (
    <div 
      ref={wrap} 
      onPointerDown={onDown} 
      onPointerMove={onMove} 
      onPointerUp={onUp} 
      onPointerCancel={onUp}
      className="relative flex h-[320px] w-[320px] cursor-pointer select-none items-center justify-center"
      style={{ touchAction: "none" }}
    >
      <svg viewBox="0 0 200 200" className="h-full w-full">
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

        {/* overall progress toward target */}
        <circle cx="100" cy="100" r="92" fill="none" stroke="var(--surface2)" strokeWidth="5" />
        <circle 
          cx="100" 
          cy="100" 
          r="92" 
          fill="none" 
          stroke={theme.arc} 
          strokeWidth="5" 
          strokeLinecap="round"
          strokeDasharray={C} 
          strokeDashoffset={C * (1 - p)} 
          transform="rotate(-90 100 100)"
          style={{ transition: "stroke-dashoffset .3s cubic-bezier(.2,.7,.3,1)" }} 
        />

        {/* thread */}
        <circle cx="100" cy="100" r={R} fill="none" stroke={theme.thread} strokeWidth="1.5" />

        {/* beads — fill clockwise from top, frontier highlighted per activeStyle */}
        {Array.from({ length: N }).map((_, idx) => {
          const a = idx * STEP - Math.PI / 2;
          const x = 100 + R * Math.cos(a);
          const y = 100 + R * Math.sin(a);
          const on = idx < lit;
          const front = idx === lit - 1;
          const grad = front ? "beadFront" : on ? "beadGold" : "beadDark";
          return (
            <g key={idx}>
              {front && activeStyle === "glow" && <circle cx={x} cy={y} r={beadR * 2} fill={theme.glow} opacity="0.16" />}
              {front && activeStyle === "pulse" && <circle cx={x} cy={y} r={beadR * 1.55} fill={theme.glow} className="bead-pulse" />}
              {front && activeStyle === "ring" && <circle cx={x} cy={y} r={beadR * 1.45 + 2.5} fill="none" stroke={theme.glow} strokeWidth="1.6" />}
              <circle 
                cx={x} 
                cy={y} 
                r={front ? beadR * 1.45 : beadR} 
                fill={`url(#${grad})`} 
                stroke="#0007" 
                strokeWidth="0.4"
                style={{ transition: "r .14s ease" }} 
              />
            </g>
          );
        })}
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>

      {totalLaps > 1 && (
        <div className="pointer-events-none absolute bottom-2 left-0 right-0 text-center">
          <span 
            className="rounded-full bg-[var(--surface2)] px-3 py-1 text-xs font-medium" 
            style={{ color: theme.arc }}
          >
            lap {Math.max(lap, 1)} / {totalLaps}
          </span>
        </div>
      )}
    </div>
  );
};

export default BeadRing;
