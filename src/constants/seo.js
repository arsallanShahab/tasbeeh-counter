// Centralized SEO config. The static defaults live in index.html (the crawler's
// first paint = the homepage); this drives per-route updates for client-side
// navigation, which Google executes when rendering the SPA.

export const SITE_URL = "https://tasbeehgo.vercel.app";
export const SITE_NAME = "Tasbeeh Go";
export const OG_IMAGE = `${SITE_URL}/icon-512.png`;

const DEFAULT_DESCRIPTION =
  "Free online tasbeeh counter — count dhikr right in your browser, no app download. Track daily adhkar, build custom dua routines, see streaks, and read the 99 Names of Allah.";

// Keyed by route pathname. `index: false` marks app-only states we keep out of
// search (they need local device data to be meaningful).
export const ROUTE_SEO = {
  "/": {
    title: "Free Online Tasbeeh Counter & Dhikr Counter | Tasbeeh Go",
    description: DEFAULT_DESCRIPTION,
  },
  "/library": {
    title: "Dhikr & Du'a Library — Tasbeeh Go",
    description:
      "Browse a curated library of authentic adhkar and du'as — morning & evening remembrance, tasbeeh after salah, and more. Pin favorites and start counting in one tap.",
    crumb: "Dhikr & Du'a Library",
  },
  "/names": {
    title: "99 Names of Allah (Asma ul Husna) — Tasbeeh Go",
    description:
      "Read and recite the 99 Names of Allah (Asma ul Husna) with Arabic, transliteration, and meaning. Count each name with the built-in digital tasbeeh.",
    crumb: "99 Names of Allah",
  },
  "/stats": {
    title: "Your Dhikr Stats & Streaks — Tasbeeh Go",
    description:
      "Track your dhikr habit with daily goals, streaks, a 12-week heatmap, and milestones in Tasbeeh Go.",
    crumb: "Stats & Streaks",
  },
  "/qibla": {
    title: "Qibla Direction Finder Online (Live Compass) — Tasbeeh Go",
    description:
      "Find the Qibla direction online with a live compass that points to the Kaaba in Makkah from your location. Free Qibla finder — no app download needed, works on phone and desktop.",
    crumb: "Qibla Direction",
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

// BreadcrumbList JSON-LD for the active route. Home is the implicit root; only
// indexable sub-pages with a `crumb` label get a second level. Returns null on
// routes that shouldn't advertise a breadcrumb (home, noindex app states).
export const getBreadcrumbLd = (pathname) => {
  const match = ROUTE_SEO[pathname];
  if (!match || !match.crumb || match.index === false) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: match.crumb, item: `${SITE_URL}${pathname}` },
    ],
  };
};
