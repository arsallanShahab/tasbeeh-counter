import React from "react";
import { 
  Plus, Sparkles, Sunrise, Moon, Sun, Star, ArrowRight, Zap, Target 
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import { fmt, computeStreak, dateKey } from "../../utils/stats";
import { ICONS } from "../../constants/dhikrData";

export const HomeView = () => {
  const {
    setView,
    lists,
    dhikrs,
    pinned,
    stats,
    startList,
    startDhikr,
    setActiveOccasion,
    setSearchQuery,
    session,
    complete
  } = useApp();

  const hr = new Date().getHours();
  const suggestId = hr < 12 ? "morning" : hr >= 15 ? "evening" : "after-salah";
  const suggest = lists.find((l) => l.id === suggestId) || lists[0];
  const greet = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";

  // Map pinned IDs to either lists (sets) or single dhikrs
  const pinnedItems = pinned.map((id) => {
    const list = lists.find((l) => l.id === id);
    if (list) return { type: "list", data: list };
    const dhikr = dhikrs.find((d) => d.id === id);
    if (dhikr) return { type: "dhikr", data: dhikr };
    return null;
  }).filter(Boolean);

  const today = stats.byDate[dateKey()] || 0;
  const streak = computeStreak(stats.byDate);

  // Daily target threshold (standard premium 300 recitations goal)
  const DAILY_GOAL = 300;
  const progressPercent = Math.min((today / DAILY_GOAL) * 100, 100);

  // Quick navigation link categories mapping
  const quickCategories = [
    { key: "morning", label: "Morning", icon: Sunrise },
    { key: "evening", label: "Evening", icon: Moon },
    { key: "after-salah", label: "After Salah", icon: Sun },
    { key: "friday", label: "Friday", icon: Star }
  ];

  const handleQuickLink = (catKey) => {
    setActiveOccasion(catKey);
    setSearchQuery("");
    setView("library");
  };

  // Format today's calendar date nicely
  const getFormattedDate = () => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date().toLocaleDateString("en-US", options);
  };

  return (
    <div className="space-y-6 anim-fade pb-6">
      {/* Redesigned Premium Greeting Header */}
      <header className="flex items-center justify-between pt-2">
        <div>
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
            {getFormattedDate()}
          </p>
          <h1 className="font-display text-3xl text-[var(--text)] mt-0.5">
            Sabḥa <span className="font-arabic text-[var(--gold)] ml-1" dir="rtl">سُبْحَة</span>
          </h1>
        </div>
        <div className="text-right">
          <span className="text-xs text-[var(--muted)] block font-medium">{greet},</span>
          <span className="text-sm font-bold text-[var(--text)]">Seeker</span>
        </div>
      </header>

      {/* Redesigned Master Dashboard Tracker Card */}
      <Card className="p-5 border-[var(--line)] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <Zap size={16} className="text-[var(--gold)] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
              Daily Streak
            </span>
          </div>
          <span className="font-display text-xl text-[var(--gold)] font-bold">
            {streak} Days 🔥
          </span>
        </div>

        {/* Goal Progress Indicator */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-[var(--muted)] flex items-center gap-1">
              <Target size={12} /> Daily Goal: {DAILY_GOAL} recitations
            </span>
            <span className="text-[var(--text)] font-semibold">{Math.round(progressPercent)}%</span>
          </div>
          {/* Flat solid progress bar */}
          <div className="h-2.5 w-full rounded-full bg-[var(--surface2)] overflow-hidden border border-[var(--line)]/50">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%`, background: "var(--primary)" }}
            />
          </div>
        </div>

        <div className="border-t border-[var(--line)]/60 my-3" />

        {/* HUD Sub-stats */}
        <div className="grid grid-cols-2 text-center pt-2">
          <div className="border-r border-[var(--line)]/60">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Today</p>
            <p className="font-display text-2xl font-bold text-[var(--text)] mt-1">{fmt(today)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">All-Time</p>
            <p className="font-display text-2xl font-bold text-[var(--text)] mt-1">{fmt(stats.total)}</p>
          </div>
        </div>
      </Card>

      {/* Premium Continue Session Widget */}
      {session && !complete && session.counts.some(c => c > 0) && (() => {
        const idx = session.stepIndex;
        const currentCount = session.counts[idx];
        const currentTarget = session.steps[idx].target;
        const totalSteps = session.steps.length;
        return (
          <Card 
            className="p-5 border-2 border-[var(--gold)] bg-[var(--surface)] shadow-md flex justify-between items-center gap-4 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
            onClick={() => setView("counter")}
          >
            <div className="space-y-1 min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-bold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[var(--gold)] animate-ping" />
                Active Session
              </p>
              <h3 className="font-display text-xl font-bold text-[var(--text)] truncate leading-tight">
                {session.title}
              </h3>
              <p className="text-xs text-[var(--muted)] truncate mt-0.5">
                {totalSteps > 1 
                  ? `Recited: Step ${idx + 1} of ${totalSteps} (${currentCount} / ${currentTarget})`
                  : `Recited: ${currentCount} / ${currentTarget} times`
                }
              </p>
            </div>
            <button 
              className="rounded-2xl px-4 py-2.5 text-xs font-bold text-black cursor-pointer active:scale-[0.96] transition-all duration-300 flex items-center gap-1 shrink-0 shadow-sm"
              style={{ background: "var(--gold)" }}
            >
              Resume →
            </button>
          </Card>
        );
      })()}

      {/* Redesigned Quick Navigation Categories Carousel */}
      <div className="space-y-3">
        <h2 className="font-display text-sm font-semibold text-[var(--muted)] pl-1">Quick Collections</h2>
        <div className="grid grid-cols-4 gap-2">
          {quickCategories.map((cat) => {
            const CatIcon = cat.icon;
            return (
              <button 
                key={cat.key}
                onClick={() => handleQuickLink(cat.key)}
                className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface)] py-3.5 text-center cursor-pointer transition-all hover:scale-[1.03] active:scale-[0.97]"
              >
                <div 
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: "var(--surface2)", color: "var(--primary)" }}
                >
                  <CatIcon size={18} />
                </div>
                <span className="text-[10px] font-bold text-[var(--text)]">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Redesigned Active Session Reminder Card */}
      <Card className="p-5 border-2 border-[var(--primary)] bg-[var(--surface)] shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-bold">
            Suggested Session
          </p>
          <h3 className="font-display text-2xl font-bold text-[var(--text)] leading-tight">
            {suggest.name}
          </h3>
          <p className="text-xs text-[var(--muted)] max-w-xs leading-relaxed">
            recite and fulfill your daily goal requirements.
          </p>
        </div>
        
        <button 
          onClick={() => startList(suggest)} 
          className="rounded-2xl px-5 py-3 text-xs font-bold text-white cursor-pointer active:scale-[0.96] hover:brightness-105 transition-all duration-300 flex items-center gap-1.5 shrink-0 shadow-sm"
          style={{ background: "var(--primary)" }}
        >
          Begin Adhkar <ArrowRight size={14} />
        </button>
      </Card>

      {/* Redesigned Pinned Widgets Section */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-[var(--text)]">Your widgets</h2>
          <button 
            onClick={() => setView("library")} 
            className="flex items-center gap-1 text-sm text-[var(--gold)] cursor-pointer font-bold hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus size={15} /> Add
          </button>
        </div>
        
        {pinnedItems.length === 0 ? (
          <Card className="p-6 text-center text-sm text-[var(--muted)]">
            No pinned items yet. Pin sets or single dhikrs from the Library.
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {pinnedItems.map((item) => {
              if (item.type === "list") {
                const l = item.data;
                const Ico = ICONS[l.icon] || Sparkles;
                const total = l.steps.reduce((acc, s) => acc + s.target, 0);
                return (
                  <button 
                    key={l.id} 
                    onClick={() => startList(l)} 
                    className="text-left cursor-pointer"
                  >
                    <Card className="h-full p-4 transition-all hover:scale-[1.02] active:scale-95 flex flex-col justify-between min-h-[110px]">
                      <div>
                        <div 
                          className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl" 
                          style={{ background: "var(--surface2)" }}
                        >
                          <Ico size={18} className="text-[var(--gold)]" />
                        </div>
                        <p className="font-semibold text-xs leading-snug text-[var(--text)] line-clamp-2">{l.name}</p>
                      </div>
                      <span className="mt-2 text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider block">
                        Set · {total} counts
                      </span>
                    </Card>
                  </button>
                );
              } else {
                const d = item.data;
                return (
                  <button 
                    key={d.id} 
                    onClick={() => startDhikr(d)} 
                    className="text-left cursor-pointer"
                  >
                    <Card className="h-full p-4 transition-all hover:scale-[1.02] active:scale-95 flex flex-col justify-between min-h-[110px]">
                      <div>
                        <div 
                          className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl font-arabic text-lg text-[var(--gold)]" 
                          style={{ background: "var(--surface2)" }}
                        >
                          {d.arabic.charAt(0)}
                        </div>
                        <p className="font-semibold text-xs leading-snug text-[var(--text)] line-clamp-2">{d.tr}</p>
                      </div>
                      <span className="mt-2 text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider block">
                        Dhikr · ×{d.target}
                      </span>
                    </Card>
                  </button>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeView;
