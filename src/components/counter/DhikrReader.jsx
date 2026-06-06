import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, BookOpen, Quote, Sparkles, BookText } from "lucide-react";

export const DhikrReader = ({ open, onClose, d, lang = "both" }) => {
  const [activeTab, setActiveTab] = useState("translation");

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

  // Reset tab to translation when active item changes
  useEffect(() => {
    setActiveTab("translation");
  }, [d?.id]);

  const hasVirtues = !!(d?.hadith || d?.benefits);
  const hasStory = !!d?.story;
  const showTabs = hasVirtues || hasStory;

  return (
    <AnimatePresence>
      {open && d && (
        <motion.div
          className="fixed inset-0 z-50 flex items-stretch justify-center"
          data-tap-skip="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
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
            initial={{ y: 28, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 28, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
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

            {/* Tab Swapper */}
            {showTabs && (
              <div
                className="mt-4 flex gap-1 rounded-full p-1 border"
                style={{
                  borderColor: "color-mix(in srgb, var(--line) 40%, transparent)",
                  background: "color-mix(in srgb, var(--surface2) 50%, transparent)"
                }}
              >
                <button
                  onClick={() => setActiveTab("translation")}
                  className="flex-1 rounded-full py-1.5 text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                  style={
                    activeTab === "translation"
                      ? { background: "var(--primary)", color: "#fff" }
                      : { color: "var(--muted)" }
                  }
                >
                  <BookText size={12} /> Translation
                </button>
                {hasVirtues && (
                  <button
                    onClick={() => setActiveTab("virtues")}
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
                    onClick={() => setActiveTab("story")}
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

            {/* Scrollable content */}
            <div className="mt-6 flex-1 overflow-y-auto no-scrollbar">
              <div className="flex flex-col gap-6 pb-10">
                <AnimatePresence mode="wait">
                  {activeTab === "translation" && (
                    <motion.div
                      key="translation-tab"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Arabic — hero */}
                      <div
                        className="rounded-3xl px-5 py-7 text-right"
                        style={{
                          background: "color-mix(in srgb, var(--surface) 50%, transparent)",
                          border: "1px solid color-mix(in srgb, var(--line) 50%, transparent)",
                        }}
                      >
                        <p
                          className="font-arabic text-[2.2rem] leading-[1.9] text-[var(--text)]"
                          dir="rtl"
                          style={{ fontWeight: 500 }}
                        >
                          {d.arabic}
                        </p>
                      </div>

                      {/* Transliteration */}
                      {d.tr && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)] mb-2 pl-1">
                            Transliteration
                          </p>
                          <p className="text-lg font-medium text-[var(--text)] leading-relaxed">
                            {d.tr}
                          </p>
                        </div>
                      )}

                      {/* Translation (English) */}
                      {(lang === "en" || lang === "both") && d.en && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)] mb-2 pl-1">
                            English
                          </p>
                          <p className="text-base text-[var(--muted)] leading-relaxed">{d.en}</p>
                        </div>
                      )}

                      {/* Translation (Urdu) */}
                      {(lang === "ur" || lang === "both") && d.ur && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)] mb-2 pl-1">
                            Urdu
                          </p>
                          <p
                            className="font-urdu text-lg text-[var(--muted)] leading-loose"
                            dir="rtl"
                          >
                            {d.ur}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "virtues" && (
                    <motion.div
                      key="virtues-tab"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {d.hadith && (
                        <div
                          className="rounded-3xl p-5 border"
                          style={{
                            borderColor: "color-mix(in srgb, var(--line) 50%, transparent)",
                            background: "color-mix(in srgb, var(--surface) 40%, transparent)",
                          }}
                        >
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)] mb-3 flex items-center gap-1.5">
                            <Quote size={12} className="text-[var(--gold)]" /> Hadith & Reference
                          </p>
                          <p className="text-sm text-[var(--text)] italic leading-relaxed">
                            "{d.hadith}"
                          </p>
                        </div>
                      )}

                      {d.benefits && (
                        <div
                          className="rounded-3xl p-5 border"
                          style={{
                            borderColor: "color-mix(in srgb, var(--line) 50%, transparent)",
                            background: "color-mix(in srgb, var(--surface) 40%, transparent)",
                          }}
                        >
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)] mb-3 flex items-center gap-1.5">
                            <Sparkles size={12} className="text-[var(--gold)]" /> Spiritual virtues
                          </p>
                          <p className="text-sm text-[var(--muted)] leading-relaxed">
                            {d.benefits}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "story" && d.story && (
                    <motion.div
                      key="story-tab"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-3xl p-5 border"
                      style={{
                        borderColor: "color-mix(in srgb, var(--line) 50%, transparent)",
                        background: "color-mix(in srgb, var(--surface) 40%, transparent)",
                      }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)] mb-3 flex items-center gap-1.5">
                        <BookOpen size={12} className="text-[var(--gold)]" /> Prophetic Narrative
                      </p>
                      <p className="text-sm text-[var(--muted)] leading-relaxed">
                        {d.story}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

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
