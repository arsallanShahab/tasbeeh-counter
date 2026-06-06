import React from "react";
import { motion } from "motion/react";
import { Home, BookOpen, BarChart3, Settings as SettingsIcon } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const Navbar = () => {
  const { view, setView } = useApp();

  if (view === "counter" || view === "names") return null;

  const navItems = [
    { v: "home", icon: Home, label: "Home" },
    { v: "library", icon: BookOpen, label: "Library" },
    { v: "stats", icon: BarChart3, label: "Stats" },
    { v: "settings", icon: SettingsIcon, label: "Settings" },
  ];

  return (
    <motion.nav
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      className="fixed bottom-4 left-1/2 z-30 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-full px-1.5 py-1.5 backdrop-blur-2xl"
      style={{
        background: "color-mix(in srgb, var(--surface) 70%, transparent)",
        border: "1px solid color-mix(in srgb, var(--line) 50%, transparent)",
        boxShadow:
          "0 8px 32px -16px color-mix(in srgb, var(--primary) 30%, transparent), inset 0 1px 0 0 color-mix(in srgb, #fff 8%, transparent)",
      }}
    >
      <div className="flex justify-around">
        {navItems.map((n) => {
          const active = view === n.v;
          const Icon = n.icon;
          return (
            <button
              key={n.v}
              onClick={() => setView(n.v)}
              className="relative flex flex-1 items-center justify-center py-2 cursor-pointer"
              aria-label={n.label}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-x-1 inset-y-0 rounded-full"
                  style={{
                    background: "color-mix(in srgb, var(--primary) 16%, transparent)",
                    boxShadow:
                      "inset 0 1px 0 0 color-mix(in srgb, #fff 10%, transparent), 0 4px 14px -8px color-mix(in srgb, var(--primary) 60%, transparent)",
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.86 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className="relative flex items-center gap-1.5"
              >
                <motion.span
                  animate={{ scale: active ? 1.05 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="flex items-center"
                >
                  <Icon
                    size={19}
                    style={{ color: active ? "var(--primary)" : "var(--muted)" }}
                  />
                </motion.span>
                <motion.span
                  initial={false}
                  animate={{
                    width: active ? "auto" : 0,
                    opacity: active ? 1 : 0,
                    marginLeft: active ? 4 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="overflow-hidden whitespace-nowrap text-[11px] font-bold tracking-wide"
                  style={{ color: "var(--primary)" }}
                >
                  {n.label}
                </motion.span>
              </motion.div>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default Navbar;
