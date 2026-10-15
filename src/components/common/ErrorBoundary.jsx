import React from "react";
import { THEMES } from "../../constants/dhikrData";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    // The boot screen would otherwise sit on top of the recovery screen.
    document.getElementById("boot")?.remove();
  }

  handleCleanUp = async () => {
    try {
      // 1. Unregister service workers
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }

      // 2. Clear Cache Storage
      if ("caches" in window) {
        const keys = await caches.keys();
        for (const key of keys) {
          await caches.delete(key);
        }
      }

      // 3. Reset localStorage except stats & custom dhikrs/lists
      const stats = localStorage.getItem("stats");
      const dhikrs = localStorage.getItem("dhikrs");
      const lists = localStorage.getItem("lists");
      
      localStorage.clear();
      
      if (stats) localStorage.setItem("stats", stats);
      if (dhikrs) localStorage.setItem("dhikrs", dhikrs);
      if (lists) localStorage.setItem("lists", lists);

      // Trigger a hard reload
      window.location.reload();
    } catch (e) {
      console.error("Cleanup failed:", e);
      // Fallback: clear localStorage and reload anyway
      localStorage.clear();
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Rendered outside the themed app root, so it carries the Qalam colours
      // itself, following the device light/dark preference.
      const dark = typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      return (
        <div
          className="font-body flex min-h-svh items-center justify-center bg-page p-6 text-ink"
          style={THEMES.qalam[dark ? "dark" : "light"]}
          role="alert"
        >
          <div className="w-full max-w-md space-y-6">
            <p className="eyebrow">Tasbeeh Go</p>
            <h1 className="font-display text-[2.5rem] leading-tight text-ink">Something went wrong</h1>
            <p className="text-[0.9375rem] leading-relaxed text-muted">
              This can happen after an update, when the browser still holds old files. Repairing clears those files and
              resets settings. Your counts and your own dhikr and sets are kept.
            </p>
            <pre className="max-h-32 overflow-auto rounded-xl border border-line bg-surface p-4 text-[0.8125rem] whitespace-pre-wrap text-muted [overflow-wrap:anywhere]">
              {this.state.error?.toString() || "Unknown error"}
            </pre>
            <button type="button" onClick={this.handleCleanUp} className="btn btn-primary btn-lg w-full">
              Repair and reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
