import { useEffect } from "react";

/* Google Fonts are requested on demand instead of in one render-blocking
   @import. The core pair (Newsreader + Instrument Sans) and the default Arabic
   face (Amiri) are linked from index.html; everything else, such as another
   Arabic typeface, Urdu Nastaliq, or a theme's own fonts, is added here only
   when it is actually needed. */
const loaded = new Set();

export function loadGoogleFont(family) {
  if (!family || typeof document === "undefined" || loaded.has(family)) return;
  loaded.add(family);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
  link.dataset.font = family;
  document.head.appendChild(link);
}

export function useGoogleFonts(families) {
  const key = (families || []).filter(Boolean).join("|");
  useEffect(() => {
    if (!key) return;
    key.split("|").forEach(loadGoogleFont);
  }, [key]);
}

export const URDU_FONT = "Noto+Nastaliq+Urdu:wght@400;600";
