import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "motion/react";
import { Navigate } from "react-router-dom";
import {
  ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Sparkles, Quote, BookText
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
    vibe,
  } = useApp();

  const [activeTab, setActiveTab] = useState("meaning");
  const [direction, setDirection] = useState(0); // -1 for previous, 1 for next

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

  // Manual swipe handling (pointer events + axis lock). This replaces Framer's
  // `drag`, which fought with the vertically-scrollable tab content on touch
  // devices — leaving the bottom section unresponsive to gestures. With
  // touch-action: pan-y the browser keeps native vertical scrolling, while we
  // only claim horizontal moves to flip between names.
  const swipe = useRef({ x: 0, y: 0, axis: null, active: false });

  const onPointerDown = (e) => {
    swipe.current = { x: e.clientX, y: e.clientY, axis: null, active: true };
  };

  const onPointerMove = (e) => {
    const s = swipe.current;
    if (!s.active) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (!s.axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      s.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      // Capture the pointer for horizontal swipes so the browser's edge
      // back/forward gesture can't hijack a left-to-right drag mid-way.
      if (s.axis === "x") {
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
      }
    }
    if (s.axis === "x") dragX.set(dx * 0.6);
  };

  const endSwipe = (e) => {
    const s = swipe.current;
    if (!s.active) return;
    const dx = (e?.clientX ?? s.x) - s.x;
    const threshold = 55;
    if (s.axis === "x") {
      if (dx < -threshold) handleNavigate(1);
      else if (dx > threshold) handleNavigate(-1);
    }
    animate(dragX, 0, { type: "spring", stiffness: 350, damping: 35 });
    swipe.current = { x: 0, y: 0, axis: null, active: false };
  };

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
      className="flex h-[calc(100svh-2.5rem)] flex-col justify-between"
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
        <div className="flex h-7 w-7 items-center justify-center rounded-full"
          style={{ background: "color-mix(in srgb, var(--gold) 14%, transparent)" }}
        >
          <span className="text-[10px] font-bold" style={{ color: "var(--gold)" }}>
            {idx + 1}/99
          </span>
        </div>
      </motion.header>

      <motion.div
        style={{ x: dragX, touchAction: "pan-y", overscrollBehaviorX: "contain" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endSwipe}
        onPointerCancel={endSwipe}
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
    </div>
  );
};

export default NamesView;
