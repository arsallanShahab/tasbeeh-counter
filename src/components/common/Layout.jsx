import { ChevronRight } from "lucide-react";

const cx = (...parts) => parts.filter(Boolean).join(" ");

/* A raised paper surface with a hairline edge. Most content sits directly on
   the page; reach for a Panel only when a group needs its own edge. */
export const Panel = ({ as: Tag = "div", className = "", children, ...props }) => (
  <Tag className={cx("rounded-2xl border border-line bg-surface", className)} {...props}>
    {children}
  </Tag>
);

/* Page title block. The title is display type at 2.5x the body size so the
   page has an obvious first place for the eye. */
export const PageHeader = ({ eyebrow, title, description, actions, className = "" }) => (
  <header className={cx("flex items-end justify-between gap-4", className)}>
    <div className="min-w-0">
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h1 className="font-display text-[2.5rem] leading-[1.05] font-medium tracking-[-0.01em] text-ink lg:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-[60ch] text-[0.9375rem] leading-relaxed text-muted">{description}</p>
      )}
    </div>
    {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
  </header>
);

export const SectionHeader = ({ title, count, action, id, className = "" }) => (
  <div className={cx("flex items-baseline justify-between gap-3", className)}>
    <h2 id={id} className="font-display text-[1.375rem] leading-tight font-medium text-ink">
      {title}
      {count != null && (
        <span className="numerals ml-2 align-middle font-body text-sm font-medium text-muted">{count}</span>
      )}
    </h2>
    {action}
  </div>
);

/* Hairline-separated list. Rows share one edge instead of each wearing its own
   card, which keeps long lists calm. */
export const ListGroup = ({ className = "", children, as: Tag = "div", ...props }) => (
  <Tag
    className={cx(
      "overflow-hidden rounded-2xl border border-line bg-surface divide-y divide-line",
      className
    )}
    {...props}
  >
    {children}
  </Tag>
);

/* One row. Pass `onClick` to make the main area a button; `trailing` holds
   secondary controls that must not trigger the row itself. */
export const ListRow = ({
  leading,
  title,
  subtitle,
  meta,
  trailing,
  onClick,
  chevron = false,
  className = "",
  titleClassName = "",
  ariaLabel,
  children,
}) => {
  const body = (
    <>
      {leading && <span className="flex shrink-0 items-center">{leading}</span>}
      <span className="min-w-0 flex-1 text-left">
        <span className={cx("line-clamp-2 block text-[0.9375rem] leading-snug font-medium text-ink [overflow-wrap:anywhere]", titleClassName)}>
          {title}
        </span>
        {subtitle && <span className="mt-0.5 block truncate text-sm text-muted">{subtitle}</span>}
        {children}
      </span>
      {meta && <span className="numerals shrink-0 text-sm text-muted">{meta}</span>}
      {chevron && <ChevronRight size={18} className="shrink-0 text-muted" aria-hidden="true" />}
    </>
  );

  return (
    <div className={cx("flex items-center gap-1", className)}>
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          aria-label={ariaLabel}
          className="row-interactive flex min-h-[3.75rem] min-w-0 flex-1 items-center gap-3.5 px-4 py-3"
        >
          {body}
        </button>
      ) : (
        <div className="flex min-h-[3.75rem] min-w-0 flex-1 items-center gap-3.5 px-4 py-3">{body}</div>
      )}
      {trailing && <div className="flex shrink-0 items-center gap-0.5 pr-2">{trailing}</div>}
    </div>
  );
};

/* Square tile holding an icon, used as a row's leading element. */
export const IconTile = ({ icon: Icon, tone = "neutral", size = 40 }) => (
  <span
    className={cx(
      "flex items-center justify-center rounded-xl",
      tone === "accent" ? "bg-accent-soft text-accent" : "bg-sunken text-ink"
    )}
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    <Icon size={Math.round(size * 0.48)} strokeWidth={1.75} />
  </span>
);

/* Arabic initial as a row's leading element for single dhikrs. */
export const GlyphTile = ({ char, size = 40 }) => (
  <span
    className="flex items-center justify-center rounded-xl bg-sunken font-arabic text-xl leading-none text-ink"
    style={{ width: size, height: size }}
    aria-hidden="true"
    dir="rtl"
  >
    {char}
  </span>
);

export const EmptyState = ({ icon: Icon, title, body, action, className = "" }) => (
  <div
    className={cx(
      "flex flex-col items-center rounded-2xl border border-dashed border-line px-6 py-12 text-center",
      className
    )}
  >
    {Icon && (
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-line text-muted">
        <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
      </span>
    )}
    <p className="font-display text-xl text-ink">{title}</p>
    {body && <p className="mt-1.5 max-w-[34ch] text-[0.9375rem] leading-relaxed text-muted">{body}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export const ProgressBar = ({ value, max = 100, label, className = "", tone = "accent" }) => {
  const pct = Math.max(0, Math.min(100, max > 0 ? (value / max) * 100 : 0));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.min(value, max)}
      className={cx("h-1.5 w-full overflow-hidden rounded-full bg-sunken", className)}
    >
      <div
        className={cx(
          "h-full rounded-full transition-[width] duration-500 ease-out",
          tone === "gold" ? "bg-gold" : "bg-accent"
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default Panel;
