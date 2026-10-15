import { useId } from "react";

// Tasbeeh Go emblem: nine polished beads around a carved eight-pointed star
// (khatam). Depth comes from shading, not lines. The gold bead at the top is
// the one being counted; the soft gold one has just been counted.
const C = 24;
const N = 9;
const R = 15.2;

const star = (outer, inner) =>
  Array.from({ length: 16 }, (_, i) => {
    const a = ((i * 22.5 - 90) * Math.PI) / 180;
    const r = i % 2 ? inner : outer;
    return [C + r * Math.cos(a), C + r * Math.sin(a)];
  });

// Sixteen facets from the centre, alternating light and shade like a carving.
const Facets = ({ outer, inner }) => {
  const p = star(outer, inner);
  return p.map(([x, y], i) => {
    const [nx, ny] = p[(i + 1) % p.length];
    return <polygon key={i} points={`${C},${C} ${x.toFixed(2)},${y.toFixed(2)} ${nx.toFixed(2)},${ny.toFixed(2)}`} fill={i % 2 ? "#b98a2c" : "#ebc366"} />;
  });
};

export const BeadMark = ({ size = 24, className = "" }) => {
  const id = useId().replace(/:/g, "");
  const small = size <= 32;
  const br = small ? 3.7 : 3.25;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-p`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" style={{ stopColor: "color-mix(in srgb, var(--primary) 55%, #fff)" }} />
          <stop offset="0.5" style={{ stopColor: "var(--primary)" }} />
          <stop offset="1" style={{ stopColor: "color-mix(in srgb, var(--primary) 60%, #000)" }} />
        </radialGradient>
        <radialGradient id={`${id}-g`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#f8df9f" />
          <stop offset="0.5" stopColor="#d6a33f" />
          <stop offset="1" stopColor="#8c6318" />
        </radialGradient>
        <radialGradient id={`${id}-s`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fbefcf" />
          <stop offset="0.55" stopColor="#e0c486" />
          <stop offset="1" stopColor="#a58546" />
        </radialGradient>
        <radialGradient id={`${id}-sh`}>
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      {Array.from({ length: N }).map((_, i) => {
        const a = (i / N) * Math.PI * 2 - Math.PI / 2;
        const x = C + R * Math.cos(a);
        const y = C + R * Math.sin(a);
        const front = i === 0;
        const r = front ? br * 1.3 : br;
        const fill = front ? `${id}-g` : i === N - 1 ? `${id}-s` : `${id}-p`;
        return (
          <g key={i}>
            {!small && <ellipse cx={x} cy={y + r * 0.55} rx={r * 1.05} ry={r * 0.6} fill={`url(#${id}-sh)`} />}
            <circle cx={x} cy={y} r={r} fill={`url(#${fill})`} />
            {!small && <circle cx={x - r * 0.33} cy={y - r * 0.38} r={r * 0.22} fill="#fff" opacity="0.6" />}
          </g>
        );
      })}
      <Facets outer={small ? 7.8 : 7.4} inner={small ? 5.4 : 5.1} />
    </svg>
  );
};

export const BrandMark = ({ className = "", size = "md", showMark = true }) => {
  const text = size === "lg" ? "text-[2.25rem]" : size === "sm" ? "text-xl" : "text-[1.625rem]";
  const mark = size === "lg" ? 44 : size === "sm" ? 26 : 34;
  return (
    <span className={`inline-flex items-center gap-2 text-ink ${className}`}>
      {showMark && <BeadMark size={mark} />}
      <span className={`font-display leading-none font-medium tracking-[-0.02em] ${text}`}>
        tasbeeh<span className="italic text-accent">go</span>
      </span>
    </span>
  );
};

export default BrandMark;
