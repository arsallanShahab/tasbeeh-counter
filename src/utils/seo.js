import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getRouteSeo, OG_IMAGE, SITE_NAME } from "../constants/seo";

// Upsert a <meta>/<link> tag in <head> by selector, creating it if absent.
function setTag(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(selector.startsWith("link") ? "link" : "meta");
    document.head.appendChild(el);
  }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
}

// Keeps document title + key meta in sync with the active route on client-side
// navigation. Mutates the existing tags rendered statically in index.html so we
// never end up with duplicates.
export function useDocumentSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const { title, description, url, index } = getRouteSeo(pathname);

    document.title = title;

    setTag('meta[name="description"]', { name: "description", content: description });
    setTag('link[rel="canonical"]', { rel: "canonical", href: url });
    setTag('meta[name="robots"]', {
      name: "robots",
      content: index
        ? "index, follow, max-image-preview:large, max-snippet:-1"
        : "noindex, follow",
    });

    // Open Graph
    setTag('meta[property="og:title"]', { property: "og:title", content: title });
    setTag('meta[property="og:description"]', { property: "og:description", content: description });
    setTag('meta[property="og:url"]', { property: "og:url", content: url });
    setTag('meta[property="og:image"]', { property: "og:image", content: OG_IMAGE });
    setTag('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });

    // Twitter
    setTag('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    setTag('meta[name="twitter:description"]', { name: "twitter:description", content: description });
  }, [pathname]);
}
