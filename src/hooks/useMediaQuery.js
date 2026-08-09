import { useEffect, useState } from "react";

/* Subscribe to a CSS media query from JS. The initial value is read
   synchronously so the very first render already matches the viewport — no
   mobile-layout flash before an effect corrects it. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches); // resync in case the viewport changed pre-subscribe
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, [query]);

  return matches;
}

/* The one breakpoint that separates the two app personalities: below it the UI
   is the native-mobile experience (floating header, bottom tab bar, single
   column); at/above it we render the native-desktop shell (persistent sidebar,
   multi-column layouts). Matches Tailwind's `lg`, so JS-driven branches and
   `lg:` utility classes always agree. */
export const DESKTOP_QUERY = "(min-width: 1024px)";

export const useIsDesktop = () => useMediaQuery(DESKTOP_QUERY);

export default useMediaQuery;
