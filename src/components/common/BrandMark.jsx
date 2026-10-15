/* Tasbeeh Go wordmark. The mark is a misbaha seen from above: a loop of nine
   beads with the "front" bead, the one under the thumb, filled in the accent.
   It is the same object as the counter, so the brand and the product are one
   image. The wordmark is set in the display serif, with "go" in italic. */
export const BeadMark = ({ size = 24, className = "" }) => {
  const n = 9;
  const r = 8.4;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r={r} fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.9" />
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const front = i === 0;
        return (
          <circle
            key={i}
            cx={12 + r * Math.cos(a)}
            cy={12 + r * Math.sin(a)}
            r={front ? 2.6 : 1.75}
            fill={front ? "var(--primary)" : "currentColor"}
          />
        );
      })}
    </svg>
  );
};

export const BrandMark = ({ className = "", size = "md", showMark = true }) => {
  const text = size === "lg" ? "text-[2.25rem]" : size === "sm" ? "text-xl" : "text-[1.625rem]";
  const mark = size === "lg" ? 34 : size === "sm" ? 20 : 26;
  return (
    <span className={`inline-flex items-center gap-2 text-ink ${className}`}>
      {showMark && <BeadMark size={mark} />}
      <span className={`font-display leading-none font-medium tracking-[-0.015em] ${text}`}>
        tasbeeh<span className="italic text-accent">go</span>
      </span>
    </span>
  );
};

export default BrandMark;
