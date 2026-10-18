import { useRef } from "react";

/* Segmented control with radio-group semantics: arrow keys move the
   selection, and only the selected option sits in the tab order. */
export const Seg = ({ options, value, onChange, label, size = "md", className = "" }) => {
  const refs = useRef([]);
  const idx = Math.max(0, options.findIndex((o) => o.v === value));

  const onKeyDown = (e) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (idx + dir + options.length) % options.length;
    onChange(options[next].v);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={`flex rounded-xl bg-sunken p-1 ${className}`}
    >
      {options.map((o, i) => {
        const on = o.v === value;
        return (
          <button
            key={o.v}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.v)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 font-medium whitespace-nowrap transition-colors duration-150 ${
              size === "sm" ? "h-8 text-[0.8125rem]" : "h-9 text-sm"
            } ${on ? "bg-surface text-ink shadow-[var(--shadow-raise)]" : "text-muted hover:text-ink"}`}
          >
            {o.icon && <o.icon size={15} aria-hidden="true" />}
            <span dir={o.dir}>{o.l}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Seg;
