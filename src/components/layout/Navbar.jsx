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
      className="fixed bottom-4 left-1/2 z-30 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-3xl px-1.5 py-1.5 backdrop-blur-2xl"
      style={{
        background: "color-mix(in srgb, var(--surface) 70%, transparent)",
        border: "1px solid color-mix(in srgb, var(--line) 50%, transparent)",
        boxShadow:
          "0 8px 32px -16px color-mix(in srgb, var(--primary) 30%, transparent), inset 0 1px 0 0 color-mix(in srgb, #fff 8%, transparent)",
      }}
    >
      <div className="grid grid-cols-4">
        {navItems.map((n) => {
          const active = view === n.v;
          const Icon = n.icon;
          return (
            <button
              key={n.v}
              onClick={() => setView(n.v)}
              className="relative flex flex-col items-center justify-center gap-1 py-2 cursor-pointer"
              aria-label={n.label}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-x-1.5 inset-y-0 rounded-2xl"
                  style={{
                    background: "color-mix(in srgb, var(--primary) 16%, transparent)",
                    boxShadow:
                      "inset 0 1px 0 0 color-mix(in srgb, #fff 10%, transparent), 0 4px 14px -8px color-mix(in srgb, var(--primary) 60%, transparent)",
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <motion.span
                animate={{ scale: active ? 1.08 : 1, y: active ? -1 : 0 }}
                whileTap={{ scale: 0.86 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="relative flex items-center"
              >
                <Icon
                  size={20}
                  style={{ color: active ? "var(--primary)" : "var(--muted)" }}
                />
              </motion.span>
              <span
                className="relative text-[10px] font-bold tracking-wide leading-none transition-colors"
                style={{ color: active ? "var(--primary)" : "var(--muted)" }}
              >
                {n.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default Navbar;
