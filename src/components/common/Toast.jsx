import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

const ToastContext = createContext(() => {});

/* One toast at a time, bottom-centre, above the tab bar. A toast may carry a
   single action, which is how deletions offer Undo instead of a blocking
   "Are you sure?". */
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const dismiss = useCallback(() => {
    clearTimeout(timer.current);
    setToast(null);
  }, []);

  const show = useCallback((message, opts = {}) => {
    clearTimeout(timer.current);
    const id = Date.now();
    setToast({ id, message, action: opts.action });
    timer.current = setTimeout(() => setToast((t) => (t?.id === id ? null : t)), opts.duration ?? (opts.action ? 5000 : 2400));
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[60] flex justify-center px-4 lg:bottom-8"
        role="status"
        aria-live="polite"
      >
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto flex max-w-[min(28rem,calc(100vw-2rem))] items-center gap-3 rounded-xl bg-ink py-2 pl-4 pr-2 text-[0.9375rem] text-page shadow-[var(--shadow-float)]"
            >
              <span className="min-w-0 flex-1 py-1.5 [overflow-wrap:anywhere]">{toast.message}</span>
              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action.onClick();
                    dismiss();
                  }}
                  className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold text-page underline-offset-4 hover:underline"
                >
                  {toast.action.label}
                </button>
              )}
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-page opacity-80 hover:opacity-100"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

export default ToastProvider;
