// Centralized SEO config. The static defaults live in index.html (the crawler's
// first paint = the homepage); this drives per-route updates for client-side
// navigation, which Google executes when rendering the SPA.

export const SITE_URL = "https://tasbeehgo.vercel.app";
export const SITE_NAME = "Tasbeeh Go";
export const OG_IMAGE = `${SITE_URL}/icon-512.png`;

const DEFAULT_DESCRIPTION =
  "Free digital tasbeeh & dhikr counter for phone and desktop. Track daily adhkar, build custom dua routines, view streak stats, and read the 99 Names of Allah.";

// Keyed by route pathname. `index: false` marks app-only states we keep out of
// search (they need local device data to be meaningful).
export const ROUTE_SEO = {
  "/": {
    title: "Tasbeeh Go — Digital Tasbeeh & Dhikr Counter",
    description: DEFAULT_DESCRIPTION,
  },
  "/library": {
    title: "Dhikr & Du'a Library — Tasbeeh Go",
    description:
      "Browse a curated library of authentic adhkar and du'as — morning & evening remembrance, tasbeeh after salah, and more. Pin favorites and start counting in one tap.",
  },
  "/names": {
    title: "99 Names of Allah (Asma ul Husna) — Tasbeeh Go",
    description:
      "Read and recite the 99 Names of Allah (Asma ul Husna) with Arabic, transliteration, and meaning. Count each name with the built-in digital tasbeeh.",
  },
  "/stats": {
    title: "Your Dhikr Stats & Streaks — Tasbeeh Go",
    description:
      "Track your dhikr habit with daily goals, streaks, a 12-week heatmap, and milestones in Tasbeeh Go.",
  },
  "/counter": {
    title: "Counter — Tasbeeh Go",
    description: DEFAULT_DESCRIPTION,
    index: false,
  },
  "/settings": {
    title: "Settings — Tasbeeh Go",
    description: DEFAULT_DESCRIPTION,
    index: false,
  },
};

export const getRouteSeo = (pathname) => {
  const match = ROUTE_SEO[pathname] || ROUTE_SEO["/"];
  return {
    index: true,
    ...match,
    url: `${SITE_URL}${pathname === "/" ? "/" : pathname}`,
  };
};
