import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Sparkles, ArrowRight, Zap, Target,
  ChevronUp, ChevronDown, Pencil, Check
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import { fmt, computeStreak, dateKey } from "../../utils/stats";
import {
  ICONS, OCCASIONS, OCCASION_ICONS,
  DEFAULT_QUICK_COLLECTIONS, DEFAULT_HOME_SECTIONS,
  EMOTIONAL_REMEDIES,
} from "../../constants/dhikrData";

export const HomeView = () => {
  const {
    setView,
    lists,
    dhikrs,
    pinned,
    setPinned,
    stats,
    startList,
    startDhikr,
    setSearchQuery,
    session,
    complete,
    settings,
  } = useApp();
  const navigate = useNavigate();
  const [editPinned, setEditPinned] = useState(false);

  const movePinned = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= pinned.length) return;
    setPinned((p) => {
      const next = [...p];
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  };

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

  // Quick collections — derived from user settings (configurable in Settings)
  const quickKeys = (settings?.quickCollections && settings.quickCollections.length > 0)
    ? settings.quickCollections
    : DEFAULT_QUICK_COLLECTIONS;
  const quickCategories = quickKeys
    .filter((k) => OCCASIONS[k])
    .map((k) => ({
      key: k,
      label: OCCASIONS[k],
      icon: OCCASION_ICONS[k] || Sparkles,
    }));

  const handleQuickLink = (catKey) => {
    // Navigate + set the occasion in one go — calling setActiveOccasion and
    // then setView wipes the search param because navigate("/library")
    // replaces the URL entirely.
    setSearchQuery("");
    navigate(catKey === "all" ? "/library" : `/library?occasion=${encodeURIComponent(catKey)}`);
  };

  // Format today's calendar date nicely
  const getFormattedDate = () => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date().toLocaleDateString("en-US", options);
  };

  // ───────── Section renderers (composed in user-defined order) ─────────
  const renderStreak = () => (
    <Card key="streak" className="p-5 border-[var(--line)] shadow-sm">
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
      <div className="space-y-2 mb-5">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-[var(--muted)] flex items-center gap-1">
            <Target size={12} /> Daily Goal: {DAILY_GOAL} recitations
          </span>
          <span className="text-[var(--text)] font-semibold">{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-[var(--surface2)] overflow-hidden border border-[var(--line)]/50">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%`, background: "var(--primary)" }}
          />
        </div>
      </div>
      <div className="border-t border-[var(--line)]/60 my-3" />
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
  );

  const renderQuick = () => quickCategories.length > 0 && (
    <div key="quick" className="space-y-3">
      <h2 className="font-display text-sm font-semibold text-[var(--muted)] pl-1">Quick Collections</h2>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${Math.min(quickCategories.length, 4)}, minmax(0, 1fr))` }}
      >
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
  );

  const renderRemedies = () => (
    <div key="remedies" className="space-y-3">
      <h2 className="font-display text-sm font-semibold text-[var(--muted)] pl-1">
        Remedies for the Heart
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Object.entries(EMOTIONAL_REMEDIES).map(([key, rem]) => {
          const RemIcon = rem.icon;
          return (
            <button
              key={key}
              onClick={() => handleQuickLink(key)}
              className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 text-left cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "var(--surface2)", color: rem.color }}
              >
                <RemIcon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-[var(--text)]">{rem.label}</span>
                <span className="block text-[10px] text-[var(--muted)] mt-0.5 leading-snug truncate">
                  {rem.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderSuggested = () => suggest && (
    <Card key="suggested" className="p-5 border-2 border-[var(--primary)] bg-[var(--surface)] shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
  );

  const renderNamesShortcut = () => (
    <Card 
      key="asmaul_husna"
      className="p-5 border border-[var(--line)] bg-[var(--surface)] shadow-md flex justify-between items-center gap-4 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
      onClick={() => setView("names")}
    >
      <div className="space-y-1 min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-bold flex items-center gap-1.5">
          <Sparkles size={12} className="text-[var(--gold)]" />
          Dedicated Mode
        </p>
        <h3 className="font-display text-xl font-bold text-[var(--text)] leading-tight">
          Asma-ul-Husna Mode
        </h3>
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          Contemplate the 99 Beautiful Names of Allah.
        </p>
      </div>
      <button 
        className="rounded-2xl px-4 py-2.5 text-xs font-bold text-black cursor-pointer shadow-sm shrink-0 flex items-center gap-1 hover:brightness-105 active:scale-[0.96] transition-all"
        style={{ background: "var(--gold)" }}
      >
        Begin <ArrowRight size={14} />
      </button>
    </Card>
  );

  const renderPinned = () => (
    <div key="pinned">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-[var(--text)]">Your widgets</h2>
        <div className="flex items-center gap-3">
          {pinnedItems.length > 1 && (
            <button
              onClick={() => setEditPinned((v) => !v)}
              className="flex items-center gap-1 text-sm text-[var(--muted)] cursor-pointer font-bold hover:text-[var(--text)] active:scale-95 transition-all"
              aria-label={editPinned ? "Done reordering" : "Reorder widgets"}
            >
              {editPinned ? (<><Check size={15} /> Done</>) : (<><Pencil size={13} /> Edit</>)}
            </button>
          )}
          <button
            onClick={() => setView("library")}
            className="flex items-center gap-1 text-sm text-[var(--gold)] cursor-pointer font-bold hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus size={15} /> Add
          </button>
        </div>
      </div>

      {pinnedItems.length === 0 ? (
        <Card className="p-6 text-center text-sm text-[var(--muted)]">
          No pinned items yet. Pin sets or single dhikrs from the Library.
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {pinnedItems.map((item, idx) => {
            const isList = item.type === "list";
            const data = item.data;
            const Ico = isList ? (ICONS[data.icon] || Sparkles) : null;
            const total = isList ? data.steps.reduce((acc, s) => acc + s.target, 0) : null;
            const onActivate = () => isList ? startList(data) : startDhikr(data);

            return (
              <div key={data.id} className="relative">
                <button
                  onClick={editPinned ? undefined : onActivate}
                  disabled={editPinned}
                  className={`text-left w-full ${editPinned ? "cursor-default" : "cursor-pointer"}`}
                >
                  <Card className={`h-full p-4 transition-all flex flex-col justify-between min-h-[110px] ${editPinned ? "" : "hover:scale-[1.02] active:scale-95"}`}>
                    <div>
                      {isList ? (
                        <div
                          className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl"
                          style={{ background: "var(--surface2)" }}
                        >
                          <Ico size={18} className="text-[var(--gold)]" />
                        </div>
                      ) : (
                        <div
                          className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl font-arabic text-lg text-[var(--gold)]"
                          style={{ background: "var(--surface2)" }}
                        >
                          {data.arabic.charAt(0)}
                        </div>
                      )}
                      <p className="font-semibold text-xs leading-snug text-[var(--text)] line-clamp-2">
                        {isList ? data.name : data.tr}
                      </p>
                    </div>
                    <span className="mt-2 text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider block">
                      {isList ? `Set · ${total} counts` : `Dhikr · ×${data.target}`}
                    </span>
                  </Card>
                </button>

                {editPinned && (
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); movePinned(idx, -1); }}
                      disabled={idx === 0}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface2)] border border-[var(--line)] text-[var(--text)] disabled:opacity-30 cursor-pointer active:scale-90 transition-transform"
                      aria-label="Move up"
                    >
                      <ChevronUp size={13} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); movePinned(idx, 1); }}
                      disabled={idx === pinnedItems.length - 1}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface2)] border border-[var(--line)] text-[var(--text)] disabled:opacity-30 cursor-pointer active:scale-90 transition-transform"
                      aria-label="Move down"
                    >
                      <ChevronDown size={13} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const sectionRenderers = {
    streak: renderStreak,
    remedies: renderRemedies,
    asmaul_husna: renderNamesShortcut,
    quick: renderQuick,
    suggested: renderSuggested,
    pinned: renderPinned,
  };
  const homeSections = (settings?.homeSections && settings.homeSections.length > 0)
    ? settings.homeSections
    : DEFAULT_HOME_SECTIONS;

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

      {/* Continue Session — contextual, always above the configurable stack */}
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

      {/* Configurable section stack — order/visibility from settings.homeSections */}
      {homeSections.map((s) => {
        if (!s.visible) return null;
        const render = sectionRenderers[s.key];
        return render ? render() : null;
      })}
    </div>
  );
};

export default HomeView;
