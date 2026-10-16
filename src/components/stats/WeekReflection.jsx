import { useApp } from "../../context/AppContext";
import { addDays, dayDone, midnight } from "../../utils/adhkar";
import { dateKey, fmt } from "../../utils/stats";
import { Panel } from "../common/Layout";
import { Button } from "../common/Button";

const SALAWAT = /salawat|durood|darood/;

// The past seven days, in numbers and in one sentence.
function weekSummary({ stats, lists, prayer, dById, end = new Date() }) {
  const last = midnight(end);
  const days = Array.from({ length: 7 }, (_, i) => addDays(last, i - 6));
  const before = Array.from({ length: 7 }, (_, i) => addDays(last, i - 13));
  const sum = (ds) => ds.reduce((a, d) => a + (stats.byDate[dateKey(d)] || 0), 0);
  const occasionOf = (id) => lists.find((l) => l.id === id)?.occasion;

  const per = {};
  for (const d of days) for (const [id, n] of Object.entries(stats.dayDhikr?.[dateKey(d)] || {})) per[id] = (per[id] || 0) + n;
  const top = Object.entries(per).sort((a, b) => b[1] - a[1])[0];

  const moments = { morning: 0, evening: 0, salah: 0, sleep: 0 };
  for (const d of days) {
    const { done } = dayDone({ day: d, log: stats.doneLog, manual: stats.adhkarManual, occasionOf, prayer });
    for (const k of Object.keys(done)) moments[k in moments ? k : "salah"] += 1;
  }

  return {
    from: days[0],
    to: last,
    total: sum(days),
    lastWeek: sum(before),
    activeDays: days.filter((d) => (stats.byDate[dateKey(d)] || 0) > 0).length,
    salawat: Object.entries(per).reduce((a, [id, n]) => (SALAWAT.test(id) ? a + n : a), 0),
    top: top ? { name: dById(top[0])?.tr || "a removed dhikr", n: top[1] } : null,
    moments,
    sets: days.reduce((a, d) => a + (stats.doneLog?.[dateKey(d)]?.length || 0), 0),
  };
}

/* "This week: 4 morning adhkar, 1,200 salawat, most recited: Istighfar."
   On Today it appears on Fridays until put away; on Progress it is always there. */
export const WeekReflection = ({ variant = "progress", onDismiss }) => {
  const { stats, lists, settings, dById } = useApp();
  const w = weekSummary({ stats, lists, prayer: settings.prayer, dById });
  if (variant === "today" && w.total === 0) return null;

  const parts = [
    w.moments.morning && `${fmt(w.moments.morning)} morning adhkar`,
    w.moments.evening && `${fmt(w.moments.evening)} evening adhkar`,
    w.moments.salah && `${fmt(w.moments.salah)} after salah`,
    w.salawat && `${fmt(w.salawat)} salawat`,
    w.top && `most recited: ${w.top.name}`,
  ].filter(Boolean);
  const change = w.lastWeek > 0 ? Math.round(((w.total - w.lastWeek) / w.lastWeek) * 100) : null;
  const range = `${w.from.toLocaleDateString(undefined, { day: "numeric", month: "short" })} to ${w.to.toLocaleDateString(undefined, { day: "numeric", month: "short" })}`;

  return (
    <Panel as="section" aria-labelledby={`reflect-${variant}-h`} className="p-5 lg:p-6">
      <p className="eyebrow text-gold">{variant === "today" ? "Jumuʿah reflection" : "This week"} · {range}</p>
      <h2 id={`reflect-${variant}-h`} className="mt-3 font-display text-[1.375rem] leading-snug text-ink">
        {w.total === 0
          ? "Nothing counted this week yet. A few minutes today is a good start."
          : parts.length
            ? `This week: ${parts.join(", ")}.`
            : `This week: ${fmt(w.total)} counts.`}
      </h2>
      {w.total > 0 && (
        <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4">
          <div>
            <dt className="text-[0.8125rem] text-muted">Counts</dt>
            <dd className="numerals mt-0.5 font-display text-xl text-ink">{fmt(w.total)}</dd>
            {change != null && <dd className="numerals text-[0.8125rem] text-muted">{change === 0 ? "Same as last week" : `${change > 0 ? "+" : ""}${change}% on last week`}</dd>}
          </div>
          <div>
            <dt className="text-[0.8125rem] text-muted">Days</dt>
            <dd className="numerals mt-0.5 font-display text-xl text-ink">{w.activeDays} of 7</dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-muted">Sets</dt>
            <dd className="numerals mt-0.5 font-display text-xl text-ink">{fmt(w.sets)}</dd>
          </div>
        </dl>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">May Allah accept it from you.</p>
        {onDismiss && (
          <Button variant="tonal" size="sm" onClick={onDismiss}>
            Done for this week
          </Button>
        )}
      </div>
    </Panel>
  );
};

export default WeekReflection;
