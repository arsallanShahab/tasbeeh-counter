import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Minus, Pencil, Flame } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PageHeader, SectionHeader, Panel, ProgressBar, EmptyState } from "../common/Layout";
import { Button } from "../common/Button";
import { TextInput } from "../common/Field";
import {
  fmt, computeStreak, bestStreak, last7, lastN, dateKey, activeDayCount, avgPerActiveDay,
  yesterdayCount, weekTotal, nextMilestone, prevMilestone,
} from "../../utils/stats";

const Delta = ({ today, yest }) => {
  if (yest === 0 && today === 0) return null;
  const diff = today - yest;
  const Icon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus;
  const text = diff === 0 ? "Same as yesterday" : `${diff > 0 ? "+" : ""}${fmt(diff)} on yesterday`;
  return (
    <p className="numerals flex items-center gap-1.5 text-sm text-muted">
      <Icon size={15} aria-hidden="true" />
      {text}
    </p>
  );
};

const GoalEditor = ({ value, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  if (!editing) {
    return (
      <Button
        variant="link"
        size="sm"
        icon={Pencil}
        onClick={() => {
          setDraft(String(value));
          setEditing(true);
        }}
        className="-ml-2"
      >
        Change daily goal
      </Button>
    );
  }
  const save = (e) => {
    e.preventDefault();
    const v = Math.max(1, Math.round(Number(draft) || 0));
    onChange(v);
    setEditing(false);
  };
  return (
    <form onSubmit={save} className="flex items-center gap-2">
      <TextInput
        type="number"
        min={1}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        autoFocus
        aria-label="Daily goal"
        onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
        className="numerals h-10 w-28"
      />
      <Button type="submit" size="sm">
        Save
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
        Cancel
      </Button>
    </form>
  );
};

const Figure = ({ label, value, note }) => (
  <div className="py-4">
    <dt className="text-sm text-muted">{label}</dt>
    <dd className="numerals mt-1 font-display text-[2rem] leading-none text-ink">{value}</dd>
    {note && <dd className="mt-1.5 text-[0.8125rem] text-muted">{note}</dd>}
  </div>
);

/* Twelve weeks, one cell per day. Intensity is a single ink, so it reads in
   any theme and needs no legend of colours: the legend is the scale. */
const Heatmap = ({ byDate }) => {
  const cells = lastN(byDate, 84);
  const max = Math.max(1, ...cells.map((c) => c.count));
  const level = (n) => (n <= 0 ? 0 : Math.min(4, Math.ceil((n / max) * 4)));
  const shade = ["var(--surface2)", "28%", "50%", "74%", "100%"];
  const bg = (lv) => (lv === 0 ? shade[0] : `color-mix(in srgb, var(--primary) ${shade[lv]}, var(--surface2))`);
  const weeks = [];
  for (let i = 0; i < 12; i++) weeks.push(cells.slice(i * 7, i * 7 + 7));
  const activeDays = cells.filter((c) => c.count > 0).length;

  return (
    <div>
      <div
        className="grid grid-flow-col grid-rows-7 gap-1"
        style={{ gridTemplateColumns: "repeat(12, minmax(0, 1fr))" }}
        role="img"
        aria-label={`Activity over the last 12 weeks: ${activeDays} active days.`}
      >
        {weeks.flat().map((day) => (
          <span
            key={day.key}
            title={`${day.date.toLocaleDateString(undefined, { day: "numeric", month: "short" })}: ${fmt(day.count)}`}
            className="aspect-square rounded-[3px]"
            style={{ background: bg(level(day.count)) }}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[0.8125rem] text-muted" aria-hidden="true">
        <span>12 weeks ago</span>
        <span className="flex items-center gap-1">
          Less
          {[0, 1, 2, 3, 4].map((lv) => (
            <span key={lv} className="h-3 w-3 rounded-[3px]" style={{ background: bg(lv) }} />
          ))}
          More
        </span>
      </div>
    </div>
  );
};

export const StatsView = () => {
  const { stats, dById, settings, setSettings, lists, startList, setView } = useApp();

  const goal = settings.dailyGoal || 100;
  const today = stats.byDate[dateKey()] || 0;
  const yest = yesterdayCount(stats.byDate);
  const streak = computeStreak(stats.byDate);
  const best = bestStreak(stats.byDate);
  const week = last7(stats.byDate);
  const wTotal = weekTotal(stats.byDate);
  const activeDays = activeDayCount(stats.byDate);
  const avg = avgPerActiveDay(stats.total, stats.byDate);
  const next = nextMilestone(stats.total);
  const prev = prevMilestone(stats.total);
  const todayKey = dateKey();

  const weekMax = useMemo(() => Math.max(1, ...week.map((w) => w.count)), [week]);
  const top = useMemo(() => Object.entries(stats.perDhikr).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 6), [stats.perDhikr]);
  const reached = today >= goal && goal > 0;

  if (stats.total === 0) {
    const first = lists.find((l) => l.id === "after-salah") || lists[0];
    return (
      <div className="space-y-8">
        <PageHeader title="Progress" />
        <EmptyState
          icon={Flame}
          title="Your progress starts with one count"
          body="Each dhikr you recite is counted here: today against your goal, your streak of days, and what you recite most."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {first && <Button onClick={() => startList(first)}>Begin {first.name}</Button>}
              <Button variant="secondary" onClick={() => setView("library")}>
                Browse the library
              </Button>
            </div>
          }
          className="py-16"
        />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <PageHeader title="Progress" />

      {/* Lead: today against the goal */}
      <section aria-labelledby="today-h" className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
        <div>
          <h2 id="today-h" className="eyebrow">
            Today
          </h2>
          <p className="numerals mt-3 font-display text-[5rem] leading-[0.9] text-ink lg:text-[6.5rem]">{fmt(today)}</p>
          <p className="numerals mt-3 text-[0.9375rem] text-muted">
            {reached ? `Goal of ${fmt(goal)} complete. Alhamdulillah.` : `${fmt(Math.max(0, goal - today))} to go to your goal of ${fmt(goal)}`}
          </p>
          <ProgressBar value={today} max={goal} label="Today's goal" tone={reached ? "gold" : "accent"} className="mt-5" />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <Delta today={today} yest={yest} />
            <GoalEditor value={goal} onChange={(v) => setSettings((s) => ({ ...s, dailyGoal: v }))} />
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-2 divide-x divide-line border-y border-line lg:mt-0">
          <div className="pr-4">
            <Figure label="Current streak" value={`${streak} ${streak === 1 ? "day" : "days"}`} note={best > streak ? `Best ${best} days` : streak > 0 ? "Your best yet" : "Count today to begin one"} />
          </div>
          <div className="pl-5">
            <Figure label="This week" value={fmt(wTotal)} />
          </div>
          <div className="col-span-2 grid grid-cols-2 divide-x divide-line border-t border-line">
            <div className="pr-4">
              <Figure label="All time" value={fmt(stats.total)} />
            </div>
            <div className="pl-5">
              <Figure label="Daily average" value={fmt(avg)} note={`Over ${fmt(activeDays)} active ${activeDays === 1 ? "day" : "days"}`} />
            </div>
          </div>
        </dl>
      </section>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <section aria-labelledby="week-h" className="space-y-5">
          <SectionHeader id="week-h" title="The last seven days" />
          <div className="flex h-44 items-end gap-2" role="list">
            {week.map((w) => {
              const isToday = w.key === todayKey;
              return (
                <div
                  key={w.key}
                  role="listitem"
                  aria-label={`${isToday ? "Today" : w.label}: ${w.count}`}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="numerals text-[0.8125rem] text-muted">{w.count > 0 ? fmt(w.count) : ""}</span>
                  <motion.span
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(w.count ? 4 : 1.5, (w.count / weekMax) * 100)}%` }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={`block w-full max-w-10 rounded-t-md ${isToday ? "bg-accent" : w.count ? "bg-[color-mix(in_srgb,var(--primary)_45%,var(--surface2))]" : "bg-line"}`}
                  />
                  <span className={`text-[0.8125rem] ${isToday ? "font-semibold text-ink" : "text-muted"}`}>{w.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="act-h" className="space-y-5">
          <SectionHeader id="act-h" title="Activity" />
          <Heatmap byDate={stats.byDate} />
        </section>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-labelledby="top-h" className="space-y-4">
          <SectionHeader id="top-h" title="Most recited" />
          <ol className="divide-y divide-line border-y border-line">
            {top.map(([id, n], i) => {
              const d = dById(id);
              return (
                <li key={id} className="flex items-center gap-4 py-3.5">
                  <span className="numerals w-5 font-display text-lg text-muted">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.9375rem] font-medium text-ink">{d?.tr ?? "Removed dhikr"}</span>
                    <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-sunken">
                      <span className="block h-full rounded-full bg-accent" style={{ width: `${(n / top[0][1]) * 100}%` }} />
                    </span>
                  </span>
                  <span className="numerals shrink-0 text-[0.9375rem] text-ink">{fmt(n)}</span>
                </li>
              );
            })}
          </ol>
        </section>

        <Panel as="section" aria-labelledby="ms-h" className="self-start p-6">
          <h2 id="ms-h" className="eyebrow">
            Next milestone
          </h2>
          <p className="numerals mt-3 font-display text-[2.5rem] leading-none text-ink">{fmt(next)}</p>
          <ProgressBar value={stats.total - prev} max={Math.max(1, next - prev)} label="Progress to next milestone" tone="gold" className="mt-5" />
          <p className="numerals mt-3 text-sm text-muted">{fmt(Math.max(0, next - stats.total))} counts away</p>
        </Panel>
      </div>
    </div>
  );
};

export default StatsView;
