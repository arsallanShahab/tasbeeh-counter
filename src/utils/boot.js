import { useEffect } from "react";

// Fade out #boot once data + fonts are ready and it has shown for a beat.
const MIN_VISIBLE_MS = 1100;
const FONT_WAIT_MAX_MS = 2000;
const WORDMARK_MS = 400;

let dismissed = false;

export function useBootScreen(ready) {
  useEffect(() => {
    if (!ready || dismissed) return;
    const el = document.getElementById("boot");
    if (!el) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const minWait = Math.max(0, (reduced ? 400 : MIN_VISIBLE_MS) - performance.now());
    // The font stylesheet loads async, so wait for it before asking for faces.
    const css = document.getElementById("fonts-css");
    const cssReady =
      css && !css.sheet
        ? new Promise((r) => {
            css.addEventListener("load", r, { once: true });
            css.addEventListener("error", r, { once: true });
          })
        : Promise.resolve();
    const faces = () =>
      document.fonts
        ? Promise.all([document.fonts.load('500 1em "Newsreader"'), document.fonts.load('400 1em "Instrument Sans"')])
        : null;
    const fonts = Promise.race([cssReady.then(faces), new Promise((r) => setTimeout(r, FONT_WAIT_MAX_MS))]).catch(() => {});

    // Once the wordmark is in, keep it on screen for a moment.
    const wordmarkSeen = fonts.then(() => new Promise((r) => setTimeout(r, reduced ? 0 : WORDMARK_MS)));

    let cancelled = false;
    Promise.all([wordmarkSeen, new Promise((r) => setTimeout(r, minWait))]).then(() => {
      if (cancelled || dismissed) return;
      dismissed = true;
      el.classList.add("is-done");
      el.addEventListener("transitionend", () => el.remove(), { once: true });
      setTimeout(() => el.remove(), 800); // fallback
    });
    return () => {
      cancelled = true;
    };
  }, [ready]);
}
