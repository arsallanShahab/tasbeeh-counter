import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DEFAULT_SLOTS, SLOTS, addDays, dayDone, midnight } from "../../utils/adhkar";
import { dateKey, fmt } from "../../utils/stats";
import { SectionHeader } from "../common/Layout";
import { IconButton } from "../common/Button";
import Seg from "../common/Seg";

const SHADES = ["28%", "50%", "74%", "100%"];
const bg = (lv) => (lv === 0 ? "var(--surface2)" : `color-mix(in srgb, var(--primary) ${SHADES[lv - 1]}, var(--surface2))`);
const levelOf = (r) => (r <= 0 ? 0 : r < 0.25 ? 1 : r < 0.5 ? 2 : r < 1 ? 3 : 4);

/* Twelve months as small calendars, so a year fits a phone without sideways
   scrolling. Colour by counts against the daily goal, or by adhkar ticked. Each
   day is small, so the day can also be moved with the arrows below or the keys. */
export const YearCalendar = () => {
  const { stats, settings, lists } = useApp();
  const [mode, setMode] = useState("counts");
  const today = midnight(new Date());
  const todayKey = dateKey(today);
  const [sel, setSel] = useState(todayKey);
  const cells = useRef({});

  const goal = settings.dailyGoal || 100;
  const prayer = settings.prayer;
  const enabled = settings.adhkarSlots?.length ? settings.adhkarSlots : DEFAULT_SLOTS;
  const start = new Date(today.getFullYear(), today.getMonth() - 11, 1);
  const months = Array.from({ length: 12 }, (_, i) => new Date(start.getFullYear(), start.getMonth() + i, 1));

  const occasionOf = useMemo(() => {
    const m = Object.fromEntries(lists.map((l) => [l.id, l.occasion]));
    return (id) => m[id];
  }, [lists]);

  // Ticked adhkar per day, worked out only when that view is open.
  const adhkar = useMemo(() => {
    if (mode !== "adhkar") return null;
    const end = midnight(new Date());
    const out = {};
    for (let d = new Date(end.getFullYear(), end.getMonth() - 11, 1); d <= end; d = addDays(d, 1)) {
      out[dateKey(d)] = dayDone({ day: d, log: stats.doneLog, manual: stats.adhkarManual, occasionOf, prayer }).done;
    }
    return out;
  }, [mode, stats.doneLog, stats.adhkarManual, occasionOf, prayer]);

  const adhkarCount = (k) => enabled.filter((s) => adhkar?.[k]?.[s]).length;
  const level = (k) => (mode === "adhkar" ? levelOf(adhkarCount(k) / enabled.length) : levelOf((stats.byDate[k] || 0) / goal));

  const selDate = new Date(`${sel}T12:00:00`);
  const move = (n) => {
    const d = addDays(selDate, n);
    if (d < start || d > today) return;
    const k = dateKey(d);
    setSel(k);
    requestAnimationFrame(() => cells.current[k]?.focus());
  };
  const onKey = (e) => {
    const n = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (n) {
      e.preventDefault();
      move(n);
    }
  };

  const selDone = dayDone({ day: midnight(selDate), log: stats.doneLog, manual: stats.adhkarManual, occasionOf, prayer }).done;
  const selSlots = SLOTS.filter((s) => enabled.includes(s.key) && selDone[s.key]);
  const selSets = Object.entries(
    (stats.doneLog?.[sel] || []).reduce((acc, e) => ({ ...acc, [e.id]: (acc[e.id] || 0) + 1 }), {})
  ).map(([id, n]) => ({ name: lists.find((l) => l.id === id)?.name || "Single dhikr", n }));
  const selCount = stats.byDate[sel] || 0;
  const activeDays = Object.keys(stats.byDate).filter((k) => k >= dateKey(start) && stats.byDate[k] > 0).length;

  return (
    <section aria-labelledby="year-h" className="space-y-5">
      <SectionHeader id="year-h" title="Your year" count={`${fmt(activeDays)} active ${activeDays === 1 ? "day" : "days"}`} />
      <Seg
        label="Colour days by"
        size="sm"
        value={mode}
        onChange={setMode}
        options={[
          { v: "counts", l: "Counts" },
          { v: "adhkar", l: "Adhkar" },
        ]}
        className="max-w-xs"
      />

      <div className="grid grid-cols-3 gap-x-4 gap-y-5 sm:grid-cols-4 lg:grid-cols-6" role="group" aria-label="Your year, one cell per day. Arrow keys move between days." onKeyDown={onKey}>
        {months.map((m) => {
          const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
          return (
            <div key={m.getTime()} className="min-w-0">
              <p className="mb-1.5 text-[0.8125rem] font-medium text-muted" aria-hidden="true">
                {m.toLocaleDateString(undefined, { month: "short" })}
                {m.getMonth() === 0 && ` ${m.getFullYear()}`}
              </p>
              <div className="grid grid-cols-7 gap-[3px]">
                {Array.from({ length: m.getDay() }).map((_, i) => (
                  <span key={`b${i}`} aria-hidden="true" />
                ))}
                {Array.from({ length: days }).map((_, i) => {
                  const d = new Date(m.getFullYear(), m.getMonth(), i + 1);
                  const k = dateKey(d);
                  if (d > today) return <span key={k} aria-hidden="true" className="aspect-square rounded-[3px] border border-line opacity-50" />;
                  const on = k === sel;
                  return (
                    <button
                      key={k}
                      ref={(el) => (cells.current[k] = el)}
                      type="button"
                      aria-pressed={on}
                      aria-current={k === todayKey ? "date" : undefined}
                      tabIndex={on ? 0 : -1}
                      aria-label={`${d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}: ${fmt(stats.byDate[k] || 0)} counts`}
                      onClick={() => setSel(k)}
                      className={`aspect-square rounded-[3px] outline-offset-1 ${on ? "outline-2 outline-ink" : k === todayKey ? "outline-1 outline-accent" : ""}`}
                      style={{ background: bg(level(k)), outlineStyle: on || k === todayKey ? "solid" : undefined }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-1 text-[0.8125rem] text-muted" aria-hidden="true">
        Less
        {[0, 1, 2, 3, 4].map((lv) => (
          <span key={lv} className="h-3 w-3 rounded-[3px]" style={{ background: bg(lv) }} />
        ))}
        {mode === "adhkar" ? "All adhkar" : "Goal met"}
      </div>

      {/* The chosen day, with arrows as a larger way to move between days. */}
      <div className="rounded-2xl border border-line bg-surface p-4" aria-live="polite">
        <div className="flex items-center gap-2">
          <IconButton icon={ChevronLeft} label="Previous day" size="sm" disabled={selDate <= start} onClick={() => move(-1)} />
          <p className="min-w-0 flex-1 text-center font-display text-lg text-ink">
            {sel === todayKey ? "Today" : selDate.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <IconButton icon={ChevronRight} label="Next day" size="sm" disabled={sel === todayKey} onClick={() => move(1)} />
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-3">
          <div>
            <dt className="text-[0.8125rem] text-muted">Counts</dt>
            <dd className="numerals mt-0.5 font-display text-xl text-ink">{fmt(selCount)}</dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-muted">Adhkar</dt>
            <dd className="numerals mt-0.5 font-display text-xl text-ink">
              {selSlots.length} of {enabled.length}
            </dd>
          </div>
        </dl>
        {(selSlots.length > 0 || selSets.length > 0) && (
          <div className="mt-3 space-y-2">
            {selSlots.length > 0 && <p className="text-sm text-ink">{selSlots.map((s) => s.label).join(" · ")}</p>}
            {selSets.length > 0 && (
              <p className="text-sm text-muted">
                Finished: {selSets.map((s) => (s.n > 1 ? `${s.name} ×${s.n}` : s.name)).join(", ")}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default YearCalendar;
