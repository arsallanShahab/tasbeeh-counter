import { useLayoutEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { DEFAULT_DHIKR_FIELD_ORDER, DEFAULT_DHIKR_FIELD_VISIBLE } from "../../constants/dhikrData";

const rem = (base, scale) => ({ fontSize: `${base * scale}rem` });

const FIELD_RENDERERS = {
  arabic: (d, { size, arabicScale }) => (
    <p dir="rtl" lang="ar" className="font-arabic leading-[1.85] text-ink" style={rem(size === "lg" ? 2.5 : 2, arabicScale)}>
      {d.arabic}
    </p>
  ),
  translit: (d, { textScale }) => (
    <p className="font-display leading-snug italic text-ink" style={rem(1.25, textScale)}>
      {d.tr}
    </p>
  ),
  translation: (d, { lang, textScale }) => (
    <div className="space-y-1.5">
      {(lang === "en" || lang === "both") && d.en && (
        <p className="mx-auto max-w-[44ch] leading-relaxed text-muted" style={rem(0.9375, textScale)}>
          {d.en}
        </p>
      )}
      {(lang === "ur" || lang === "both") && d.ur && (
        <p dir="rtl" lang="ur" className="font-urdu leading-loose text-muted" style={rem(1.125, textScale)}>
          {d.ur}
        </p>
      )}
    </div>
  ),
};

const COLLAPSED_MAX = 220;

/* The dhikr being recited, centred above the counter in the user's chosen
   field order. Long du'as are clipped with a fade and "Continue reading"; the
   whole block opens the reader when `onOpenReader` is given. */
export const TransBlock = ({
  d,
  lang = "both",
  fieldOrder = DEFAULT_DHIKR_FIELD_ORDER,
  fieldVisible = DEFAULT_DHIKR_FIELD_VISIBLE,
  collapsedMax = COLLAPSED_MAX,
  size = "md",
  arabicScale = 1,
  textScale = 1,
  fade = "to-page", // the surface it sits on, so the fade blends in
  onOpenReader,
}) => {
  const [overflowing, setOverflowing] = useState(false);
  const innerRef = useRef(null);

  useLayoutEffect(() => {
    if (!innerRef.current) return;
    const measure = () => setOverflowing((innerRef.current?.scrollHeight ?? 0) > collapsedMax + 4);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [d?.id, lang, fieldOrder, fieldVisible, collapsedMax, arabicScale, textScale]);

  if (!d) return null;

  const visibleFields = fieldOrder.filter((k) => FIELD_RENDERERS[k] && fieldVisible[k] !== false);
  const interactive = typeof onOpenReader === "function";
  const Tag = interactive ? "button" : "div";

  return (
    <Tag
      {...(interactive ? { type: "button", onClick: onOpenReader, "aria-label": `Read ${d.tr} in full` } : {})}
      className={`relative block w-full rounded-2xl text-center ${interactive ? "cursor-pointer" : ""}`}
    >
      <span className="relative block overflow-hidden" style={{ maxHeight: collapsedMax }}>
        <span ref={innerRef} className="flex flex-col items-stretch gap-3 px-1">
          {visibleFields.map((key) => (
            <span key={`${d.id}-${key}`} className="block">
              {FIELD_RENDERERS[key](d, { lang, size, arabicScale, textScale })}
            </span>
          ))}
        </span>
        {overflowing && (
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent ${fade}`}
          />
        )}
      </span>
      {overflowing && interactive && (
        <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-accent">
          Continue reading <ChevronDown size={15} aria-hidden="true" />
        </span>
      )}
    </Tag>
  );
};

export default TransBlock;
