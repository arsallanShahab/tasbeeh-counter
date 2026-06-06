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
      return (
        <div
          className="font-body flex min-h-svh flex-col items-center justify-center p-6 text-center select-none"
          style={{ 
            ...THEMES.classic.dark, 
            background: "radial-gradient(120% 80% at 50% -10%, var(--bg2), var(--bg))", 
            color: "var(--text)" 
          }}
        >
          <div className="max-w-md w-full rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-xl space-y-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl mx-auto bg-amber-500/10 text-[var(--gold)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-bold text-[var(--text)]">App Recovery</h1>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Sabḥa encountered an issue (which can happen during app upgrades or due to browser caching mismatch). Click the button below to repair the app.
              </p>
            </div>

            <div className="rounded-xl bg-[var(--surface2)] border border-[var(--line)] p-4 text-left overflow-auto max-h-32">
              <code className="text-[10px] text-[var(--danger)] block break-all whitespace-pre-wrap font-mono">
                {this.state.error?.toString() || "Unknown error"}
              </code>
            </div>

            <button
              onClick={this.handleCleanUp}
              className="w-full rounded-2xl bg-[var(--primary)] text-white py-3.5 text-sm font-bold cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all duration-300 shadow-md flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
              Clean Up & Repair App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
