import { flushSync } from "react-dom";
import { UNSAFE_createBrowserHistory } from "react-router-dom";

/* ─── Page transitions in the app ────────────────────────────────────────
   Built on the browser's View Transitions: it captures the old screen as an
   image, lets the new page render, then animates the two images on the GPU,
   so the slide stays smooth however heavy the page. The router is given this
   history: each route change becomes a transition, rendered synchronously
   inside it, and its direction comes from depth (a tab, then a shelf, then
   the counter). Sheet history entries and same-page updates pass through. */
const TABS = ["/", "/library", "/stats", "/settings"];
const IMMERSIVE = ["/counter", "/names", "/qibla"];
const depth = (l) => (IMMERSIVE.includes(l.pathname) ? 2 : new URLSearchParams(l.search).get("shelf") ? 1 : 0);

const supported = () => typeof document.startViewTransition === "function" && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function kindOf(from, to) {
  if (from.pathname === to.pathname && from.search === to.search) return null;
  const a = depth(from);
  const b = depth(to);
  if (b > a) return "push";
  if (b < a) return "pop";
  if (from.pathname === to.pathname) return null; // a filter on the same page
  return TABS.includes(from.pathname) && TABS.includes(to.pathname) ? "tab" : "push";
}

export function createNativeHistory() {
  const base = UNSAFE_createBrowserHistory({ v5Compat: true });
  const history = Object.create(base);
  const scrolls = new Map(); // scroll position per history entry, for Back
  let current = base.location;

  history.listen = (fn) =>
    base.listen((update) => {
      const from = current;
      const to = update.location;
      current = to;
      const kind = kindOf(from, to);
      if (!kind || !supported()) return fn(update);
      scrolls.set(from.key, window.scrollY);
      const root = document.documentElement;
      root.dataset.nav = kind;
      const t = document.startViewTransition(() => {
        flushSync(() => fn(update));
        window.scrollTo(0, update.action === "POP" ? scrolls.get(to.key) || 0 : 0);
      });
      t.finished.finally(() => {
        if (root.dataset.nav === kind) delete root.dataset.nav;
      });
    });

  return history;
}
