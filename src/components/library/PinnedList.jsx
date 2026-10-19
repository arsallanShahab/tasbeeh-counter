import { shortTr } from "../../utils/dhikrName";
import { useMemo, useState } from "react";
import { Reorder, useDragControls } from "motion/react";
import { ArrowDownToLine, ArrowUpToLine, Check, ChevronDown, ChevronUp, Ellipsis, GripVertical, Info, Pencil, Pin, Play, Search, SquareCheck, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { shelfOfItem } from "../../constants/shelves";
import { fmt } from "../../utils/stats";
import { midnight } from "../../utils/adhkar";
import { EmptyState, SectionHeader } from "../common/Layout";
import { Button, IconButton } from "../common/Button";
import { Sheet } from "../common/Modal";
import { useToast } from "../common/toastContext";
import ShelfArt from "../common/ShelfArt";

const SEARCH_FROM = 8; // search and filters appear past this many pins
const STALE_DAYS = 14;
const isCustom = (id) => typeof id === "string" && id.startsWith("c_");
const setTotal = (l) => l.steps.reduce((a, s) => a + (Number(s.target) || 0), 0);
const minutes = (n) => Math.max(1, Math.round((n * 1.3) / 60));


const daysSince = (t) => (t ? Math.round((midnight(new Date()) - midnight(new Date(t))) / 864e5) : null);
const statusOf = (last) => {
  const d = daysSince(last);
  if (d == null) return { text: "Not recited yet", done: false, stale: true };
  if (d <= 0) return { text: "Done today", done: true, stale: false };
  const text = d === 1 ? "Last: yesterday" : d < 7 ? `Last: ${d} days ago` : d < 30 ? `Last: ${Math.floor(d / 7)} wk ago` : "Last: over a month ago";
  return { text, done: false, stale: d >= STALE_DAYS };
};

/* Pinned to Today: one list in your order (it is Today's order), each row
   saying what it is, how long it takes and whether it is done. Drag to
   reorder; search, filters and multi-select appear once the list is long. */
export const PinnedList = ({ onDetails, onBrowse }) => {
  const { pinned, setPinned, lists, dhikrs, dById, startList, startDhikr, stats, settings, openEditor } = useApp();
  const toast = useToast();
  const [mode, setMode] = useState("view"); // view | reorder | select
  const [picked, setPicked] = useState(() => new Set());
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all | todo | stale
  const [menu, setMenu] = useState(null); // item whose actions are open
  const [organise, setOrganise] = useState(false);

  const items = useMemo(
    () =>
      pinned
        .map((id) => {
          const l = lists.find((x) => x.id === id);
          const d = !l && dhikrs.find((x) => x.id === id);
          const kind = l ? "list" : d ? "dhikr" : null;
          if (!kind) return null;
          const data = l || d;
          const total = l ? setTotal(l) : d.target || 0;
          const meaning = settings.lang === "ur" ? d?.ur || d?.en : d?.en;
          return {
            id,
            kind,
            data,
            title: l ? l.name : shortTr(d),
            desc: l ? l.steps.map((s) => dById(s.dhikr)?.tr).filter(Boolean).join(" · ") || "No dhikr yet" : meaning || "",
            meta: l ? `${l.steps.length}\u00a0${l.steps.length === 1 ? "dhikr" : "dhikrs"}` : `×${fmt(total)}`,
            mins: minutes(total),
            total,
            status: statusOf(stats.completed?.[id]?.last),
          };
        })
        .filter(Boolean),
    [pinned, lists, dhikrs, dById, stats.completed, settings.lang]
  );

  const long = items.length > SEARCH_FROM;
  const q = query.trim().toLowerCase();
  const shown = items.filter(
    (it) =>
      (filter === "all" || (filter === "todo" ? !it.status.done : it.status.stale)) &&
      (!q || [it.title, it.desc].some((v) => v.toLowerCase().includes(q)))
  );
  const totalMins = items.reduce((a, it) => a + it.mins, 0);
  const doneToday = items.filter((it) => it.status.done).length;

  const begin = (it) => (it.kind === "list" ? startList(it.data) : startDhikr(it.data));
  const move = (id, to) => setPinned((p) => (to === "top" ? [id, ...p.filter((x) => x !== id)] : [...p.filter((x) => x !== id), id]));
  const step = (idx, dir) =>
    setPinned((p) => {
      const j = idx + dir;
      if (j < 0 || j >= p.length) return p;
      const n = [...p];
      [n[idx], n[j]] = [n[j], n[idx]];
      return n;
    });
  const unpin = (ids) => {
    const before = pinned;
    setPinned((p) => p.filter((x) => !ids.includes(x)));
    toast(ids.length === 1 ? "Removed from Today" : `Removed ${ids.length} from Today`, { action: { label: "Undo", onClick: () => setPinned(before) } });
  };
  const exitModes = () => {
    setMode("view");
    setPicked(new Set());
  };

  const body = (it) => (
    <>
      <ShelfArt shelf={shelfOfItem(it.kind, it.data)} size={40} />
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-[0.9375rem] font-medium leading-snug text-ink [overflow-wrap:anywhere]">{it.title}</span>
        {/* Status first: it is what a review is for. Wraps rather than cuts. */}
        <span className="numerals mt-0.5 line-clamp-2 text-[0.8125rem] leading-snug text-muted">
          <span className={it.status.done ? "font-medium text-accent" : ""}>
            {it.status.done && <Check size={13} strokeWidth={2.5} className="-mt-0.5 mr-1 inline" aria-hidden="true" />}
            {it.status.text}
          </span>
          {` · ${it.meta}${it.total >= 20 ? ` · ${it.mins}\u00a0min` : ""}`}
        </span>
      </span>
    </>
  );

  return (
    <section aria-labelledby="pinned-h" className="space-y-4">
      <SectionHeader
        id="pinned-h"
        title="Pinned to Today"
        action={
          items.length > 1 &&
          (mode === "view" ? (
            <Button variant="link" size="sm" onClick={() => setOrganise(true)} aria-haspopup="dialog">
              Organise
            </Button>
          ) : (
            <Button variant="link" size="sm" icon={Check} onClick={exitModes}>
              Done
            </Button>
          ))
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Pin}
          title="Nothing pinned yet"
          body="Pin a set or a dhikr you recite every day and it waits for you on Today."
          action={
            <Button variant="secondary" size="sm" onClick={onBrowse}>
              Browse the daily routine
            </Button>
          }
        />
      ) : (
        <>
          <p className="numerals -mt-2 text-sm text-muted">
            {mode === "reorder"
              ? "Drag the handle, or use the arrows. This is the order on Today."
              : mode === "select"
                ? `${picked.size} selected`
                : `${items.length} pinned · ${doneToday} done today · about ${totalMins}\u00a0min`}
          </p>

          {long && mode !== "reorder" && (
            <div className="space-y-3">
              <div className="relative">
                <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Find in your ${items.length}`}
                  aria-label="Find in pinned"
                  className="field-input pl-11 pr-11 [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                  <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="icon-btn absolute right-1.5 top-1/2 h-9 w-9 -translate-y-1/2 text-muted">
                    <X size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter pinned">
                {[
                  ["all", "All"],
                  ["todo", "Not done today"],
                  ["stale", "Not in 2 weeks"],
                ].map(([k, l]) => (
                  <button key={k} type="button" className="chip" aria-pressed={filter === k} onClick={() => setFilter(k)}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === "select" && (
            <div className="-mt-2 flex flex-wrap items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPicked(new Set(shown.map((i) => i.id)))}>
                Select all{shown.length !== items.length ? ` ${shown.length}` : ""}
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={!picked.size}
                onClick={() => {
                  unpin([...picked]);
                  exitModes();
                }}
              >
                Unpin {picked.size || ""}
              </Button>
            </div>
          )}

          {mode === "reorder" ? (
            <Reorder.Group as="ol" axis="y" values={pinned} onReorder={setPinned} className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
              {items.map((it, idx) => (
                <ReorderRow key={it.id} it={it} idx={idx} count={items.length} onStep={step}>
                  {body(it)}
                </ReorderRow>
              ))}
            </Reorder.Group>
          ) : shown.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line px-5 py-6 text-center text-[0.9375rem] text-muted">
              {q ? `Nothing pinned matches “${query.trim()}”.` : filter === "todo" ? "Everything pinned is done today. Alhamdulillah." : "Nothing has gone unrecited for two weeks."}
            </p>
          ) : (
            <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
              {shown.map((it) => {
                const on = picked.has(it.id);
                return (
                  <li key={it.id} className="flex items-center gap-1 pr-2">
                    {mode === "select" ? (
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={on}
                        onClick={() =>
                          setPicked((s) => {
                            const n = new Set(s);
                            n.has(it.id) ? n.delete(it.id) : n.add(it.id);
                            return n;
                          })
                        }
                        className="row-interactive flex min-h-[4.5rem] min-w-0 flex-1 items-center gap-3 py-3 pl-3 text-left"
                      >
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-[1.5px] ${on ? "border-accent bg-accent text-on-accent" : "border-line-strong"}`} aria-hidden="true">
                          {on && <Check size={14} strokeWidth={3} />}
                        </span>
                        {body(it)}
                      </button>
                    ) : (
                      <>
                        <button type="button" onClick={() => onDetails(it.kind, it.id)} aria-label={`${it.title}, details`} className="row-interactive flex min-h-[4.5rem] min-w-0 flex-1 items-center gap-3 py-3 pl-3 text-left">
                          {body(it)}
                        </button>
                        <IconButton icon={Play} label={`Begin ${it.title}`} size="sm" onClick={() => begin(it)} />
                        <IconButton icon={Ellipsis} label={`More for ${it.title}`} size="sm" onClick={() => setMenu(it)} />
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </>
      )}

      {/* Row actions: the menu keeps Unpin a deliberate choice. */}
      <Sheet open={organise} onClose={() => setOrganise(false)} size="sm" title="Organise pinned">
        <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
          {[
            { icon: GripVertical, label: "Reorder", hint: "Change the order they appear on Today", to: "reorder" },
            { icon: SquareCheck, label: "Select several", hint: "Unpin more than one at a time", to: "select" },
          ].map((o) => (
            <button
              key={o.to}
              type="button"
              onClick={() => {
                setOrganise(false);
                setMode(o.to);
              }}
              className="row-interactive flex min-h-[3.75rem] w-full items-center gap-3 px-4 py-3 text-left"
            >
              <o.icon size={18} className="shrink-0 text-muted" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-[0.9375rem] font-medium text-ink">{o.label}</span>
                <span className="mt-0.5 block text-sm leading-snug text-muted">{o.hint}</span>
              </span>
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={!!menu} onClose={() => setMenu(null)} size="sm" title={menu?.title || ""} description={menu ? `${menu.meta} · ${menu.status.text}` : ""}>
        {menu && (
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
            {[
              { icon: Play, label: "Begin", run: () => begin(menu) },
              { icon: ArrowUpToLine, label: "Move to top", run: () => move(menu.id, "top"), hide: pinned[0] === menu.id },
              { icon: ArrowDownToLine, label: "Move to bottom", run: () => move(menu.id, "bottom"), hide: pinned[pinned.length - 1] === menu.id },
              isCustom(menu.id)
                ? { icon: Pencil, label: "Edit", run: () => openEditor(menu.kind === "list" ? "list" : "dhikr", menu.id) }
                : { icon: Info, label: "Details", run: () => onDetails(menu.kind, menu.id) },
              { icon: Pin, label: "Unpin from Today", run: () => unpin([menu.id]), danger: true },
            ]
              .filter((a) => !a.hide)
              .map((a) => (
                <li key={a.label}>
                  <button
                    type="button"
                    onClick={() => {
                      setMenu(null);
                      a.run();
                    }}
                    className={`row-interactive flex min-h-12 w-full items-center gap-3 px-4 text-left text-[0.9375rem] font-medium ${a.danger ? "text-danger" : "text-ink"}`}
                  >
                    <a.icon size={18} aria-hidden="true" />
                    {a.label}
                  </button>
                </li>
              ))}
          </ul>
        )}
      </Sheet>
    </section>
  );
};

// One draggable row: the grip starts a drag; the arrows do the same by keys.
const ReorderRow = ({ it, idx, count, onStep, children }) => {
  const controls = useDragControls();
  return (
    <Reorder.Item value={it.id} dragListener={false} dragControls={controls} className="flex items-center gap-1 bg-surface pr-2" whileDrag={{ scale: 1.02, boxShadow: "var(--shadow-float)", zIndex: 1 }}>
      <button
        type="button"
        aria-label={`Drag to move ${it.title}`}
        onPointerDown={(e) => controls.start(e)}
        className="flex h-[4.5rem] w-10 shrink-0 cursor-grab items-center justify-center text-muted active:cursor-grabbing"
        style={{ touchAction: "none" }}
        tabIndex={-1}
      >
        <GripVertical size={18} aria-hidden="true" />
      </button>
      <span className="flex min-w-0 flex-1 items-center gap-3 py-3">{children}</span>
      <IconButton icon={ChevronUp} label={`Move ${it.title} up`} size="sm" disabled={idx === 0} onClick={() => onStep(idx, -1)} />
      <IconButton icon={ChevronDown} label={`Move ${it.title} down`} size="sm" disabled={idx === count - 1} onClick={() => onStep(idx, 1)} />
    </Reorder.Item>
  );
};

export default PinnedList;
