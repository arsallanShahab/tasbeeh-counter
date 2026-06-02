import React, { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, BookOpen } from "lucide-react";

export const DhikrReader = ({ open, onClose, d, lang = "both" }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && d && (
        <motion.div
          className="fixed inset-0 z-50 flex items-stretch justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={onClose}
          style={{
            background:
              "radial-gradient(120% 80% at 50% -10%, color-mix(in srgb, var(--bg2) 92%, transparent), color-mix(in srgb, var(--bg) 96%, transparent))",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="relative mx-auto flex h-full w-full max-w-md flex-col px-5 pt-5 pb-6"
          >
            {/* Header pill */}
            <div
              className="flex items-center justify-between rounded-full px-2 py-1.5 backdrop-blur-2xl"
              style={{
                background: "color-mix(in srgb, var(--surface) 70%, transparent)",
                border: "1px solid color-mix(in srgb, var(--line) 50%, transparent)",
                boxShadow:
                  "0 6px 24px -16px color-mix(in srgb, var(--gold) 30%, transparent), inset 0 1px 0 0 color-mix(in srgb, #fff 8%, transparent)",
              }}
            >
              <div className="flex items-center gap-2 pl-2">
                <BookOpen size={15} className="text-[var(--gold)]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Reader
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full cursor-pointer"
                style={{
                  background: "color-mix(in srgb, var(--surface2) 60%, transparent)",
                  color: "var(--text)",
                }}
                aria-label="Close reader"
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Scrollable content */}
            <div className="mt-6 flex-1 overflow-y-auto no-scrollbar">
              <div className="flex flex-col gap-6 pb-10">
                {/* Arabic — hero */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-3xl px-5 py-7 text-center"
                  style={{
                    background: "color-mix(in srgb, var(--surface) 50%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--line) 50%, transparent)",
                  }}
                >
                  <p
                    className="font-arabic text-[2.4rem] leading-[1.9] text-[var(--text)]"
                    dir="rtl"
                    style={{ fontWeight: 500 }}
                  >
                    {d.arabic}
                  </p>
                </motion.div>

                {/* Transliteration */}
                {d.tr && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)] mb-2 pl-1">
                      Transliteration
                    </p>
                    <p className="text-lg font-medium text-[var(--text)] leading-relaxed">
                      {d.tr}
                    </p>
                  </motion.div>
                )}

                {/* Translation (English) */}
                {(lang === "en" || lang === "both") && d.en && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)] mb-2 pl-1">
                      English
                    </p>
                    <p className="text-base text-[var(--muted)] leading-relaxed">{d.en}</p>
                  </motion.div>
                )}

                {/* Translation (Urdu) */}
                {(lang === "ur" || lang === "both") && d.ur && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.24, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)] mb-2 pl-1">
                      Urdu
                    </p>
                    <p
                      className="font-urdu text-lg text-[var(--muted)] leading-loose"
                      dir="rtl"
                    >
                      {d.ur}
                    </p>
                  </motion.div>
                )}

                {/* Footer hint */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  className="text-center text-[11px] text-[var(--muted)] mt-4"
                >
                  Tap anywhere outside to close
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DhikrReader;
