import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ErrorBoundary } from './components/common/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);

/* Service worker: production only. In dev it would cache Vite's modules and
   serve stale code, so any worker left over from an earlier dev session is
   removed instead. */
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then((reg) => {
        const announce = () =>
          window.dispatchEvent(new CustomEvent("sw-update-available", { detail: { registration: reg } }));

        // A newer version already downloaded on an earlier visit.
        if (reg.waiting && navigator.serviceWorker.controller) announce();

        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            // "installed" with an existing controller means an update is now
            // waiting. Without a controller it is the very first install.
            if (installing.state === "installed" && navigator.serviceWorker.controller) announce();
          });
        });

        // Look for a new version hourly while the tab stays open.
        setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
      })
      .catch((err) => console.warn("Service worker registration failed:", err));

    /* Reload only when the person asked for the update (applyUpdate sets the
       flag). The first install also changes the controller, and that must not
       reload a page someone has only just opened. */
    let reloading = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloading || !window.__tgUpdateRequested) return;
      reloading = true;
      window.location.reload();
    });
  });
} else if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister())).catch(() => {});
  if ("caches" in window) {
    caches.keys().then((keys) => keys.filter((k) => k.startsWith("sabha-v")).forEach((k) => caches.delete(k))).catch(() => {});
  }
}
