import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Flame } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { computeStreak, dateKey, fmt } from "../../utils/stats";
import BrandMark from "../common/BrandMark";

const VIEW_LABEL = {
  home: "Home",
  library: "Library",
  stats: "Statistics",
  settings: "Settings",
};

export const AppHeader = () => {
  const { view, stats } = useApp();

  if (view === "counter" || view === "names") return null;

  const today = stats.byDate[dateKey()] || 0;
  const streak = computeStreak(stats.byDate);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      className="fixed top-3 left-1/2 z-30 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-full backdrop-blur-2xl"
      style={{
        background: "color-mix(in srgb, var(--surface) 70%, transparent)",
        border: "1px solid color-mix(in srgb, var(--line) 50%, transparent)",
        boxShadow:
          "0 6px 24px -14px color-mix(in srgb, var(--gold) 35%, transparent), inset 0 1px 0 0 color-mix(in srgb, #fff 8%, transparent)",
      }}
    >
      <div className="flex items-center justify-between px-3.5 py-1.5">
        {/* Brand */}
        <div className="flex flex-col leading-tight pl-0.5">
          <BrandMark className="text-lg" />
          <AnimatePresence mode="wait">
            <motion.span
              key={view}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-[10px] uppercase tracking-wider text-[var(--muted)]"
            >
              {VIEW_LABEL[view] || ""}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Status pills */}
        <div className="flex items-center gap-1.5 pr-1">
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-1 rounded-full px-2.5 py-1"
            style={{
              background: "color-mix(in srgb, var(--gold) 14%, transparent)",
              border: "1px solid color-mix(in srgb, var(--gold) 28%, transparent)",
            }}
          >
            <Flame size={12} className="text-[var(--gold)]" />
            <span className="text-[11px] font-bold text-[var(--gold)]">{streak}</span>
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              key={today}
              initial={{ opacity: 0, scale: 0.85, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -4 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
              className="rounded-full px-2.5 py-1"
              style={{
                background: "color-mix(in srgb, var(--primary) 14%, transparent)",
                border: "1px solid color-mix(in srgb, var(--primary) 28%, transparent)",
              }}
            >
              <span className="text-[11px] font-bold" style={{ color: "var(--primary)" }}>
                {fmt(today)}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default AppHeader;
