import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus, Search, X, Pin, Play, Sparkles, ChevronDown, ChevronUp, Pencil, ArrowRight, FolderPlus,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { OCCASIONS, ICONS } from "../../constants/dhikrData";
import { fmt } from "../../utils/stats";
import { PageHeader, SectionHeader, ListGroup, ListRow, IconTile, DhikrTile, EmptyState } from "../common/Layout";
import { Button, IconButton } from "../common/Button";
import { Seg } from "../common/Seg";
import { useToast } from "../common/toastContext";
import ItemSheet from "./ItemSheet";
import DailyDuas from "./DailyDuas";

const TABS = [
  { v: "mine", l: "Mine" },
  { v: "sets", l: "Sets" },
  { v: "dhikrs", l: "Dhikr" },
  { v: "names", l: "Names" },
  { v: "daily", l: "Daily" },
];

/* Occasion order for grouping and for the category list. */
const OCC_ORDER = [
  "morning", "evening", "after-salah", "friday", "sleep", "ramadan", "high-reward", "protection",
  "forgiveness", "repentance", "distress", "anxiety", "grief", "gratitude", "guidance", "knowledge",
  "family", "tawheed", "salah", "gathering", "general", "custom",
];
const occRank = (k) => {
  const i = OCC_ORDER.indexOf(k);
  return i === -1 ? 99 : i;
};

const isCustom = (id) => typeof id === "string" && id.startsWith("c_");
const setTotal = (l) => l.steps.reduce((acc, s) => acc + (Number(s.target) || 0), 0);

export const LibraryView = () => {
  const {
    dhikrs, lists, pinned, setPinned, dById, togglePin, startList, startDhikr, openEditor,
    settings, searchQuery, setSearchQuery, activeOccasion, setActiveOccasion, setView,
  } = useApp();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab");
  const tab = TABS.some((t) => t.v === tabParam) ? tabParam : "sets";

  const [reorder, setReorder] = useState(false);
  const [openGroups, setOpenGroups] = useState(() => new Set(["morning", "evening"]));

  const setTab = (v) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (v === "sets") next.delete("tab");
        else next.set("tab", v);
        if (v === "mine") next.delete("occasion");
        return next;
      },
      { replace: true }
    );

  // A category filter only applies to the browse tabs.
  useEffect(() => {
    if (tab === "mine" && activeOccasion !== "all") setTab("sets");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOccasion]);

  // The detail sheet is local state; the Sheet handles the back gesture.
  const [item, setItem] = useState(null); // { kind, id } | null
  const openItem = (kind, id) => setItem({ kind, id });
  const closeItem = useCallback(() => setItem(null), []);

  const onPin = (id, label) => {
    const was = pinned.includes(id);
    togglePin(id);
    toast(was ? `Removed “${label}” from Today` : `Pinned “${label}” to Today`);
  };

  const q = searchQuery.trim().toLowerCase();
  const filtering = q.length > 0 || activeOccasion !== "all";

  const matchText = (d) =>
    !q ||
    d.tr.toLowerCase().includes(q) ||
    (d.en && d.en.toLowerCase().includes(q)) ||
    d.arabic.includes(searchQuery.trim()) ||
    (d.ur && d.ur.includes(searchQuery.trim()));

  const filteredLists = useMemo(
    () =>
      lists.filter((l) => {
        const text =
          !q ||
          l.name.toLowerCase().includes(q) ||
          l.steps.some((s) => dById(s.dhikr)?.tr.toLowerCase().includes(q));
        const occ = activeOccasion === "all" || l.occasion === activeOccasion;
        return text && occ;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lists, q, activeOccasion, dhikrs]
  );

  const filteredDhikrs = useMemo(
    () =>
      dhikrs.filter(
        (d) =>
          !d.tags?.includes("names-of-allah") &&
          !d.tags?.includes("daily") &&
          matchText(d) &&
          (activeOccasion === "all" || d.tags?.includes(activeOccasion))
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dhikrs, q, activeOccasion, searchQuery]
  );

  const filteredNames = useMemo(
    () =>
      dhikrs.filter(
        (d) =>
          d.tags?.includes("names-of-allah") &&
          matchText(d) &&
          (activeOccasion === "all" || d.tags?.includes(activeOccasion))
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dhikrs, q, activeOccasion, searchQuery]
  );

  const groupedDhikrs = useMemo(() => {
    if (filtering) return null;
    const groups = {};
    filteredDhikrs.forEach((d) => {
      const tag = isCustom(d.id) ? "custom" : (d.tags && d.tags.find((t) => OCCASIONS[t] && t !== "custom")) || "general";
      (groups[tag] ||= []).push(d);
    });
    return Object.entries(groups).sort(([a], [b]) => occRank(a) - occRank(b));
  }, [filteredDhikrs, filtering]);

  const pinnedItems = pinned
    .map((id) => {
      const l = lists.find((x) => x.id === id);
      if (l) return { kind: "list", data: l };
      const d = dhikrs.find((x) => x.id === id);
      if (d) return { kind: "dhikr", data: d };
      return null;
    })
    .filter(Boolean);
  const mySets = lists.filter((l) => isCustom(l.id));
  const myDhikrs = dhikrs.filter((d) => isCustom(d.id) || (d.tags?.includes("custom") && !d.tags?.includes("names-of-allah")));

  const movePinned = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= pinned.length) return;
    setPinned((p) => {
      const next = [...p];
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveOccasion("all");
  };

  const categories = Object.entries(OCCASIONS)
    .filter(([k]) => k !== "names-of-allah")
    .sort(([a], [b]) => occRank(a) - occRank(b));

  /* ── Rows ─────────────────────────────────────────────────────────────── */
  const pinBtn = (id, label) => {
    const on = pinned.includes(id);
    return (
      <IconButton
        icon={Pin}
        label={on ? `Unpin ${label}` : `Pin ${label} to Today`}
        pressed={on}
        size="sm"
        onClick={() => onPin(id, label)}
        className={on ? "" : "text-muted"}
      />
    );
  };

  const setRow = (l) => {
    const Ico = ICONS[l.icon] || Sparkles;
    const names = l.steps.map((s) => dById(s.dhikr)?.tr).filter(Boolean);
    return (
      <ListRow
        key={l.id}
        leading={<IconTile icon={Ico} tone={isCustom(l.id) ? "accent" : "neutral"} />}
        title={l.name}
        subtitle={names.length ? `×${fmt(setTotal(l))} · ${names.join(" · ")}` : "No dhikr yet"}
        onClick={() => openItem("list", l.id)}
        ariaLabel={`${l.name}, details`}
        trailing={
          <>
            {pinBtn(l.id, l.name)}
            <IconButton
              icon={Play}
              label={`Begin ${l.name}`}
              size="sm"
              onClick={() => startList(l)}
              disabled={l.steps.length === 0}
            />
          </>
        }
      />
    );
  };

  const dhikrRow = (d) => (
    <ListRow
      key={d.id}
      title={d.tr}
      subtitle={`×${fmt(d.target)}${(settings.lang === "ur" ? d.ur || d.en : d.en) ? ` · ${settings.lang === "ur" ? d.ur || d.en : d.en}` : ""}`}
      onClick={() => openItem("dhikr", d.id)}
      ariaLabel={`${d.tr}, details`}
      trailing={
        <>
          {pinBtn(d.id, d.tr)}
          <IconButton icon={Play} label={`Begin ${d.tr}`} size="sm" onClick={() => startDhikr(d)} />
        </>
      }
    />
  );

  const nameRow = (d) => (
    <ListRow
      key={d.id}
      leading={
        <span className="numerals w-8 text-center font-display text-lg text-muted">{d.id.replace("name_", "")}</span>
      }
      title={d.tr}
      subtitle={settings.lang === "ur" ? d.ur || d.en : d.en}
      onClick={() => openItem("dhikr", d.id)}
      ariaLabel={`${d.tr}, details`}
      trailing={
        <>
          <span dir="rtl" lang="ar" className="mr-2 hidden font-arabic text-xl text-ink sm:inline">
            {d.arabic}
          </span>
          <IconButton icon={Play} label={`Count ${d.tr}`} size="sm" onClick={() => startDhikr(d)} />
        </>
      }
    />
  );

  const noResults = (
    <EmptyState
      icon={Search}
      title="Nothing matches"
      body={q ? `No results for “${searchQuery.trim()}”${activeOccasion !== "all" ? ` in ${OCCASIONS[activeOccasion]}` : ""}.` : "This category is empty in this tab."}
      action={
        <Button variant="secondary" size="sm" onClick={clearFilters}>
          Clear search and filters
        </Button>
      }
    />
  );

  /* ── Tab bodies ───────────────────────────────────────────────────────── */
  const mine = (
    <div className="space-y-10">
      <section aria-labelledby="pinned-h" className="space-y-4">
        <SectionHeader
          id="pinned-h"
          title="Pinned to Today"
          count={pinnedItems.length || null}
          action={
            pinnedItems.length > 1 && (
              <Button variant="link" size="sm" onClick={() => setReorder((v) => !v)} aria-pressed={reorder}>
                {reorder ? "Done" : "Reorder"}
              </Button>
            )
          }
        />
        <p className="-mt-2 text-sm text-muted">These appear on Today, in this order.</p>
        {pinnedItems.length === 0 ? (
          <EmptyState
            icon={Pin}
            title="Nothing pinned yet"
            body="Pin a set or a dhikr you recite every day. Use the pin on any row in Sets or Dhikr."
            action={
              <Button variant="secondary" size="sm" onClick={() => setTab("sets")}>
                Browse sets
              </Button>
            }
          />
        ) : (
          <ListGroup>
            {pinnedItems.map(({ kind, data }, idx) => {
              const isList = kind === "list";
              const label = isList ? data.name : data.tr;
              const Ico = isList ? ICONS[data.icon] || Sparkles : null;
              return (
                <ListRow
                  key={data.id}
                  leading={isList ? <IconTile icon={Ico} /> : <DhikrTile />}
                  title={label}
                  subtitle={isList ? `${data.steps.length} dhikr · ×${fmt(setTotal(data))}` : `×${fmt(data.target)}`}
                  onClick={reorder ? undefined : () => openItem(kind, data.id)}
                  ariaLabel={`${label}, details`}
                  trailing={
                    reorder ? (
                      <>
                        <IconButton icon={ChevronUp} label={`Move ${label} up`} size="sm" disabled={idx === 0} onClick={() => movePinned(idx, -1)} />
                        <IconButton
                          icon={ChevronDown}
                          label={`Move ${label} down`}
                          size="sm"
                          disabled={idx === pinnedItems.length - 1}
                          onClick={() => movePinned(idx, 1)}
                        />
                      </>
                    ) : (
                      pinBtn(data.id, label)
                    )
                  }
                />
              );
            })}
          </ListGroup>
        )}
      </section>

      <section aria-labelledby="created-h" className="space-y-4">
        <SectionHeader id="created-h" title="Made by you" count={mySets.length + myDhikrs.length || null} />
        {mySets.length + myDhikrs.length === 0 ? (
          <EmptyState
            icon={FolderPlus}
            title="Build your own routine"
            body="Combine any dhikr into a set with your own counts, or add a dhikr that isn't in the library. You can also open any built-in set and customise a copy."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button size="sm" icon={Plus} onClick={() => openEditor("list")}>
                  New set
                </Button>
                <Button variant="secondary" size="sm" icon={Plus} onClick={() => openEditor("dhikr")}>
                  New dhikr
                </Button>
              </div>
            }
          />
        ) : (
          <ListGroup>
            {mySets.map((l) => {
              const Ico = ICONS[l.icon] || Sparkles;
              return (
                <ListRow
                  key={l.id}
                  leading={<IconTile icon={Ico} tone="accent" />}
                  title={l.name}
                  subtitle={`Set · ${l.steps.length} dhikr · ×${fmt(setTotal(l))}`}
                  onClick={() => openItem("list", l.id)}
                  ariaLabel={`${l.name}, details`}
                  trailing={
                    <>
                      <IconButton icon={Pencil} label={`Edit ${l.name}`} size="sm" onClick={() => openEditor("list", l.id)} />
                      <IconButton icon={Play} label={`Begin ${l.name}`} size="sm" disabled={l.steps.length === 0} onClick={() => startList(l)} />
                    </>
                  }
                />
              );
            })}
            {myDhikrs.map((d) => (
              <ListRow
                key={d.id}
                leading={<DhikrTile />}
                title={d.tr}
                subtitle={`Dhikr · ×${fmt(d.target)}`}
                onClick={() => openItem("dhikr", d.id)}
                ariaLabel={`${d.tr}, details`}
                trailing={
                  <>
                    <IconButton icon={Pencil} label={`Edit ${d.tr}`} size="sm" onClick={() => openEditor("dhikr", d.id)} />
                    <IconButton icon={Play} label={`Begin ${d.tr}`} size="sm" onClick={() => startDhikr(d)} />
                  </>
                }
              />
            ))}
          </ListGroup>
        )}
      </section>
    </div>
  );

  const sets =
    filteredLists.length === 0 ? (
      noResults
    ) : (
      <ListGroup>
        {filteredLists.map((l) => (
          setRow(l)
        ))}
      </ListGroup>
    );

  const dhikrBody =
    filteredDhikrs.length === 0 ? (
      noResults
    ) : groupedDhikrs ? (
      <div className="space-y-3">
        {groupedDhikrs.map(([occ, items]) => {
          const open = openGroups.has(occ);
          const panelId = `grp-${occ}`;
          return (
            <section key={occ}>
              <h2>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() =>
                    setOpenGroups((s) => {
                      const next = new Set(s);
                      next.has(occ) ? next.delete(occ) : next.add(occ);
                      return next;
                    })
                  }
                  className="flex h-12 w-full items-center justify-between gap-3 border-b border-line text-left"
                >
                  <span className="font-display text-lg text-ink">
                    {OCCASIONS[occ] || occ}
                    <span className="numerals ml-2 font-body text-sm text-muted">{items.length}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              </h2>
              {open && (
                <ListGroup id={panelId} className="mt-3">
                  {items.map((d) => (
                    dhikrRow(d)
                  ))}
                </ListGroup>
              )}
            </section>
          );
        })}
      </div>
    ) : (
      <ListGroup>
        {filteredDhikrs.map((d) => (
          dhikrRow(d)
        ))}
      </ListGroup>
    );

  const names = (
    <div className="space-y-4">
      {!filtering && (
        <button
          type="button"
          onClick={() => setView("names")}
          className="group flex w-full items-center gap-4 rounded-2xl bg-sunken px-5 py-5 text-left"
        >
          <span dir="rtl" lang="ar" className="font-arabic text-3xl leading-none text-ink">
            الله
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-xl text-ink">Reflect on the 99 Names</span>
            <span className="mt-0.5 block text-sm text-muted">One Name at a time, with its meaning and virtue.</span>
          </span>
          <ArrowRight size={18} className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      )}
      {filteredNames.length === 0 ? (
        noResults
      ) : (
        <ListGroup>
          {filteredNames.map((d) => (
            nameRow(d)
          ))}
        </ListGroup>
      )}
    </div>
  );

  const counts = { mine: null, sets: filteredLists.length, dhikrs: filteredDhikrs.length, names: filteredNames.length };

  /* ── Layout ───────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-8">
      <PageHeader
        title="Library"
        actions={
          <>
            <Button variant="secondary" size="sm" icon={Plus} onClick={() => openEditor("dhikr")} aria-label="New dhikr">
              Dhikr
            </Button>
            <Button size="sm" icon={Plus} onClick={() => openEditor("list")} aria-label="New set">
              Set
            </Button>
          </>
        }
      />

      <div className="space-y-4">
        <Seg
          label="Library section"
          value={tab}
          onChange={setTab}
          options={TABS.map((t) => ({ ...t, l: counts[t.v] != null && filtering ? `${t.l} ${counts[t.v]}` : t.l }))}
        />

        {tab !== "mine" && (
          <div className="relative">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tab === "names" ? "Search the 99 Names" : tab === "daily" ? "Search: travel, rain, eating…" : "Search by name, meaning or Arabic"}
              aria-label="Search the library"
              className="field-input pl-11 pr-11 [&::-webkit-search-cancel-button]:hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="icon-btn absolute right-1.5 top-1/2 h-9 w-9 -translate-y-1/2 text-muted"
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className={tab !== "mine" && tab !== "daily" ? "lg:grid lg:grid-cols-[12rem_minmax(0,1fr)] lg:items-start lg:gap-10" : ""}>
        {tab !== "mine" && tab !== "daily" && (
          <>
            {/* Desktop: category index in its own column. */}
            <nav aria-label="Categories" className="hidden lg:sticky lg:top-12 lg:block">
              <p className="eyebrow mb-3">Categories</p>
              <ul className="space-y-0.5">
                {[["all", "All"], ...categories].map(([k, v]) => {
                  const on = activeOccasion === k;
                  return (
                    <li key={k}>
                      <button
                        type="button"
                        onClick={() => setActiveOccasion(k)}
                        aria-current={on ? "true" : undefined}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          on ? "bg-sunken font-semibold text-ink" : "text-muted hover:text-ink"
                        }`}
                      >
                        {v}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Phone: one scrolling strip of category chips. */}
            <div className="scroll-fade-x -mx-5 mb-6 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar lg:hidden" role="group" aria-label="Categories">
              {[["all", "All"], ...categories].map(([k, v]) => (
                <button key={k} type="button" className="chip" aria-pressed={activeOccasion === k} onClick={() => setActiveOccasion(k)}>
                  {v}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="min-w-0">
          {filtering && tab !== "mine" && tab !== "daily" && (
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="numerals text-sm text-muted" aria-live="polite">
                {fmt(counts[tab])} {counts[tab] === 1 ? "result" : "results"}
                {activeOccasion !== "all" && ` in ${OCCASIONS[activeOccasion]}`}
              </p>
              <Button variant="link" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          )}
          {tab === "mine" ? mine : tab === "sets" ? sets : tab === "dhikrs" ? dhikrBody : tab === "daily" ? <DailyDuas query={searchQuery} /> : names}
        </div>
      </div>

      <ItemSheet item={item} onClose={closeItem} />
    </div>
  );
};

export default LibraryView;
