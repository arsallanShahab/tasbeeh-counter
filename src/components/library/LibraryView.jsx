import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Search, X, Pin, Play, Sparkles, ChevronDown, ChevronLeft, Pencil, ArrowRight, FolderPlus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { OCCASIONS, ICONS } from "../../constants/dhikrData";
import { SHELVES, shelfByKey, shelfOfOccasion } from "../../constants/shelves";
import { DAILY_CATS } from "../../constants/dailyDuas";
import { fmt } from "../../utils/stats";
import { PageHeader, SectionHeader, ListGroup, ListRow, IconTile, DhikrTile, EmptyState } from "../common/Layout";
import { Button, IconButton } from "../common/Button";
import { useToast } from "../common/toastContext";
import ItemSheet from "./ItemSheet";
import DailyDuas from "./DailyDuas";
import PinnedList from "./PinnedList";
import DhikrReader from "../counter/DhikrReader";
import ShelfArt from "../common/ShelfArt";

const isCustom = (id) => typeof id === "string" && id.startsWith("c_");
const setTotal = (l) => l.steps.reduce((acc, s) => acc + (Number(s.target) || 0), 0);
const isName = (d) => d.tags?.includes("names-of-allah");
const isDaily = (d) => d.tags?.includes("daily");
const PEEK = 6; // rows shown per group before "Show all"
const SET_PEEK = 4; // set cards shown per group before "Show all"
const durationLabel = (n) => `about ${Math.max(1, Math.round((n * 1.3) / 60))} min`;

/* The Library: a fixed list of shelves organised by purpose, a shelf view
   that groups its items by occasion, and one search across everything. */
export const LibraryView = () => {
  const { dhikrs, lists, pinned, dById, togglePin, startList, startDhikr, openEditor, settings, searchQuery, setSearchQuery, setView } = useApp();
  const toast = useToast();
  const [params, setParams] = useSearchParams();

  // Old links (?tab=, ?occasion=) land on the matching shelf.
  const legacyTab = { mine: "yours", daily: "moments", names: "names" }[params.get("tab")];
  const occParam = params.get("occasion");
  const shelf = shelfByKey(params.get("shelf") || legacyTab || (occParam && shelfOfOccasion(occParam)) || "");
  const sub = params.get("sub") || (occParam && occParam !== "all" ? occParam : "all");

  const openShelf = (key) => {
    setSearchQuery("");
    setParams(() => (key ? new URLSearchParams({ shelf: key }) : new URLSearchParams()));
    window.scrollTo({ top: 0 });
  };
  const setSub = (s) =>
    setParams(
      (prev) => {
        const n = new URLSearchParams(prev);
        n.delete("occasion");
        n.delete("tab");
        if (shelf) n.set("shelf", shelf.key);
        if (s === "all") n.delete("sub");
        else n.set("sub", s);
        return n;
      },
      { replace: true }
    );

  const [expanded, setExpanded] = useState(() => new Set());
  const [item, setItem] = useState(null); // { kind, id }
  const [reading, setReading] = useState(null); // a daily du'a
  const openItem = (kind, id) => setItem({ kind, id });
  const closeItem = useCallback(() => setItem(null), []);

  const onPin = (id, label) => {
    const was = pinned.includes(id);
    togglePin(id);
    toast(was ? `Removed “${label}” from Today` : `Pinned “${label}” to Today`);
  };

  const meaning = (d) => (settings.lang === "ur" ? d.ur || d.en : d.en);
  const plainDhikrs = useMemo(() => dhikrs.filter((d) => !isName(d) && !isDaily(d)), [dhikrs]);

  /* ── Rows ─────────────────────────────────────────────────────────────── */
  const pinBtn = (id, label) => {
    const on = pinned.includes(id);
    return <IconButton icon={Pin} label={on ? `Unpin ${label}` : `Pin ${label} to Today`} pressed={on} size="sm" onClick={() => onPin(id, label)} className={on ? "" : "text-muted"} />;
  };

  const setRow = (l) => {
    const Ico = ICONS[l.icon] || Sparkles;
    const names = l.steps.map((s) => dById(s.dhikr)?.tr).filter(Boolean);
    return (
      <ListRow
        key={`set-${l.id}`}
        leading={<IconTile icon={Ico} tone={isCustom(l.id) ? "accent" : "neutral"} />}
        title={l.name}
        subtitle={names.length ? `Set · ×${fmt(setTotal(l))} · ${names.join(" · ")}` : "Set · no dhikr yet"}
        onClick={() => openItem("list", l.id)}
        ariaLabel={`${l.name}, set, details`}
        trailing={
          <>
            {pinBtn(l.id, l.name)}
            <IconButton icon={Play} label={`Begin ${l.name}`} size="sm" onClick={() => startList(l)} disabled={l.steps.length === 0} />
          </>
        }
      />
    );
  };

  // Same three lines as a pinned row: name, meaning, then count and time.
  const dhikrRow = (d) => (
    <div key={`dhikr-${d.id}`} className="flex items-center gap-1 pr-2">
      <button type="button" onClick={() => openItem("dhikr", d.id)} aria-label={`${d.tr}, details`} className="row-interactive flex min-h-[4.5rem] min-w-0 flex-1 items-center gap-3.5 py-3 pl-4 text-left">
        <DhikrTile />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.9375rem] font-medium text-ink">{d.tr}</span>
          {meaning(d) && <span className="block truncate text-sm text-muted">{meaning(d)}</span>}
          <span className="numerals mt-0.5 block truncate text-[0.8125rem] text-muted">
            ×{fmt(d.target)}
            {d.target >= 20 ? ` · about ${durationLabel(d.target).replace("about ", "")}` : ""}
            {pinned.includes(d.id) ? " · On Today" : ""}
          </span>
        </span>
      </button>
      {pinBtn(d.id, d.tr)}
      <IconButton icon={Play} label={`Begin ${d.tr}`} size="sm" onClick={() => startDhikr(d)} />
    </div>
  );

  const dailyRow = (d) => (
    <ListRow key={`daily-${d.id}`} title={d.moment} subtitle={`${DAILY_CATS[d.cat] || "Du'a"} · ${d.tr}`} chevron onClick={() => setReading(d)} ariaLabel={`Read: ${d.moment}`} />
  );

  const nameRow = (d) => (
    <ListRow
      key={`name-${d.id}`}
      leading={<span className="numerals w-8 text-center font-display text-lg text-muted">{d.id.replace("name_", "")}</span>}
      title={d.tr}
      subtitle={meaning(d)}
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

  const toggle = (id) =>
    setExpanded((x) => {
      const n = new Set(x);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const moreButton = (id, open, total, noun = "") => (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={id}
      onClick={() => toggle(id)}
      className="row-interactive flex min-h-12 w-full items-center justify-center gap-1.5 px-4 text-sm font-medium text-accent"
    >
      {open ? "Show fewer" : `Show all ${total}${noun}`}
      <ChevronDown size={16} aria-hidden="true" className={open ? "rotate-180" : ""} />
    </button>
  );

  // Rows that show the first few and open fully on request.
  const rowList = (id, rows) => {
    const open = expanded.has(id);
    return (
      <ListGroup id={id}>
        {open ? rows : rows.slice(0, PEEK)}
        {rows.length > PEEK && moreButton(id, open, rows.length)}
      </ListGroup>
    );
  };
  const group = (id, title, rows) => (
    <section key={id} aria-labelledby={`g-${id}`} className="space-y-3">
      <SectionHeader id={`g-${id}`} title={title} count={rows.length} />
      {rowList(`gl-${id}`, rows)}
    </section>
  );

  // A ready-made set as a card: what it holds and how long it takes, with Begin.
  const setCard = (l) => {
    const Ico = ICONS[l.icon] || Sparkles;
    const total = setTotal(l);
    const names = l.steps.map((st) => dById(st.dhikr)?.tr).filter(Boolean);
    return (
      <li key={`card-${l.id}`} className="flex min-w-0 flex-col rounded-2xl border border-line bg-surface">
        <button type="button" onClick={() => openItem("list", l.id)} aria-label={`${l.name}, set, details`} className="row-interactive flex min-w-0 flex-1 items-start gap-3.5 rounded-t-2xl p-4 text-left">
          <IconTile icon={Ico} tone={isCustom(l.id) ? "accent" : "neutral"} />
          <span className="min-w-0 flex-1">
            <span className="block text-base leading-snug font-medium text-ink [overflow-wrap:anywhere]">{l.name}</span>
            <span className="numerals mt-0.5 block text-sm text-muted">
              {l.steps.length} dhikr · {fmt(total)} counts{total >= 20 ? ` · ${durationLabel(total)}` : ""}
            </span>
            {names.length > 0 && <span className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-snug text-muted">{names.join(" · ")}</span>}
          </span>
        </button>
        <div className="flex items-center justify-between gap-2 border-t border-line py-1.5 pl-2 pr-2">
          {pinBtn(l.id, l.name)}
          <Button size="sm" icon={Play} onClick={() => startList(l)} disabled={l.steps.length === 0}>
            Begin
          </Button>
        </div>
      </li>
    );
  };

  // One occasion: its ready-made sets first, then its single dhikr.
  const occasionGroup = (id, title, sets, ds) => {
    const setsId = `sets-${id}`;
    const setsOpen = expanded.has(setsId);
    // The two labels only help when a group holds both kinds.
    const both = sets.length > 0 && ds.length > 0;
    return (
      <section key={id} aria-labelledby={`g-${id}`} className="space-y-4">
        <SectionHeader id={`g-${id}`} title={title} count={sets.length + ds.length} />
        {sets.length > 0 && (
          <div className="space-y-2.5">
            {both && <h3 className="eyebrow">Ready-made sets</h3>}
            <ul id={setsId} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {(setsOpen ? sets : sets.slice(0, SET_PEEK)).map(setCard)}
            </ul>
            {sets.length > SET_PEEK && <div className="overflow-hidden rounded-2xl border border-line">{moreButton(setsId, setsOpen, sets.length, " sets")}</div>}
          </div>
        )}
        {ds.length > 0 && (
          <div className="space-y-2.5">
            {both && <h3 className="eyebrow">Single dhikr</h3>}
            {rowList(`gl-${id}`, ds.map(dhikrRow))}
          </div>
        )}
      </section>
    );
  };

  /* ── Counts per shelf ─────────────────────────────────────────────────── */
  const pinnedItems = pinned
    .map((id) => {
      const l = lists.find((x) => x.id === id);
      if (l) return { kind: "list", data: l };
      const d = dhikrs.find((x) => x.id === id);
      return d ? { kind: "dhikr", data: d } : null;
    })
    .filter(Boolean);
  const mySets = lists.filter((l) => isCustom(l.id));
  const myDhikrs = dhikrs.filter((d) => isCustom(d.id) || (d.tags?.includes("custom") && !isName(d)));

  // For an occasion shelf: each set and dhikr under the first occasion of the
  // shelf it belongs to, so nothing repeats in the All view.
  const shelfGroups = (s, only) => {
    const occs = only && only !== "all" ? [only] : s.occasions;
    const seen = new Set();
    return occs
      .map((o) => {
        const sets = lists.filter((l) => !isCustom(l.id) && l.occasion === o);
        const ds = plainDhikrs.filter((d) => d.tags?.includes(o) && (only !== "all" || !seen.has(d.id)));
        ds.forEach((d) => seen.add(d.id));
        return [o, sets, ds];
      })
      .filter(([, a, b]) => a.length + b.length);
  };
  const countOf = (s) => {
    if (s.key === "yours") return pinnedItems.length + mySets.length + myDhikrs.length;
    if (s.key === "moments") return dhikrs.filter(isDaily).length;
    if (s.key === "names") return dhikrs.filter(isName).length;
    return shelfGroups(s, "all").reduce((a, [, x, y]) => a + x.length + y.length, 0);
  };

  /* ── Search across everything ─────────────────────────────────────────── */
  const q = searchQuery.trim().toLowerCase();
  const raw = searchQuery.trim();
  const hit = (...vals) => vals.some((v) => v && String(v).toLowerCase().includes(q));
  const results = q
    ? {
        sets: lists.filter((l) => hit(l.name, OCCASIONS[l.occasion]) || l.steps.some((s) => hit(dById(s.dhikr)?.tr))),
        dhikr: plainDhikrs.filter((d) => hit(d.tr, d.en, d.ur) || d.arabic.includes(raw)),
        daily: dhikrs.filter((d) => isDaily(d) && (hit(d.moment, d.tr, d.en, DAILY_CATS[d.cat]) || d.arabic.includes(raw))),
        names: dhikrs.filter((d) => isName(d) && (hit(d.tr, d.en, d.ur) || d.arabic.includes(raw))),
      }
    : null;
  const resultCount = results ? results.sets.length + results.dhikr.length + results.daily.length + results.names.length : 0;

  /* ── Shelf bodies ─────────────────────────────────────────────────────── */
  const yours = (
    <div className="space-y-10">
      <PinnedList onDetails={openItem} onBrowse={() => openShelf("routine")} />

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

  const namesBody = (
    <div className="space-y-4">
      <button type="button" onClick={() => setView("names")} className="group flex w-full items-center gap-4 rounded-2xl bg-sunken px-5 py-5 text-left">
        <span dir="rtl" lang="ar" className="font-arabic text-3xl leading-none text-ink">
          الله
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-xl text-ink">Reflect on the 99 Names</span>
          <span className="mt-0.5 block text-sm text-muted">One Name at a time, with its meaning and virtue.</span>
        </span>
        <ArrowRight size={18} className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </button>
      <ListGroup>{dhikrs.filter(isName).map(nameRow)}</ListGroup>
    </div>
  );

  const occasionBody = (s) => {
    const all = shelfGroups(s, "all");
    const groups = shelfGroups(s, sub);
    return (
      <div className="space-y-8">
        <div className="scroll-fade-x -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar lg:mx-0 lg:flex-wrap lg:px-0 lg:mask-none" role="group" aria-label={`${s.title}: occasions`}>
          {[["all", "All"], ...all.map(([o]) => [o, OCCASIONS[o] || o])].map(([k, v]) => (
            <button key={k} type="button" className="chip" aria-pressed={sub === k} onClick={() => setSub(k)}>
              {v}
            </button>
          ))}
        </div>
        {groups.length === 0 ? (
          <EmptyState icon={Sparkles} title="Nothing here yet" body="This part of the library is empty for now." />
        ) : (
          groups.map(([o, sets, ds]) => occasionGroup(`${s.key}-${o}`, OCCASIONS[o] || o, sets, ds))
        )}
      </div>
    );
  };

  /* ── Views ────────────────────────────────────────────────────────────── */
  const searchBox = (
    <div className="relative">
      <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search dhikr, sets, du'as, Names"
        aria-label="Search the library"
        className="field-input pl-11 pr-11 [&::-webkit-search-cancel-button]:hidden"
      />
      {searchQuery && (
        <button type="button" onClick={() => setSearchQuery("")} aria-label="Clear search" className="icon-btn absolute right-1.5 top-1/2 h-9 w-9 -translate-y-1/2 text-muted">
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );

  const searchView =
    results &&
    (resultCount === 0 ? (
      <EmptyState
        icon={Search}
        title="Nothing matches"
        body={`No results for “${raw}”. Try a shorter word, or browse the shelves.`}
        action={
          <Button variant="secondary" size="sm" onClick={() => setSearchQuery("")}>
            Clear search
          </Button>
        }
      />
    ) : (
      <div className="space-y-8">
        <p className="numerals text-sm text-muted" aria-live="polite">
          {fmt(resultCount)} {resultCount === 1 ? "result" : "results"} across the library
        </p>
        {results.sets.length > 0 && group("r-sets", "Sets", results.sets.map(setRow))}
        {results.dhikr.length > 0 && group("r-dhikr", "Dhikr", results.dhikr.map(dhikrRow))}
        {results.daily.length > 0 && group("r-daily", "Du'as for daily life", results.daily.map(dailyRow))}
        {results.names.length > 0 && group("r-names", "Names of Allah", results.names.map(nameRow))}
      </div>
    ));

  const shelvesView = (
    <ListGroup>
      {SHELVES.map((s) => (
        <ListRow
          key={s.key}
          leading={<ShelfArt shelf={s.key} size={48} fallback={<IconTile icon={s.icon} tone={s.key === "yours" ? "accent" : "neutral"} size={48} />} />}
          title={s.title}
          subtitle={s.desc}
          meta={fmt(countOf(s))}
          chevron
          onClick={() => openShelf(s.key)}
          ariaLabel={`${s.title}, ${countOf(s)} items`}
        />
      ))}
    </ListGroup>
  );

  const shelfView = shelf && (
    <div className="space-y-6">
      <div>
        <Button variant="link" size="sm" icon={ChevronLeft} className="-ml-3" onClick={() => openShelf(null)}>
          Library
        </Button>
        <h2 className="mt-1 font-display text-[2rem] leading-tight text-ink">{shelf.title}</h2>
        <p className="mt-1 text-[0.9375rem] text-muted">{shelf.desc}</p>
      </div>
      {shelf.key === "yours" ? yours : shelf.key === "moments" ? <DailyDuas /> : shelf.key === "names" ? namesBody : occasionBody(shelf)}
    </div>
  );

  return (
    <div className="space-y-6">
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
      {searchBox}
      <div className="min-w-0">{results ? searchView : shelf ? shelfView : shelvesView}</div>

      <ItemSheet item={item} onClose={closeItem} />
      <DhikrReader open={!!reading} onClose={() => setReading(null)} d={reading} lang={settings.lang} arabicScale={settings.arabicScale ?? 1} textScale={settings.textScale ?? 1} />
    </div>
  );
};

export default LibraryView;
