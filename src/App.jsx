import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { AppProvider, useApp } from "./context/AppContext";
import { THEMES } from "./constants/dhikrData";
import HomeView from "./components/home/HomeView";
import LibraryView from "./components/library/LibraryView";
import CounterView from "./components/counter/CounterView";
import StatsView from "./components/stats/StatsView";
import SettingsView from "./components/settings/SettingsView";
import Navbar from "./components/layout/Navbar";
import NewDhikrModal from "./components/library/NewDhikrModal";
import NewListModal from "./components/library/NewListModal";

const AppContent = () => {
  const { loaded, view, settings, modal, setModal } = useApp();

  if (!loaded) {
    return (
      <div 
        className="font-body flex min-h-screen items-center justify-center bg-[#030806]" 
        style={{ ...THEMES.classic.dark, background: "var(--bg)" }}
      >
        <p 
          className="font-arabic text-3xl text-[var(--gold)]" 
          style={{ animation: "shimmer 1.4s ease infinite" }} 
          dir="rtl"
        >
          سُبْحَة
        </p>
      </div>
    );
  }

  const activeThemeGroup = THEMES[settings.theme] || THEMES.classic;
  const themeVars = activeThemeGroup[settings.appearance || "dark"];

  return (
    <div 
      className="font-body min-h-screen transition-colors duration-300 relative overflow-x-hidden" 
      style={{ 
        ...themeVars, 
        background: "radial-gradient(120% 80% at 50% -10%, var(--bg2), var(--bg))", 
        color: "var(--text)" 
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

      <div className={`relative mx-auto max-w-md px-5 pt-4 transition-all duration-300 ${view === "counter" ? "pb-6" : "pb-28"}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {view === "home" && <HomeView />}
            {view === "library" && <LibraryView />}
            {view === "counter" && <CounterView />}
            {view === "stats" && <StatsView />}
            {view === "settings" && <SettingsView />}
          </motion.div>
        </AnimatePresence>
      </div>

      <Navbar />

      {/* Render modular modals at root level for viewport positioning immune to layout boundaries */}
      <NewDhikrModal 
        isOpen={modal === "dhikr"} 
        onClose={() => setModal(null)} 
      />
      <NewListModal 
        isOpen={modal === "list"} 
        onClose={() => setModal(null)} 
      />
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
