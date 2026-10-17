import { motion } from "motion/react";
import { useApp } from "../../context/AppContext";
import { NAV_ITEMS } from "./navItems";

/* Phone tab bar: flat paper with a hairline top edge, always-visible labels.
   Hidden at lg, where DesktopSidebar takes over. */
export const Navbar = () => {
  const { view, setView } = useApp();

  return (
    <nav
      aria-label="Primary"
      className="vt-tabbar fixed inset-x-0 bottom-0 z-30 border-t border-line bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="mx-auto grid max-w-[34rem] grid-cols-4">
        {NAV_ITEMS.map((n) => {
          const active = view === n.v;
          const Icon = n.icon;
          return (
            <li key={n.v}>
              <button
                type="button"
                onClick={() => setView(n.v)}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-16 w-full flex-col items-center justify-center gap-1 transition-colors ${
                  active ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute top-0 h-0.5 w-8 rounded-full bg-accent"
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <Icon
                  size={22}
                  strokeWidth={active ? 2 : 1.6}
                  className={active ? "text-accent" : undefined}
                  aria-hidden="true"
                />
                <span className={`text-xs leading-none ${active ? "font-semibold" : "font-medium"}`}>{n.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
