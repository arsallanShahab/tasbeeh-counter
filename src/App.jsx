import { useEffect } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { THEMES, ARABIC_FONTS } from "./constants/dhikrData";
import { useEffectiveAppearance } from "./utils/theme";
import { useGoogleFonts, URDU_FONT } from "./utils/fonts";
import { useBootScreen } from "./utils/boot";
import { useDocumentSeo } from "./utils/seo";
import { store } from "./utils/storage";
import HomeView from "./components/home/HomeView";
import LibraryView from "./components/library/LibraryView";
import CounterView from "./components/counter/CounterView";
import NamesView from "./components/counter/NamesView";
import StatsView from "./components/stats/StatsView";
import SettingsView from "./components/settings/SettingsView";
import QiblaView from "./components/qibla/QiblaView";
import Navbar from "./components/layout/Navbar";
import DesktopSidebar from "./components/layout/DesktopSidebar";
import DhikrEditor from "./components/library/NewDhikrModal";
import SetEditor from "./components/library/NewListModal";
import UpdateBanner from "./components/common/UpdateBanner";
import { ToastProvider } from "./components/common/Toast";

/* Views that take the whole screen: no tab bar, their own top bar. */
const IMMERSIVE = ["counter", "names", "qibla"];

const AppContent = () => {
  const { loaded, view, settings, modal, setModal } = useApp();
  const location = useLocation();
  const effectiveAppearance = useEffectiveAppearance(settings.appearance);
  useDocumentSeo();
  useBootScreen(loaded);

  const theme = THEMES[settings.theme] || THEMES.qalam;
  const themeVars = theme[effectiveAppearance];
  const arabicFont = ARABIC_FONTS.find((f) => f.id === settings.arabicFont) || ARABIC_FONTS[0];

  useGoogleFonts([
    arabicFont.gf,
    settings.lang !== "en" ? URDU_FONT : null,
    ...(theme.fonts || []),
  ]);

  // Persist the resolved colours so index.html can paint them before React
  // loads (no light/dark flash), and keep the browser chrome colour in sync.
  // Applied to <html> too, so overscroll and the area behind sheets match.
  useEffect(() => {
    if (!loaded || !themeVars) return;
    store.set("paint", { bg: themeVars["--bg"], bg2: themeVars["--bg2"], text: themeVars["--text"], primary: themeVars["--primary"] });
    const root = document.documentElement;
    root.style.background = themeVars["--bg"];
    root.style.colorScheme = effectiveAppearance;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", themeVars["--bg"]);
  }, [loaded, themeVars, effectiveAppearance]);

  // The boot screen in index.html covers this until the app is ready.
  if (!loaded) return <div className="min-h-svh" aria-hidden="true" />;

  const immersive = IMMERSIVE.includes(view);

  return (
    <div
      className="font-body relative min-h-svh overflow-x-clip bg-page text-ink"
      data-arabic-font={arabicFont.id}
      data-theme={effectiveAppearance}
      style={{ ...themeVars, "--font-arabic": arabicFont.stack }}
    >
      <ToastProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      <DesktopSidebar />

      <main
        id="main"
        className={`relative lg:ml-[17rem] ${
          immersive
            ? "px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:px-10 lg:pt-6 lg:pb-6"
            : "px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:px-12 lg:pt-12 lg:pb-16"
        }`}
      >
        <div className={`mx-auto w-full ${immersive ? "max-w-[34rem] lg:max-w-[1180px]" : "max-w-[34rem] lg:max-w-[1120px]"}`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Routes location={location}>
                <Route path="/" element={<HomeView />} />
                <Route path="/library" element={<LibraryView />} />
                <Route path="/counter" element={<CounterView />} />
                <Route path="/names" element={<NamesView />} />
                <Route path="/stats" element={<StatsView />} />
                <Route path="/settings" element={<SettingsView />} />
                <Route path="/qibla" element={<QiblaView />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {!immersive && <Navbar />}

      <DhikrEditor isOpen={modal === "dhikr"} onClose={() => setModal(null)} />
      <SetEditor isOpen={modal === "list"} onClose={() => setModal(null)} />

      <UpdateBanner />
      </ToastProvider>
    </div>
  );
};

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <AppContent />
      </AppProvider>
    </MotionConfig>
  );
}
