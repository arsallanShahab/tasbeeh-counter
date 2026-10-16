import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion, useDragControls } from "motion/react";
import { X } from "lucide-react";
import { useIsDesktop } from "../../hooks/useMediaQuery";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* Motion. Phones get the iOS sheet curve: a quick start that settles slowly,
   and a shorter, accelerating exit. Desktop dialogs lift in slightly. */
const SHEET_IN = { duration: 0.44, ease: [0.32, 0.72, 0, 1] };
const SHEET_OUT = { duration: 0.26, ease: [0.4, 0, 1, 1] };
const DIALOG_IN = { duration: 0.24, ease: [0.22, 1, 0.36, 1] };
const DIALOG_OUT = { duration: 0.16, ease: [0.4, 0, 1, 1] };

// Open sheets, oldest first: only the top one answers Escape and traps Tab.
const openSheets = [];

/* Back gesture support. Each open sheet pushes one history entry tagged with
   its depth, so the system back gesture, the Android back button and the
   browser's Back all close the top sheet instead of leaving the page. Closing
   a sheet any other way pops its entry again, so history stays clean. */
// A sheet that closes by a button pops its entry with history.back(), which
// lands a moment later. A sheet opened in that moment waits for it, or the pop
// would close the new sheet instead.
let pendingBack = null;

function useBackToClose(open, onClose) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open || typeof window === "undefined") return;
    let depth = 0;
    let poppedAway = false;
    let started = false;
    let cancelled = false;

    const onPop = () => {
      if ((window.history.state?.sheetDepth || 0) < depth) {
        poppedAway = true;
        onCloseRef.current?.();
      }
    };
    const start = () => {
      if (cancelled) return;
      depth = (window.history.state?.sheetDepth || 0) + 1;
      window.history.pushState({ ...window.history.state, sheetDepth: depth }, "");
      window.addEventListener("popstate", onPop);
      started = true;
    };
    if (pendingBack) pendingBack.then(start);
    else start();

    return () => {
      cancelled = true;
      if (!started) return;
      window.removeEventListener("popstate", onPop);
      // Closed by a button, the scrim, Escape or a drag: drop our entry. If a
      // navigation already replaced it, there is nothing of ours to pop.
      if (!poppedAway && window.history.state?.sheetDepth === depth) {
        const settled = new Promise((resolve) => {
          const done = () => {
            window.removeEventListener("popstate", done);
            clearTimeout(t);
            resolve();
          };
          const t = setTimeout(done, 500);
          window.addEventListener("popstate", done);
        });
        pendingBack = settled;
        settled.then(() => {
          if (pendingBack === settled) pendingBack = null;
        });
        window.history.back();
      }
    };
  }, [open]);
}

/* Sheet: a bottom sheet on phones, a centred dialog on desktop. Traps focus,
   closes on Escape, the scrim, a downward drag on its handle or header, and
   the back gesture, then hands focus back to whatever opened it. `footer`
   stays pinned below the scrolling body. */
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
  const dragControls = useDragControls();
  const titleId = useId();
  const descId = useId();

  useBackToClose(open, onClose);

  // Read through a ref: parents often pass a new inline onClose each render,
  // and re-running the focus effect would steal focus while typing.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus after the entrance has started, so the sheet doesn't jump.
    const t = setTimeout(() => {
      const root = panelRef.current;
      if (!root) return;
      const target = (initialFocus && root.querySelector(initialFocus)) || root.querySelector(FOCUSABLE);
      (target || root).focus({ preventScroll: true });
    }, 60);

    const me = {};
    openSheets.push(me);
    const onKey = (e) => {
      if (openSheets[openSheets.length - 1] !== me) return;
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        onCloseRef.current?.();
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
      openSheets.splice(openSheets.indexOf(me), 1);
      window.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
      if (opener && typeof opener.focus === "function" && document.contains(opener)) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [open, initialFocus]);

  const width = size === "lg" ? "lg:max-w-2xl" : size === "sm" ? "lg:max-w-md" : "lg:max-w-lg";
  const startDrag = (e) => {
    if (!isDesktop) dragControls.start(e);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:p-6" data-tap-skip="true">
          <motion.div
            className="absolute inset-0 bg-[color-mix(in_srgb,var(--text)_40%,transparent)]"
            onClick={onClose}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: isDesktop ? DIALOG_IN : { duration: 0.32, ease: "easeOut" } }}
            exit={{ opacity: 0, transition: isDesktop ? DIALOG_OUT : SHEET_OUT }}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            className={`relative flex max-h-[calc(100dvh-2.5rem)] w-full flex-col rounded-t-[1.75rem] border border-b-0 border-line bg-surface shadow-(--shadow-float) outline-none will-change-transform lg:max-h-[86dvh] lg:rounded-2xl lg:border-b ${width}`}
            initial={isDesktop ? { opacity: 0, y: 10, scale: 0.97 } : { y: "100%" }}
            animate={isDesktop ? { opacity: 1, y: 0, scale: 1, transition: DIALOG_IN } : { y: 0, transition: SHEET_IN }}
            exit={isDesktop ? { opacity: 0, y: 6, scale: 0.98, transition: DIALOG_OUT } : { y: "100%", transition: SHEET_OUT }}
            drag={isDesktop ? false : "y"}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose?.();
            }}
          >
            {/* Grab area: the handle and the header start a drag-to-dismiss.
                The body scrolls normally. */}
            <div onPointerDown={startDrag} className="shrink-0 touch-none select-none lg:touch-auto lg:select-auto">
              {!isDesktop && (
                <div className="flex justify-center pb-1 pt-2.5" aria-hidden="true">
                  <span className="h-1 w-10 rounded-full bg-line-strong opacity-60" />
                </div>
              )}
              <div className={`flex items-start justify-between gap-4 px-6 pt-3 lg:pt-6 ${hideTitle ? "pb-0" : "pb-4"}`}>
                <div className={`min-w-0 ${hideTitle ? "sr-only" : ""}`}>
                  <h2
                    id={titleId}
                    className={`font-display font-medium text-ink ${
                      typeof title === "string" && title.length > 48 ? "line-clamp-3 text-lg leading-snug" : "text-2xl leading-tight"
                    }`}
                  >
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
                  onPointerDown={(e) => e.stopPropagation()}
                  aria-label="Close"
                  className="icon-btn -mr-2 -mt-1 h-10 w-10 text-muted"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div
              className={`min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 ${
                footer ? "pb-6" : "pb-[max(1.5rem,env(safe-area-inset-bottom))]"
              }`}
            >
              {children}
            </div>
            {footer && (
              <div className="shrink-0 border-t border-line px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/* Kept for older import sites: the centred Modal is now a Sheet. */
export const Modal = ({ isOpen, onClose, children, title = "Dialog", ...rest }) => (
  <Sheet open={isOpen} onClose={onClose} title={title} {...rest}>
    {children}
  </Sheet>
);

export default Sheet;
