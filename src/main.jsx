import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then((reg) => {
        console.log("Service Worker registered successfully:", reg.scope);

        const notifyIfWaiting = () => {
          if (reg.waiting && navigator.serviceWorker.controller) {
            window.dispatchEvent(
              new CustomEvent("sw-update-available", { detail: { registration: reg } })
            );
          }
        };
        notifyIfWaiting();

        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              window.dispatchEvent(
                new CustomEvent("sw-update-available", { detail: { registration: reg } })
              );
            }
          });
        });

        // Periodic update check (hourly) while the tab is open
        setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
      })
      .catch((err) => console.warn("Service Worker registration failed:", err));

    let reloaded = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    });
  });
}
