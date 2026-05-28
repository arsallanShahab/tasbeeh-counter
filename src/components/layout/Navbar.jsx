import React from "react";
import { Home, BookOpen, BarChart3, Settings as SettingsIcon } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const Navbar = () => {
  const { view, setView } = useApp();

  if (view === "counter") return null;

  const navItems = [
    { v: "home", icon: Home, label: "Home" },
    { v: "library", icon: BookOpen, label: "Library" },
    { v: "stats", icon: BarChart3, label: "Stats" },
    { v: "settings", icon: SettingsIcon, label: "Settings" },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-[var(--line)] px-2 py-2 backdrop-blur-xl" 
      style={{ background: "color-mix(in srgb, var(--surface) 88%, transparent)" }}
    >
      <div className="flex justify-around">
        {navItems.map((n) => {
          const active = view === n.v;
          const Icon = n.icon;
          return (
            <button 
              key={n.v} 
              onClick={() => setView(n.v)} 
              className="flex flex-1 flex-col items-center gap-0.5 py-1.5 cursor-pointer"
            >
              <Icon 
                size={22} 
                style={{ color: active ? "var(--primary)" : "var(--muted)" }} 
              />
              <span 
                className="text-[10px]" 
                style={{ color: active ? "var(--primary)" : "var(--muted)" }}
              >
                {n.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
