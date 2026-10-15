// Small star medallion holding a number, as on a manuscript verse marker.
export const StarNumber = ({ n, className = "" }) => (
  <span className={`relative inline-flex h-11 w-11 items-center justify-center text-gold ${className}`}>
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="3">
        <rect x="22" y="22" width="56" height="56" />
        <rect x="22" y="22" width="56" height="56" transform="rotate(45 50 50)" />
      </g>
    </svg>
    <span className="numerals relative text-[0.8125rem] font-semibold text-ink">{n}</span>
  </span>
);
