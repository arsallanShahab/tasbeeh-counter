import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Plus, Trash2, Pin, PinOff, Sparkles, Search, X,
  BookOpen, FolderHeart, ChevronDown, ChevronRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import { OCCASIONS, ICONS } from "../../constants/dhikrData";

const spring = { type: "spring", stiffness: 320, damping: 28 };

// ────────────────────────────────────────────────────────────────────────
// List card
// ────────────────────────────────────────────────────────────────────────
const ListRow = ({ l, dById, pinned, togglePin, startList, removeList }) => {
  const Ico = ICONS[l.icon] || Sparkles;
  const isPinned = pinned.includes(l.id);
  return (
    <Card animated className="flex items-center gap-3 p-3.5">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-2xl shrink-0"
        style={{
          background: "color-mix(in srgb, var(--primary) 12%, transparent)",
          color: "var(--gold)",
        }}
      >
        <Ico size={18} />
      </div>
      <button onClick={() => startList(l)} className="min-w-0 flex-1 text-left cursor-pointer">
        <p className="font-semibold text-[var(--text)] text-sm truncate">{l.name}</p>
        <p className="truncate text-[11px] text-[var(--muted)] mt-0.5">
          {l.steps.length} step{l.steps.length !== 1 ? "s" : ""} · {l.steps.map((s) => `${dById(s.dhikr)?.tr ?? "?"} ×${s.target}`).join(" · ")}
        </p>
      </button>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => togglePin(l.id)}
        className="flex h-8 w-8 items-center justify-center rounded-full cursor-pointer"
        style={{
          color: isPinned ? "var(--gold)" : "var(--muted)",
          background: isPinned ? "color-mix(in srgb, var(--gold) 14%, transparent)" : "transparent",
        }}
        aria-label={isPinned ? "Unpin" : "Pin"}
      >
        {isPinned ? <Pin size={15} /> : <PinOff size={15} />}
      </motion.button>
      {l.id.startsWith("c_") && (
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => removeList(l.id)}
          className="flex h-8 w-8 items-center justify-center rounded-full cursor-pointer"
          style={{
            color: "var(--danger)",
            background: "color-mix(in srgb, var(--danger) 12%, transparent)",
          }}
          aria-label="Delete"
        >
          <Trash2 size={14} />
        </motion.button>
      )}
    </Card>
  );
};

// ────────────────────────────────────────────────────────────────────────
// Dhikr card
// ────────────────────────────────────────────────────────────────────────
const DhikrRow = ({ d, pinned, togglePin, startDhikr, removeDhikr, lang }) => {
  const isPinned = pinned.includes(d.id);
  return (
    <Card animated className="flex items-center gap-3 p-3.5">
      <button onClick={() => startDhikr(d)} className="min-w-0 flex-1 text-left cursor-pointer">
        <p className="font-arabic text-lg text-[var(--text)] truncate" dir="rtl">
          {d.arabic}
        </p>
        <p className="text-[11px] text-[var(--gold)] font-semibold mt-0.5 truncate">
          {d.tr} · ×{d.target}
        </p>
        <p className="truncate text-[11px] text-[var(--muted)] mt-0.5">
          {lang === "ur" ? d.ur : d.en}
        </p>
      </button>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => togglePin(d.id)}
        className="flex h-8 w-8 items-center justify-center rounded-full cursor-pointer"
        style={{
          color: isPinned ? "var(--gold)" : "var(--muted)",
          background: isPinned ? "color-mix(in srgb, var(--gold) 14%, transparent)" : "transparent",
        }}
        aria-label={isPinned ? "Unpin" : "Pin"}
      >
        {isPinned ? <Pin size={15} /> : <PinOff size={15} />}
      </motion.button>
      {d.tags?.includes("custom") && (
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => removeDhikr(d.id)}
          className="flex h-8 w-8 items-center justify-center rounded-full cursor-pointer"
          style={{
            color: "var(--danger)",
            background: "color-mix(in srgb, var(--danger) 12%, transparent)",
          }}
          aria-label="Delete"
        >
          <Trash2 size={14} />
        </motion.button>
      )}
    </Card>
  );
};

// ────────────────────────────────────────────────────────────────────────
// Collapsible occasion section (for dhikr grouping)
// ────────────────────────────────────────────────────────────────────────
const OccasionGroup = ({ occKey, label, items, defaultOpen, renderItem }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="space-y-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-2xl px-3 py-2 cursor-pointer"
        style={{
          background: "color-mix(in srgb, var(--surface2) 50%, transparent)",
          border: "1px solid color-mix(in srgb, var(--line) 50%, transparent)",
        }}
      >
        <div className="flex items-center gap-2">
          <motion.span animate={{ rotate: open ? 90 : 0 }} transition={spring}>
            <ChevronRight size={14} className="text-[var(--muted)]" />
          </motion.span>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">{label}</span>
          <span
            className="rounded-full px-1.5 py-px text-[10px] font-bold"
            style={{
              background: "color-mix(in srgb, var(--gold) 14%, transparent)",
              color: "var(--gold)",
            }}
          >
            {items.length}
          </span>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={spring}
            className="overflow-hidden"
          >
            <div className="space-y-2 pt-1">
              <AnimatePresence initial={false}>
                {items.map(renderItem)}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────
// Main view
// ────────────────────────────────────────────────────────────────────────
export const LibraryView = () => {
  const {
    dhikrs, setDhikrs, lists, setLists, pinned, setPinned,
    setModal, dById, togglePin, startList, startDhikr,
    settings, searchQuery, setSearchQuery, activeOccasion, setActiveOccasion,
  } = useApp();

  const [tab, setTab] = useState("sets"); // "sets" | "dhikrs"

  const q = searchQuery.toLowerCase();
  const filtersActive = q.length > 0 || activeOccasion !== "all";

  const filteredLists = useMemo(
    () => lists.filter((l) => {
      const matchesSearch =
        !q || l.name.toLowerCase().includes(q) || (l.note && l.note.toLowerCase().includes(q));
      const matchesOccasion = activeOccasion === "all" || l.occasion === activeOccasion;
      return matchesSearch && matchesOccasion;
    }),
    [lists, q, activeOccasion]
  );

  const filteredDhikrs = useMemo(
    () => dhikrs.filter((d) => {
      const matchesSearch =
        !q ||
        d.tr.toLowerCase().includes(q) ||
        (d.en && d.en.toLowerCase().includes(q)) ||
        d.arabic.includes(searchQuery) ||
        (d.ur && d.ur.includes(searchQuery));
      const matchesOccasion = activeOccasion === "all" || (d.tags && d.tags.includes(activeOccasion));
      return matchesSearch && matchesOccasion;
    }),
    [dhikrs, q, activeOccasion, searchQuery]
  );

  // Group dhikrs by primary occasion tag when unfiltered for browsability
  const groupedDhikrs = useMemo(() => {
    if (filtersActive) return null;
    const groups = {};
    filteredDhikrs.forEach((d) => {
      const tag = (d.tags && d.tags.find((t) => OCCASIONS[t])) || "general";
      if (!groups[tag]) groups[tag] = [];
      groups[tag].push(d);
    });
    // Sort with a sensible occasion priority
    const order = ["morning", "evening", "after-salah", "friday", "sleep", "ramadan", "high-reward", "protection", "forgiveness", "repentance", "distress", "anxiety", "gratitude", "knowledge", "family", "tawheed", "salah", "gathering", "general", "custom"];
    return Object.entries(groups).sort(([a], [b]) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  }, [filteredDhikrs, filtersActive]);

  // Pinned items (only relevant when not filtering)
  const pinnedItems = useMemo(() => {
    if (filtersActive) return [];
    return pinned
      .map((id) => {
        const l = lists.find((x) => x.id === id);
        if (l) return { type: "list", data: l };
        const d = dhikrs.find((x) => x.id === id);
        if (d) return { type: "dhikr", data: d };
        return null;
      })
      .filter(Boolean);
  }, [pinned, lists, dhikrs, filtersActive]);

  const removeList = (id) => {
    setLists((ls) => ls.filter((x) => x.id !== id));
    setPinned((p) => p.filter((x) => x !== id));
  };

  const removeDhikr = (id) => {
    setDhikrs((ds) => ds.filter((x) => x.id !== id));
    setPinned((p) => p.filter((x) => x !== id));
  };

  const totalCount = tab === "sets" ? filteredLists.length : filteredDhikrs.length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex items-center justify-between pt-2">
        <h1 className="font-display text-2xl text-[var(--text)]">Library</h1>
        <div className="flex gap-1.5 sm:gap-2">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setModal("dhikr")}
            className="flex items-center gap-1 rounded-2xl border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--text)] font-semibold cursor-pointer hover:bg-[var(--surface2)] transition-colors"
          >
            <Plus size={13} /> Dhikr
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setModal("list")}
            className="flex items-center gap-1 rounded-2xl px-3 py-1.5 text-xs font-semibold text-white cursor-pointer hover:brightness-105 transition-all shadow-sm"
            style={{ background: "var(--primary)" }}
          >
            <Plus size={13} /> Set
          </motion.button>
        </div>
      </header>

      {/* Sticky search + filter strip */}
      <div
        className="sticky top-0 z-20 -mx-5 px-5 pt-0 pb-3 space-y-3"
        style={{
          background: "color-mix(in srgb, var(--bg) 95%, transparent)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dhikr, sets, Arabic, translation…"
            className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] pl-10 pr-9 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] placeholder:text-zinc-500/70 font-medium"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full cursor-pointer"
                style={{
                  background: "color-mix(in srgb, var(--surface2) 70%, transparent)",
                  color: "var(--muted)",
                }}
                aria-label="Clear search"
              >
                <X size={13} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Tabs + result count */}
        <div className="flex items-center justify-between gap-2">
          <div
            className="flex gap-1 rounded-full p-1"
            style={{ background: "color-mix(in srgb, var(--surface2) 60%, transparent)" }}
          >
            {[
              { id: "sets", icon: FolderHeart, label: "Sets" },
              { id: "dhikrs", icon: BookOpen, label: "Dhikrs" },
            ].map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <motion.button
                  key={t.id}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setTab(t.id)}
                  className="relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold cursor-pointer"
                  style={{ color: active ? "var(--primary)" : "var(--muted)" }}
                >
                  {active && (
                    <motion.span
                      layoutId="lib-tab"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "color-mix(in srgb, var(--surface) 95%, transparent)",
                        boxShadow:
                          "inset 0 1px 0 0 color-mix(in srgb, #fff 10%, transparent), 0 2px 8px -4px color-mix(in srgb, var(--primary) 40%, transparent)",
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon size={13} className="relative" />
                  <span className="relative">{t.label}</span>
                  <span
                    className="relative rounded-full px-1.5 py-px text-[9px] font-bold"
                    style={{
                      background: active
                        ? "color-mix(in srgb, var(--primary) 14%, transparent)"
                        : "color-mix(in srgb, var(--surface2) 70%, transparent)",
                      color: active ? "var(--primary)" : "var(--muted)",
                    }}
                  >
                    {t.id === "sets" ? filteredLists.length : filteredDhikrs.length}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {filtersActive && (
              <motion.button
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                onClick={() => {
                  setSearchQuery("");
                  setActiveOccasion("all");
                }}
                className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                style={{
                  background: "color-mix(in srgb, var(--danger) 14%, transparent)",
                  color: "var(--danger)",
                }}
              >
                <X size={11} /> Clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Occasion filter pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          <PillButton active={activeOccasion === "all"} onClick={() => setActiveOccasion("all")}>
            All
          </PillButton>
          {Object.entries(OCCASIONS).map(([k, v]) => (
            <PillButton
              key={k}
              active={activeOccasion === k}
              onClick={() => setActiveOccasion(k)}
            >
              {v}
            </PillButton>
          ))}
        </div>
      </div>

      {/* Pinned section — only when no filter */}
      <AnimatePresence>
        {pinnedItems.length > 0 && (
          <motion.section
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={spring}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 pl-1">
              <Pin size={13} className="text-[var(--gold)]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                Pinned
              </h2>
              <span
                className="rounded-full px-1.5 py-px text-[10px] font-bold"
                style={{
                  background: "color-mix(in srgb, var(--gold) 14%, transparent)",
                  color: "var(--gold)",
                }}
              >
                {pinnedItems.length}
              </span>
            </div>
            <motion.div layout className="space-y-2">
              <AnimatePresence initial={false}>
                {pinnedItems.map(({ type, data }) =>
                  type === "list" ? (
                    <ListRow
                      key={`p-${data.id}`}
                      l={data}
                      dById={dById}
                      pinned={pinned}
                      togglePin={togglePin}
                      startList={startList}
                      removeList={removeList}
                    />
                  ) : (
                    <DhikrRow
                      key={`p-${data.id}`}
                      d={data}
                      pinned={pinned}
                      togglePin={togglePin}
                      startDhikr={startDhikr}
                      removeDhikr={removeDhikr}
                      lang={settings.lang}
                    />
                  )
                )}
              </AnimatePresence>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Main content based on tab */}
      <AnimatePresence mode="wait">
        <motion.section
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {tab === "sets" ? (
            <>
              {filteredLists.length === 0 ? (
                <EmptyState
                  icon={FolderHeart}
                  title={filtersActive ? "No sets match" : "No tasbeeh sets yet"}
                  subtitle={
                    filtersActive
                      ? "Try a different category or clear the search."
                      : "Create a set to chain multiple dhikrs into one session."
                  }
                  cta={
                    filtersActive
                      ? { label: "Clear filters", onClick: () => { setSearchQuery(""); setActiveOccasion("all"); } }
                      : { label: "+ Create Set", onClick: () => setModal("list") }
                  }
                />
              ) : (
                <motion.div layout className="space-y-2">
                  <AnimatePresence initial={false}>
                    {filteredLists.map((l) => (
                      <ListRow
                        key={l.id}
                        l={l}
                        dById={dById}
                        pinned={pinned}
                        togglePin={togglePin}
                        startList={startList}
                        removeList={removeList}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </>
          ) : (
            <>
              {filteredDhikrs.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title={filtersActive ? "No dhikrs match" : "No dhikrs available"}
                  subtitle={
                    filtersActive
                      ? "Try a different category or clear the search."
                      : "Add a custom dhikr to expand your library."
                  }
                  cta={
                    filtersActive
                      ? { label: "Clear filters", onClick: () => { setSearchQuery(""); setActiveOccasion("all"); } }
                      : { label: "+ Add Dhikr", onClick: () => setModal("dhikr") }
                  }
                />
              ) : groupedDhikrs ? (
                <div className="space-y-3">
                  {groupedDhikrs.map(([occ, items], idx) => (
                    <OccasionGroup
                      key={occ}
                      occKey={occ}
                      label={OCCASIONS[occ] || occ}
                      items={items}
                      defaultOpen={idx < 2}
                      renderItem={(d) => (
                        <DhikrRow
                          key={d.id}
                          d={d}
                          pinned={pinned}
                          togglePin={togglePin}
                          startDhikr={startDhikr}
                          removeDhikr={removeDhikr}
                          lang={settings.lang}
                        />
                      )}
                    />
                  ))}
                </div>
              ) : (
                <motion.div layout className="space-y-2">
                  <AnimatePresence initial={false}>
                    {filteredDhikrs.map((d) => (
                      <DhikrRow
                        key={d.id}
                        d={d}
                        pinned={pinned}
                        togglePin={togglePin}
                        startDhikr={startDhikr}
                        removeDhikr={removeDhikr}
                        lang={settings.lang}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </>
          )}
        </motion.section>
      </AnimatePresence>
    </div>
  );
};

const PillButton = ({ active, onClick, children }) => (
  <motion.button
    whileTap={{ scale: 0.94 }}
    onClick={onClick}
    className="rounded-full px-3 py-1.5 text-[11px] font-bold whitespace-nowrap border cursor-pointer shrink-0"
    style={
      active
        ? {
          background: "var(--primary)",
          color: "#fff",
          borderColor: "var(--primary)",
          boxShadow: "0 2px 8px -4px color-mix(in srgb, var(--primary) 50%, transparent)",
        }
        : {
          borderColor: "color-mix(in srgb, var(--line) 60%, transparent)",
          color: "var(--muted)",
          background: "color-mix(in srgb, var(--surface) 60%, transparent)",
        }
    }
  >
    {children}
  </motion.button>
);

const EmptyState = ({ icon: Icon, title, subtitle, cta }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center text-center rounded-3xl px-6 py-10 gap-3"
    style={{
      background: "color-mix(in srgb, var(--surface) 50%, transparent)",
      border: "1px dashed color-mix(in srgb, var(--line) 70%, transparent)",
    }}
  >
    <div
      className="flex h-12 w-12 items-center justify-center rounded-2xl"
      style={{
        background: "color-mix(in srgb, var(--primary) 12%, transparent)",
        color: "var(--primary)",
      }}
    >
      <Icon size={22} />
    </div>
    <div>
      <p className="font-display text-base text-[var(--text)]">{title}</p>
      <p className="text-[11px] text-[var(--muted)] mt-1 max-w-[260px]">{subtitle}</p>
    </div>
    {cta && (
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={cta.onClick}
        className="rounded-full px-4 py-1.5 text-xs font-bold text-white cursor-pointer shadow-sm"
        style={{ background: "var(--primary)" }}
      >
        {cta.label}
      </motion.button>
    )}
  </motion.div>
);

export default LibraryView;
