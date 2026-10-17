import { isNative } from "../../native/platform";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button } from "./Button";

/* New-version notice. Sits above the tab bar on phones and in the corner on
   desktop, out of the way of the page title. */
const UpdateBanner = () => {
  const { updateAvailable, applyUpdate, view } = useApp();
  const [dismissed, setDismissed] = useState(false);
  // Never interrupt counting, reflection or the compass.
  const visible = !isNative && updateAvailable && !dismissed && !["counter", "names", "qibla"].includes(view);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 16, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-40 mx-auto max-w-[28rem] lg:inset-x-auto lg:bottom-6 lg:right-6 lg:w-[24rem]"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface py-2.5 pl-4 pr-2 shadow-[var(--shadow-float)]">
            <div className="min-w-0 flex-1">
              <p className="text-[0.9375rem] font-medium leading-tight text-ink">A new version is ready</p>
              <p className="mt-0.5 text-[0.8125rem] leading-tight text-muted">Reload to get the latest dhikr and fixes.</p>
            </div>
            <Button size="sm" onClick={applyUpdate}>
              Reload
            </Button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="icon-btn h-9 w-9 text-muted"
              aria-label="Dismiss update notice"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateBanner;
