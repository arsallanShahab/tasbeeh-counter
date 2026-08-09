import React from "react";
import { motion } from "motion/react";
import {
  Home, BookOpen, BarChart3, Settings as SettingsIcon,
  Sparkles, Compass, Plus, Flame, Play,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import BrandMark from "../common/BrandMark";
import { computeStreak, dateKey, fmt } from "../../utils/stats";

const PRIMARY = [
  { v: "home", icon: Home, label: "Home" },
  { v: "library", icon: BookOpen, label: "Library" },
  { v: "stats", icon: BarChart3, label: "Statistics" },
  { v: "settings", icon: SettingsIcon, label: "Settings" },
];

const EXPLORE = [
  { v: "names", icon: Sparkles, label: "99 Names" },
  { v: "qibla", icon: Compass, label: "Qibla" },
];

const NavItem = ({ item, active, onClick }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className="relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left cursor-pointer"
      style={{ color: active ? "var(--primary)" : "var(--muted)" }}
    >
      {active && (
        <motion.span
          layoutId="desktop-nav-pill"
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "color-mix(in srgb, var(--primary) 14%, transparent)",
            boxShadow:
              "inset 0 1px 0 0 color-mix(in srgb, #fff 8%, transparent), 0 4px 14px -10px color-mix(in srgb, var(--primary) 60%, transparent)",
          }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      <Icon size={18} className="relative shrink-0" />
      <span className="relative text-sm font-semibold">{item.label}</span>
    </button>
  );
};

const SectionLabel = ({ children }) => (
  <p className="px-3 pb-1.5 pt-4 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] opacity-70">
    {children}
  </p>
);

/* The desktop chrome: a persistent rail that replaces the mobile floating
   header + bottom tab bar. Rendered only at `lg` and above (pure CSS, so there
   is no layout flash), while <AppHeader/> and <Navbar/> are hidden there. */
export const DesktopSidebar = () => {
  const { view, setView, setModal, stats, session, complete, appVersion } = useApp();

  const today = stats.byDate[dateKey()] || 0;
  const streak = computeStreak(stats.byDate);
  const resumable = session && !complete && session.counts.some((c) => c > 0);

  return (
    <aside
      className="fixed left-0 top-0 z-30 hidden h-svh w-[17rem] flex-col overflow-y-auto lg:flex"
      style={{
        background: "color-mix(in srgb, var(--surface) 55%, transparent)",
        borderRight: "1px solid color-mix(in srgb, var(--line) 60%, transparent)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Brand */}
      <div className="px-5 pb-1 pt-6">
        <button
          onClick={() => setView("home")}
          className="cursor-pointer text-left"
          aria-label="Go to home"
        >
          <BrandMark className="text-3xl" />
        </button>
        <p className="mt-1 text-[11px] font-medium text-[var(--muted)]">
          Your dhikr companion
        </p>
      </div>

      {/* Live stats */}
      <div className="grid grid-cols-2 gap-2 px-4 pt-4">
        <div
          className="rounded-2xl px-3 py-2.5"
          style={{
            background: "color-mix(in srgb, var(--gold) 12%, transparent)",
            border: "1px solid color-mix(in srgb, var(--gold) 26%, transparent)",
          }}
        >
          <div className="flex items-center gap-1 text-[var(--gold)]">
            <Flame size={12} />
            <span className="text-[9px] font-bold uppercase tracking-wider">Streak</span>
          </div>
          <p className="font-display text-lg font-bold leading-tight text-[var(--gold)]">
            {streak}
          </p>
        </div>
        <div
          className="rounded-2xl px-3 py-2.5"
          style={{
            background: "color-mix(in srgb, var(--primary) 12%, transparent)",
            border: "1px solid color-mix(in srgb, var(--primary) 26%, transparent)",
          }}
        >
          <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--primary)]">
            Today
          </span>
          <p className="font-display text-lg font-bold leading-tight text-[var(--primary)]">
            {fmt(today)}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-2 pt-2">
        <SectionLabel>Menu</SectionLabel>
        <div className="flex flex-col gap-0.5">
          {PRIMARY.map((n) => (
            <NavItem
              key={n.v}
              item={n}
              active={view === n.v}
              onClick={() => setView(n.v)}
            />
          ))}
        </div>

        <SectionLabel>Explore</SectionLabel>
        <div className="flex flex-col gap-0.5">
          {EXPLORE.map((n) => (
            <NavItem
              key={n.v}
              item={n}
              active={view === n.v}
              onClick={() => setView(n.v)}
            />
          ))}
        </div>
      </nav>

      {/* Resume — mirrors the Home "Active Session" card so a session is always
          one click away from any screen. */}
      {resumable && (
        <div className="px-4 pt-4">
          <button
            onClick={() => setView("counter")}
            className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left cursor-pointer"
            style={{
              background: "color-mix(in srgb, var(--gold) 12%, transparent)",
              border: "1px solid color-mix(in srgb, var(--gold) 30%, transparent)",
            }}
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
              style={{ background: "var(--gold)", color: "#1a1206" }}
            >
              <Play size={14} fill="currentColor" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[9px] font-bold uppercase tracking-widest text-[var(--gold)]">
                Resume
              </span>
              <span className="block truncate text-xs font-semibold text-[var(--text)]">
                {session.title}
              </span>
            </span>
          </button>
        </div>
      )}

      {/* Create actions */}
      <div className="mt-auto px-4 pb-5 pt-6">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setModal("dhikr")}
            className="flex items-center justify-center gap-1.5 rounded-2xl border px-3 py-2.5 text-xs font-bold cursor-pointer transition-colors hover:bg-[var(--surface2)]"
            style={{ borderColor: "var(--line)", color: "var(--text)" }}
          >
            <Plus size={14} /> New Dhikr
          </button>
          <button
            onClick={() => setModal("list")}
            className="flex items-center justify-center gap-1.5 rounded-2xl px-3 py-2.5 text-xs font-bold text-white cursor-pointer shadow-sm transition-all hover:brightness-105"
            style={{ background: "var(--primary)" }}
          >
            <Plus size={14} /> New Set
          </button>
        </div>
        <p className="pt-4 text-center font-mono text-[10px] text-[var(--muted)]">
          Sabḥa v{appVersion}
        </p>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
