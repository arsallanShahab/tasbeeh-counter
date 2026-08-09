import React, { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BookOpen } from "lucide-react";
import {
  DEFAULT_DHIKR_FIELD_ORDER,
  DEFAULT_DHIKR_FIELD_VISIBLE,
} from "../../constants/dhikrData";

const FIELD_RENDERERS = {
  arabic: (d) => (
    <p
      className="font-arabic text-3xl leading-relaxed text-[var(--text)] text-right"
      dir="rtl"
    >
      {d.arabic}
    </p>
  ),
  translit: (d) => (
    <p className="text-base font-medium text-[var(--gold)] leading-snug text-left">
      {d.tr}
    </p>
  ),
  translation: (d, { lang }) => (
    <div className="space-y-1">
      {(lang === "en" || lang === "both") && d.en && (
        <p className="text-sm text-[var(--muted)] leading-snug text-left">{d.en}</p>
      )}
      {(lang === "ur" || lang === "both") && d.ur && (
        <p
          className="font-urdu text-base text-[var(--muted)] leading-snug text-right"
          dir="rtl"
        >
          {d.ur}
        </p>
      )}
    </div>
  ),
};

const COLLAPSED_MAX = 200; // px — mobile default; desktop panes pass more room

export const TransBlock = ({
  d,
  lang = "both",
  fieldOrder = DEFAULT_DHIKR_FIELD_ORDER,
  fieldVisible = DEFAULT_DHIKR_FIELD_VISIBLE,
  collapsedMax = COLLAPSED_MAX,
  onOpenReader,
}) => {
  const [overflowing, setOverflowing] = useState(false);
  const innerRef = useRef(null);

  useLayoutEffect(() => {
    if (!innerRef.current) return;
    const measure = () => {
      const h = innerRef.current?.scrollHeight ?? 0;
      setOverflowing(h > collapsedMax + 4);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [d?.id, lang, fieldOrder, fieldVisible, collapsedMax]);

  if (!d) return null;

  const visibleFields = fieldOrder.filter(
    (k) => FIELD_RENDERERS[k] && fieldVisible[k] !== false
  );

  const interactive = typeof onOpenReader === "function";
  const Tag = interactive ? motion.button : motion.div;
  const interactiveProps = interactive
    ? {
        type: "button",
        onClick: onOpenReader,
        whileTap: { scale: 0.985 },
        transition: { type: "spring", stiffness: 500, damping: 28 },
        "aria-label": "Open dhikr reader",
      }
    : {};

  return (
    <Tag
      {...interactiveProps}
      className={`relative flex w-full flex-col items-stretch select-none rounded-3xl px-3 pt-3 pb-2 text-left ${interactive ? "cursor-pointer" : ""}`}
      style={{ background: "transparent" }}
    >
      {/* Text area — fade is anchored to this so it sits over the bottom of visible text */}
      <div
        className="relative w-full overflow-hidden"
        style={{ maxHeight: collapsedMax }}
      >
        <motion.div
          ref={innerRef}
          layout
          className="flex flex-col items-stretch gap-2 px-1"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {visibleFields.map((key) => (
              <motion.div
                key={`${d.id}-${key}`}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="w-full"
              >
                {FIELD_RENDERERS[key](d, { lang })}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Soft bottom fade — only when text is clipped */}
        <AnimatePresence>
          {overflowing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--bg) 70%, transparent) 55%, var(--bg) 100%)",
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* "Tap to read" indicator — hidden when the block isn't interactive */}
      {interactive && (
      <motion.div
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        className="pointer-events-none mt-3 flex self-center items-center gap-1.5 rounded-full px-3 py-1"
        style={{
          background: "color-mix(in srgb, var(--surface) 90%, transparent)",
          border: "1px solid color-mix(in srgb, var(--gold) 30%, transparent)",
          color: "var(--gold)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <motion.span
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center"
        >
          <BookOpen size={11} />
        </motion.span>
        <span className="text-[10px] font-bold uppercase tracking-wider">
          Tap to read
        </span>
      </motion.div>
      )}
    </Tag>
  );
};

export default TransBlock;
