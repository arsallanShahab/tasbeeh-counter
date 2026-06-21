import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "motion/react";
import { useDrag } from "@use-gesture/react";
import { Navigate } from "react-router-dom";
import {
  ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Sparkles, Quote, BookText,
  LayoutGrid, X
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SEED_NAMES_OF_ALLAH } from "../../constants/asmaUlHusna";

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "105%" : direction < 0 ? "-105%" : "0%",
    opacity: 0,
    scale: 0.98
  }),
  center: {
    x: "0%",
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 350, damping: 35 },
      opacity: { duration: 0.18 },
      scale: { type: "spring", stiffness: 350, damping: 35 }
    }
  },
  exit: (direction) => ({
    x: direction > 0 ? "-105%" : direction < 0 ? "105%" : "0%",
    opacity: 0,
    scale: 0.98,
    transition: {
      x: { type: "spring", stiffness: 350, damping: 35 },
      opacity: { duration: 0.18 },
      scale: { type: "spring", stiffness: 350, damping: 35 }
    }
  })
};

export const NamesView = () => {
  const {
    view,
    setView,
    namesSession,
    settings,
    navigateNames,
    startNamesSession,
    vibe,
  } = useApp();

  const [activeTab, setActiveTab] = useState("meaning");
  const [direction, setDirection] = useState(0); // -1 for previous, 1 for next
  const [overview, setOverview] = useState(false); // grid jump-to panel

  const idx = namesSession.index;
  const activeName = SEED_NAMES_OF_ALLAH[idx];

  // Motion values for drag gesture
  const dragX = useMotionValue(0);
  const cardOpacity = useTransform(dragX, [-150, 0, 150], [0.5, 1, 0.5]);
  const cardScale = useTransform(dragX, [-150, 0, 150], [0.97, 1, 0.97]);
  const cardRotate = useTransform(dragX, [-150, 0, 150], [-8, 0, 8]);

  const handleNavigate = (dir) => {
    if (dir === 1 && idx >= 98) return;
    if (dir === -1 && idx <= 0) return;
    setDirection(dir);
    navigateNames(dir);
  };

  // Jump straight to any name from the overview grid.
  const jumpTo = (target) => {
    if (target !== idx) {
      setDirection(target > idx ? 1 : -1);
      startNamesSession(target); // sets index (we're already on /names)
      vibe(8);
    }
    setOverview(false);
  };

  // Horizontal swipe via @use-gesture — axis-locked to "x" so the browser keeps
  // native vertical scrolling (touch-action: pan-y) for the tab content, while
  // the library handles pointer capture, tap-filtering and edge-gesture safety.
  const bindSwipe = useDrag(
    ({ down, movement: [mx], velocity: [vx], last, tap }) => {
      if (tap) return;
      if (down) {
        dragX.set(mx * 0.6);
        return;
      }
      // released: commit on distance OR a quick flick (either direction)
      if (last) {
        const committed = Math.abs(mx) > 55 || vx > 0.35;
        if (committed) handleNavigate(mx < 0 ? 1 : -1);
        animate(dragX, 0, { type: "spring", stiffness: 350, damping: 35 });
      }
    },
    { axis: "x", filterTaps: true, pointer: { touch: true } }
  );

  // Reset tab to meaning when active name changes
  useEffect(() => {
    setActiveTab("meaning");
  }, [idx]);

  // Keyboard navigation
  useEffect(() => {
    if (view !== "names") return;
    const onKey = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (e.key === "ArrowLeft") handleNavigate(-1);
      else if (e.key === "ArrowRight") handleNavigate(1);
      else if (e.key === "Escape") setView("home");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, idx, navigateNames, setView]);

  if (!activeName) {
    return <Navigate to="/" replace />;
  }

  const hasVirtues = !!(activeName.hadith || activeName.benefits);
  const hasStory = !!activeName.story;

  return (
    <div
      className="relative flex h-[calc(100svh-2.5rem)] flex-col justify-between"
      style={{ touchAction: "pan-y", overscrollBehaviorX: "contain" }}
    >
      {/* Floating Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="flex items-center justify-between rounded-full px-2 py-1.5 backdrop-blur-2xl z-10"
        style={{
          background: "color-mix(in srgb, var(--surface) 70%, transparent)",
          border: "1px solid color-mix(in srgb, var(--line) 50%, transparent)",
          boxShadow:
            "0 6px 24px -14px color-mix(in srgb, var(--primary) 35%, transparent), inset 0 1px 0 0 color-mix(in srgb, #fff 8%, transparent)",
        }}
      >
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ x: -2 }}
          onClick={() => setView("home")}
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold cursor-pointer"
          style={{
            color: "var(--text)",
            background: "color-mix(in srgb, var(--surface2) 60%, transparent)",
          }}
        >
          <ArrowLeft size={15} /> Home
        </motion.button>
        <p className="font-display text-sm text-[var(--text)] truncate px-2">
          Asma-ul-Husna
        </p>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setOverview(true)}
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 cursor-pointer"
          style={{ background: "color-mix(in srgb, var(--gold) 14%, transparent)" }}
          aria-label="View all names"
        >
          <LayoutGrid size={13} style={{ color: "var(--gold)" }} />
          <span className="text-[10px] font-bold" style={{ color: "var(--gold)" }}>
            {idx + 1}/99
          </span>
        </motion.button>
      </motion.header>

      <motion.div
        {...bindSwipe()}
        style={{ x: dragX, touchAction: "pan-y", overscrollBehaviorX: "contain" }}
        className="flex-1 flex flex-col min-h-0 select-none cursor-grab active:cursor-grabbing"
      >
        <div className="flex-1 flex flex-col min-h-0 py-6 space-y-5">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeName.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex-1 flex flex-col min-h-0 space-y-5"
            >
              {/* Calligraphy Card - with rotation animation linked to drag offset */}
              <div className="px-2 overflow-visible relative">
                <motion.div
                  style={{ rotate: cardRotate }}
                  className="w-full text-center space-y-4 py-2"
                >
                  <div
                    className="mx-auto max-w-[280px] rounded-3xl py-7 px-4 text-center border"
                    style={{
                      borderColor: "color-mix(in srgb, var(--line) 40%, transparent)",
                      background: "color-mix(in srgb, var(--surface) 40%, transparent)",
                      boxShadow: "0 8px 32px -16px color-mix(in srgb, var(--primary) 20%, transparent)"
                    }}
                  >
                    <p className="font-arabic text-[3.2rem] leading-normal text-[var(--text)] font-medium" dir="rtl">
                      {activeName.arabic}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--gold)] tracking-wide uppercase">
                      {activeName.tr}
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-1 font-medium px-6 leading-relaxed">
                      {settings.lang === "ur" ? activeName.ur || activeName.en : activeName.en}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Tab Selector */}
              {(hasVirtues || hasStory) && (
                <div
                  className="flex gap-1 rounded-full p-1 border mx-2 shrink-0"
                  style={{
                    borderColor: "color-mix(in srgb, var(--line) 40%, transparent)",
                    background: "color-mix(in srgb, var(--surface2) 50%, transparent)"
                  }}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveTab("meaning"); }}
                    className="flex-1 rounded-full py-1.5 text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                    style={
                      activeTab === "meaning"
                        ? { background: "var(--primary)", color: "#fff" }
                        : { color: "var(--muted)" }
                    }
                  >
                    <BookText size={12} /> Meaning
                  </button>
                  {hasVirtues && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveTab("virtues"); }}
                      className="flex-1 rounded-full py-1.5 text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                      style={
                        activeTab === "virtues"
                          ? { background: "var(--primary)", color: "#fff" }
                          : { color: "var(--muted)" }
                      }
                    >
                      <Sparkles size={12} /> Virtues
                    </button>
                  )}
                  {hasStory && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveTab("story"); }}
                      className="flex-1 rounded-full py-1.5 text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                      style={
                        activeTab === "story"
                          ? { background: "var(--primary)", color: "#fff" }
                          : { color: "var(--muted)" }
                      }
                    >
                      <Quote size={12} /> Narrative
                    </button>
                  )}
                </div>
              )}

              {/* Tab Content Display */}
              <div className="flex-1 px-2 overflow-y-auto no-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeName.id + "_" + activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {activeTab === "meaning" && (
                      <div className="space-y-4">
                        {/* English Translation */}
                        {(settings.lang === "en" || settings.lang === "both") && activeName.en && (
                          <div className="rounded-3xl p-5 border" style={{
                            borderColor: "color-mix(in srgb, var(--line) 40%, transparent)",
                            background: "color-mix(in srgb, var(--surface) 20%, transparent)"
                          }}>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)] mb-2">
                              English Translation
                            </p>
                            <p className="text-sm text-[var(--text)] leading-relaxed">{activeName.en}</p>
                          </div>
                        )}

                        {/* Urdu Translation */}
                        {(settings.lang === "ur" || settings.lang === "both") && activeName.ur && (
                          <div className="rounded-3xl p-5 border" style={{
                            borderColor: "color-mix(in srgb, var(--line) 40%, transparent)",
                            background: "color-mix(in srgb, var(--surface) 20%, transparent)"
                          }}>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)] mb-2">
                              Urdu Translation
                            </p>
                            <p className="font-urdu text-lg text-[var(--text)] leading-loose text-right" dir="rtl">{activeName.ur}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "virtues" && (
                      <div className="space-y-4">
                        {activeName.hadith && (
                          <div
                            className="rounded-3xl p-5 border"
                            style={{
                              borderColor: "color-mix(in srgb, var(--line) 40%, transparent)",
                              background: "color-mix(in srgb, var(--surface) 20%, transparent)",
                            }}
                          >
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)] mb-3 flex items-center gap-1.5">
                              <Quote size={12} className="text-[var(--gold)]" /> Hadith & Reference
                            </p>
                            <p className="text-xs text-[var(--text)] italic leading-relaxed">
                              "{activeName.hadith}"
                            </p>
                          </div>
                        )}

                        {activeName.benefits && (
                          <div
                            className="rounded-3xl p-5 border"
                            style={{
                              borderColor: "color-mix(in srgb, var(--line) 40%, transparent)",
                              background: "color-mix(in srgb, var(--surface) 20%, transparent)",
                            }}
                          >
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)] mb-3 flex items-center gap-1.5">
                              <Sparkles size={12} className="text-[var(--gold)]" /> Spiritual virtues
                            </p>
                            <p className="text-xs text-[var(--muted)] leading-relaxed">
                              {activeName.benefits}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "story" && activeName.story && (
                      <div
                        className="rounded-3xl p-5 border"
                        style={{
                          borderColor: "color-mix(in srgb, var(--line) 40%, transparent)",
                          background: "color-mix(in srgb, var(--surface) 20%, transparent)",
                        }}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)] mb-3 flex items-center gap-1.5">
                          <BookOpen size={12} className="text-[var(--gold)]" /> Prophetic Narrative
                        </p>
                        <p className="text-xs text-[var(--muted)] leading-relaxed">
                          {activeName.story}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mb-2 text-center text-[10px] text-[var(--muted)] px-6"
      >
        Swipe/Drag left or right to change name
      </motion.p>

      {/* Floating Control Bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 26, delay: 0.1 }}
        className="mx-auto mb-2 flex items-center gap-4 rounded-full p-1.5 backdrop-blur-2xl px-6 z-10"
        style={{
          background: "color-mix(in srgb, var(--surface) 70%, transparent)",
          border: "1px solid color-mix(in srgb, var(--line) 50%, transparent)",
          boxShadow:
            "0 6px 24px -14px color-mix(in srgb, var(--primary) 30%, transparent), inset 0 1px 0 0 color-mix(in srgb, #fff 8%, transparent)",
        }}
      >
        <button
          onClick={() => handleNavigate(-1)}
          disabled={idx === 0}
          className="flex items-center justify-center rounded-full px-4 py-2.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800/20 active:scale-95 transition-all text-[var(--text)]"
        >
          <ChevronLeft size={20} /> <span className="text-xs font-bold ml-1">Previous</span>
        </button>
        <div className="h-6 w-px" style={{ background: "color-mix(in srgb, var(--line) 60%, transparent)" }} />
        <button
          onClick={() => handleNavigate(1)}
          disabled={idx === 98}
          className="flex items-center justify-center rounded-full px-4 py-2.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800/20 active:scale-95 transition-all text-[var(--text)]"
        >
          <span className="text-xs font-bold mr-1">Next</span> <ChevronRight size={20} />
        </button>
      </motion.div>

      {/* Overview grid — jump to any of the 99 names */}
      <AnimatePresence>
        {overview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 z-30 flex flex-col rounded-3xl"
            style={{
              background: "color-mix(in srgb, var(--bg) 94%, transparent)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <div className="flex items-center justify-between px-2 py-2.5">
              <p className="font-display text-base text-[var(--text)] pl-1">All 99 Names</p>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setOverview(false)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full cursor-pointer"
                style={{
                  background: "color-mix(in srgb, var(--surface2) 70%, transparent)",
                  color: "var(--text)",
                }}
              >
                <X size={18} />
              </motion.button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
              <div className="grid grid-cols-3 gap-2">
                {SEED_NAMES_OF_ALLAH.map((n, i) => {
                  const active = i === idx;
                  return (
                    <motion.button
                      key={n.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => jumpTo(i)}
                      className="flex flex-col items-center justify-center gap-1 rounded-2xl border p-2.5 cursor-pointer"
                      style={
                        active
                          ? {
                              borderColor: "var(--primary)",
                              background: "color-mix(in srgb, var(--primary) 14%, transparent)",
                            }
                          : {
                              borderColor: "color-mix(in srgb, var(--line) 50%, transparent)",
                              background: "color-mix(in srgb, var(--surface) 40%, transparent)",
                            }
                      }
                    >
                      <span
                        className="text-[9px] font-bold leading-none"
                        style={{ color: active ? "var(--primary)" : "var(--muted)" }}
                      >
                        {i + 1}
                      </span>
                      <span
                        className="font-arabic text-lg leading-tight text-[var(--text)]"
                        dir="rtl"
                      >
                        {n.arabic}
                      </span>
                      <span className="w-full truncate text-center text-[8px] font-semibold leading-tight text-[var(--muted)]">
                        {n.tr}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NamesView;
