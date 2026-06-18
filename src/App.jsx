import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { THEMES, ARABIC_FONTS } from "./constants/dhikrData";
import { useEffectiveAppearance } from "./utils/theme";
import { useDocumentSeo } from "./utils/seo";
import HomeView from "./components/home/HomeView";
import LibraryView from "./components/library/LibraryView";
import CounterView from "./components/counter/CounterView";
import NamesView from "./components/counter/NamesView";
import StatsView from "./components/stats/StatsView";
import SettingsView from "./components/settings/SettingsView";
import Navbar from "./components/layout/Navbar";
import AppHeader from "./components/layout/AppHeader";
import NewDhikrModal from "./components/library/NewDhikrModal";
import NewListModal from "./components/library/NewListModal";
import UpdateBanner from "./components/common/UpdateBanner";
import BrandMark from "./components/common/BrandMark";

const AppContent = () => {
  const { loaded, view, settings, modal, setModal } = useApp();
  const location = useLocation();
  const effectiveAppearance = useEffectiveAppearance(settings.appearance);
  useDocumentSeo();

  // Wait for the Fredoka brand font before revealing the splash wordmark.
  // Otherwise it renders in the fallback font first and visibly reflows when
  // Fredoka swaps in (FOUT). We force the load, then fade it in already-static.
  const [brandFontReady, setBrandFontReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const reveal = () => { if (!cancelled) setBrandFontReady(true); };
    if (typeof document !== "undefined" && document.fonts?.load) {
      Promise.race([
        document.fonts.load("700 1em Fredoka"),
        new Promise((r) => setTimeout(r, 1500)), // safety fallback
      ]).then(reveal, reveal);
    } else {
      reveal();
    }
    return () => { cancelled = true; };
  }, []);

  if (!loaded) {
    return (
      <div
        className="font-body flex min-h-svh items-center justify-center"
        style={{ background: "#151e31", "--text": "#f6efe0" }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: brandFontReady ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <BrandMark
            className="text-5xl"
            style={brandFontReady ? { animation: "shimmer 1.6s ease infinite" } : undefined}
          />
        </motion.div>
      </div>
    );
  }

  const activeThemeGroup = THEMES[settings.theme] || THEMES.classic;
  const themeVars = activeThemeGroup[effectiveAppearance];

  const arabicFont =
    ARABIC_FONTS.find((f) => f.id === settings.arabicFont) || ARABIC_FONTS[0];

  return (
    <div
      className="font-body min-h-svh transition-colors duration-300 relative overflow-x-hidden"
      data-arabic-font={arabicFont.id}
      style={{
        ...themeVars,
        "--font-arabic": arabicFont.stack,
        background: "radial-gradient(120% 80% at 50% -10%, var(--bg2), var(--bg))",
        color: "var(--text)",
      }}
    >
      {/* Dynamic Geometric Background Grid */}
      <svg
        className="pointer-events-none fixed inset-0 h-full w-full select-none"
        style={{ opacity: 0.04 }}
        aria-hidden="true"
      >
        <defs>
          <pattern id="geo" width="62" height="62" patternUnits="userSpaceOnUse">
            <path
              d="M31 2 L38 24 L60 31 L38 38 L31 60 L24 38 L2 31 L24 24 Z"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo)" />
      </svg>

      <div className={`relative mx-auto max-w-md px-5 transition-all duration-300 ${["counter", "names"].includes(view) ? "pt-4 pb-6" : "pt-20 pb-28"}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomeView />} />
              <Route path="/library" element={<LibraryView />} />
              <Route path="/counter" element={<CounterView />} />
              <Route path="/names" element={<NamesView />} />
              <Route path="/stats" element={<StatsView />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      <AppHeader />
      <Navbar />

      {/* Top-level modals — open state lives in URL search params (?modal=dhikr|list) */}
      <NewDhikrModal isOpen={modal === "dhikr"} onClose={() => setModal(null)} />
      <NewListModal isOpen={modal === "list"} onClose={() => setModal(null)} />

      <UpdateBanner />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
