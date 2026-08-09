import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles, X } from "lucide-react";
import { useApp } from "../../context/AppContext";

const UpdateBanner = () => {
  const { updateAvailable, applyUpdate } = useApp();
  const [dismissed, setDismissed] = useState(false);
  const visible = updateAvailable && !dismissed;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed top-3 left-1/2 z-50 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-md lg:left-auto lg:right-6 lg:bottom-6 lg:top-auto lg:w-[24rem] lg:translate-x-0"
          role="status"
          aria-live="polite"
        >
          <div
            className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 shadow-lg backdrop-blur"
            style={{
              background: "color-mix(in srgb, var(--surface) 92%, transparent)",
              border: "1px solid color-mix(in srgb, var(--gold) 45%, var(--line))",
            }}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{
                background: "color-mix(in srgb, var(--gold) 18%, transparent)",
                color: "var(--gold)",
              }}
            >
              <Sparkles size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[var(--text)] leading-tight">
                A new version is available
              </p>
              <p className="text-[10px] text-[var(--muted)] mt-0.5 leading-tight">
                Reload to get the latest dhikrs & fixes.
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={applyUpdate}
              className="rounded-full px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
              style={{ background: "var(--gold)" }}
            >
              Reload
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setDismissed(true)}
              className="flex h-7 w-7 items-center justify-center rounded-full cursor-pointer text-[var(--muted)]"
              aria-label="Dismiss"
            >
              <X size={14} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateBanner;
