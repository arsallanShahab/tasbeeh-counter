import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useIsDesktop } from "../../hooks/useMediaQuery";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* Sheet: a bottom sheet on phones, a centred dialog on desktop. Traps focus,
   closes on Escape and on the scrim, and hands focus back to whatever opened
   it. `footer` stays pinned below the scrolling body. */
export const Sheet = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  hideTitle = false,
  initialFocus,
}) => {
  const isDesktop = useIsDesktop();
  const panelRef = useRef(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFirst = () => {
      const root = panelRef.current;
      if (!root) return;
      const target = (initialFocus && root.querySelector(initialFocus)) || root.querySelector(FOCUSABLE);
      (target || root).focus({ preventScroll: true });
    };
    const t = setTimeout(focusFirst, 30);

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey, true);

    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
      if (opener && typeof opener.focus === "function") opener.focus({ preventScroll: true });
    };
  }, [open, onClose, initialFocus]);

  const width = size === "lg" ? "lg:max-w-2xl" : size === "sm" ? "lg:max-w-sm" : "lg:max-w-lg";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          data-tap-skip="true"
        >
          <div
            className="absolute inset-0 bg-[color-mix(in_srgb,var(--text)_38%,transparent)]"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            className={`relative flex max-h-[92svh] w-full flex-col rounded-t-3xl border border-line bg-surface shadow-[var(--shadow-float)] outline-none lg:max-h-[86svh] lg:rounded-2xl ${width}`}
            initial={isDesktop ? { opacity: 0, y: 12, scale: 0.98 } : { y: "100%" }}
            animate={isDesktop ? { opacity: 1, y: 0, scale: 1 } : { y: 0 }}
            exit={isDesktop ? { opacity: 0, y: 8, scale: 0.98 } : { y: "100%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {!isDesktop && (
              <span className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-line" aria-hidden="true" />
            )}
            <div className={`flex shrink-0 items-start justify-between gap-4 px-6 pt-4 lg:pt-6 ${hideTitle ? "pb-0" : "pb-4"}`}>
              <div className={`min-w-0 ${hideTitle ? "sr-only" : ""}`}>
                <h2 id={titleId} className="font-display text-2xl leading-tight font-medium text-ink">
                  {title}
                </h2>
                {description && (
                  <p id={descId} className="mt-1 text-[0.9375rem] leading-relaxed text-muted">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="icon-btn -mr-2 -mt-1 h-10 w-10 text-muted"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6">{children}</div>
            {footer && (
              <div className="shrink-0 border-t border-line px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* Kept for the existing import sites: the old centred Modal is now a Sheet. */
export const Modal = ({ isOpen, onClose, children, title = "Dialog", ...rest }) => (
  <Sheet open={isOpen} onClose={onClose} title={title} {...rest}>
    {children}
  </Sheet>
);

export default Sheet;
