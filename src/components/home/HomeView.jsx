import React from "react";
import { Plus, Sparkles } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import { fmt, computeStreak, dateKey } from "../../utils/stats";
import { OCCASIONS, ICONS } from "../../constants/dhikrData";

export const HomeView = () => {
  const {
    setView,
    lists,
    dhikrs,
    pinned,
    stats,
    startList,
    startDhikr
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

  return (
    <div className="space-y-6 anim-fade">
      <header className="flex items-end justify-between pt-2">
        <div>
          <p className="text-sm text-[var(--muted)]">{greet}</p>
          <h1 className="font-display text-3xl text-[var(--text)]">
            Sabḥa <span className="font-arabic text-[var(--gold)]" dir="rtl">سُبْحَة</span>
          </h1>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl text-[var(--gold)]">{streak}🔥</p>
          <p className="text-xs text-[var(--muted)]">day streak</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <p className="text-xs text-[var(--muted)]">Today</p>
          <p className="font-display text-3xl text-[var(--text)]">{fmt(today)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[var(--muted)]">All-time</p>
          <p className="font-display text-3xl text-[var(--text)]">{fmt(stats.total)}</p>
        </Card>
      </div>

      <button 
        onClick={() => startList(suggest)} 
        className="w-full text-left cursor-pointer group"
      >
        <Card 
          className="overflow-hidden p-5 transition-all group-active:scale-99 border-[var(--primary)]/20" 
          style={{ background: "linear-gradient(135deg, var(--primary-dim), var(--surface))" }}
        >
          <p className="text-xs uppercase tracking-widest text-[var(--gold)] font-semibold">
            Suggested now
          </p>
          <p className="font-display mt-1 text-2xl text-[var(--text)]">
            {suggest.name}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)] flex items-center gap-1">
            Tap to begin <span className="group-hover:translate-x-1 transition-transform">→</span>
          </p>
        </Card>
      </button>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg text-[var(--text)]">Your widgets</h2>
          <button 
            onClick={() => setView("library")} 
            className="flex items-center gap-1 text-sm text-[var(--gold)] cursor-pointer font-medium hover:brightness-110"
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
                    <Card className="h-full p-4 transition-all hover:scale-[1.02] active:scale-95 flex flex-col justify-between">
                      <div>
                        <div 
                          className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl" 
                          style={{ background: "var(--surface2)" }}
                        >
                          <Ico size={20} className="text-[var(--gold)]" />
                        </div>
                        <p className="font-medium leading-tight text-[var(--text)]">{l.name}</p>
                      </div>
                      <p className="mt-2 text-xs text-[var(--muted)]">
                        Set · {total} counts
                      </p>
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
                    <Card className="h-full p-4 transition-all hover:scale-[1.02] active:scale-95 flex flex-col justify-between">
                      <div>
                        <div 
                          className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl font-arabic text-xl text-[var(--gold)]" 
                          style={{ background: "var(--surface2)" }}
                        >
                          {d.arabic.charAt(0)}
                        </div>
                        <p className="font-medium leading-tight text-[var(--text)]">{d.tr}</p>
                      </div>
                      <p className="mt-2 text-xs text-[var(--muted)]">
                        Dhikr · ×{d.target}
                      </p>
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
