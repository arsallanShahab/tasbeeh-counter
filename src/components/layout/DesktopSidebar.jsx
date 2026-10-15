import { Sparkles, Compass, Plus, Play } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { BrandMark } from "../common/BrandMark";
import { Button } from "../common/Button";
import { NAV_ITEMS } from "./navItems";
import { computeStreak, dateKey, fmt } from "../../utils/stats";

const EXPLORE = [
  { v: "names", icon: Sparkles, label: "99 Names" },
  { v: "qibla", icon: Compass, label: "Qibla" },
];

const NavItem = ({ item, active, onClick }) => {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[0.9375rem] transition-colors ${
        active ? "bg-sunken font-semibold text-ink" : "font-medium text-muted hover:bg-sunken hover:text-ink"
      }`}
    >
      <Icon size={19} strokeWidth={active ? 2 : 1.6} className={active ? "text-accent" : undefined} aria-hidden="true" />
      {item.label}
    </button>
  );
};

/* Desktop rail. Paper, a hairline edge, and only what helps you move: the
   sections, a resume shortcut while a session is open, and the two create
   actions. Rendered at lg and up only (pure CSS), so there is no flash. */
export const DesktopSidebar = () => {
  const { view, setView, openEditor, stats, session, complete, appVersion } = useApp();

  const today = stats.byDate[dateKey()] || 0;
  const streak = computeStreak(stats.byDate);
  const resumable = session && !complete && session.counts.some((c) => c > 0);

  return (
    <aside
      aria-label="Sidebar"
      className="fixed inset-y-0 left-0 z-30 hidden w-[17rem] flex-col overflow-y-auto border-r border-line bg-page lg:flex"
    >
      <div className="px-6 pb-6 pt-8">
        <button type="button" onClick={() => setView("home")} aria-label="Tasbeeh Go, go to Today" className="rounded-lg">
          <BrandMark />
        </button>
        <p className="numerals mt-4 text-sm text-muted">
          <span className="font-medium text-ink">{fmt(today)}</span> today
          <span className="mx-2 text-line-strong" aria-hidden="true">/</span>
          <span className="font-medium text-ink">{streak}</span> day streak
        </p>
      </div>

      <nav aria-label="Primary" className="flex flex-col gap-0.5 px-3">
        {NAV_ITEMS.map((n) => (
          <NavItem key={n.v} item={n} active={view === n.v} onClick={() => setView(n.v)} />
        ))}
        <p className="eyebrow px-3 pb-2 pt-6">Explore</p>
        {EXPLORE.map((n) => (
          <NavItem key={n.v} item={n} active={view === n.v} onClick={() => setView(n.v)} />
        ))}
      </nav>

      {resumable && (
        <div className="px-3 pt-6">
          <button
            type="button"
            onClick={() => setView("counter")}
            className="flex w-full items-center gap-3 rounded-xl border border-line bg-surface p-3 text-left transition-colors hover:border-line-strong"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent">
              <Play size={15} fill="currentColor" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-medium text-muted">Continue</span>
              <span className="block truncate text-sm font-semibold text-ink">{session.title}</span>
            </span>
          </button>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2 px-5 pb-6 pt-8">
        <Button variant="primary" size="md" icon={Plus} onClick={() => openEditor("list")} block>
          New set
        </Button>
        <Button variant="secondary" size="md" icon={Plus} onClick={() => openEditor("dhikr")} block>
          New dhikr
        </Button>
        <p className="numerals pt-3 text-center text-xs text-muted">Tasbeeh Go {appVersion}</p>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
