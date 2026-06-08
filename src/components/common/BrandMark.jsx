import React from "react";

// "Tasbeeh Go" wordmark rendered as text in the logo's brand colors.
// - "tasbeeh" uses --text so it adapts (navy on cream, cream on navy) like the logo
// - the "g" is brand teal, the "o" is brand coral — fixed so the mark reads the
//   same in every theme. A small lilac spark sits above to echo the logo.
const BRAND = { teal: "#34bcab", coral: "#f0938a", lilac: "#b9a6e6" };

export const BrandMark = ({ className = "", style = {}, spark = true }) => (
  <span
    className={`font-brand relative inline-flex items-baseline leading-none lowercase ${className}`}
    style={{ fontWeight: 700, letterSpacing: "-0.01em", ...style }}
  >
    {spark && (
      <span
        aria-hidden="true"
        className="absolute -top-[0.32em] left-[0.55em] leading-none"
        style={{ color: BRAND.lilac, fontSize: "0.5em" }}
      >
        ✦
      </span>
    )}
    <span style={{ color: "var(--text)" }}>tasbeeh</span>
    <span style={{ color: BRAND.teal }}>g</span>
    <span style={{ color: BRAND.coral }}>o</span>
  </span>
);

export default BrandMark;
