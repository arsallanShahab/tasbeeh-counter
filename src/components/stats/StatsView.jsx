import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Flame, Target, TrendingUp, TrendingDown, Minus, Trophy, CalendarDays, Pencil, Check, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import {
  fmt,
  computeStreak,
  bestStreak,
  last7,
  lastN,
  dateKey,
  activeDayCount,
  avgPerActiveDay,
  yesterdayCount,
  weekTotal,
  nextMilestone,
  prevMilestone,
} from "../../utils/stats";

const GoalRing = ({ value, goal }) => {
  const pct = Math.min(1, goal > 0 ? value / goal : 0);
  const size = 168;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--surface2)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] uppercase tracking-wider text-[var(--muted)]">Today</span>
        <span className="font-display text-4xl text-[var(--text)] leading-tight">{fmt(value)}</span>
        <span className="text-xs text-[var(--muted)]">of {fmt(goal)}</span>
      </div>
    </div>
  );
};

const Delta = ({ today, yest }) => {
  if (yest === 0 && today === 0) return null;
  const diff = today - yest;
  const Icon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus;
  const color = diff > 0 ? "var(--primary)" : diff < 0 ? "var(--danger)" : "var(--muted)";
  const label = diff === 0 ? "same as yesterday" : `${diff > 0 ? "+" : ""}${fmt(diff)} vs yesterday`;
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color }}>
      <Icon size={14} />
      <span>{label}</span>
    </div>
  );
};

const Heatmap = ({ byDate }) => {
  const cells = lastN(byDate, 84); // 12 weeks
  const max = Math.max(1, ...cells.map((c) => c.count));

  const level = (n) => {
    if (n <= 0) return 0;
    const ratio = n / max;
    if (ratio < 0.25) return 1;
    if (ratio < 0.5) return 2;
    if (ratio < 0.75) return 3;
    return 4;
  };

  const bg = (lv) => {
    if (lv === 0) return "var(--surface2)";
    const opacity = [0.25, 0.45, 0.7, 1][lv - 1];
    return `color-mix(in srgb, var(--primary) ${opacity * 100}%, transparent)`;
  };

  const weeks = [];
  for (let i = 0; i < 12; i++) weeks.push(cells.slice(i * 7, i * 7 + 7));

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1.5">
          {week.map((day) => (
            <div
              key={day.key}
              title={`${day.key}: ${day.count}`}
              className="h-3.5 w-3.5 rounded-[4px]"
              style={{ background: bg(level(day.count)) }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const MilestoneBar = ({ total }) => {
  const next = nextMilestone(total);
  const prev = prevMilestone(total);
  const span = Math.max(1, next - prev);
  const pct = Math.min(1, Math.max(0, (total - prev) / span));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-[var(--text)]">
          <Trophy size={15} className="text-[var(--gold)]" />
          <span className="font-medium">Next milestone</span>
        </div>
        <span className="font-display text-[var(--gold)]">{fmt(next)}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface2)]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, var(--primary), var(--gold))" }}
          initial={{ width: 0 }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ type: "spring", stiffness: 70, damping: 20 }}
        />
      </div>
      <p className="mt-1.5 text-xs text-[var(--muted)]">
        {fmt(Math.max(0, next - total))} more to reach the next milestone
      </p>
    </div>
  );
};

const GoalEditor = ({ value, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  if (!editing) {
    return (
      <button
        onClick={() => { setDraft(String(value)); setEditing(true); }}
        className="flex items-center gap-1 text-xs font-medium text-[var(--muted)] hover:text-[var(--primary)] transition-colors cursor-pointer"
      >
        <Pencil size={12} /> Edit goal
      </button>
    );
  }
  const save = () => {
    const v = Math.max(1, Math.round(Number(draft) || 0));
    onChange(v);
    setEditing(false);
  };
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        min={1}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") setEditing(false);
        }}
        className="w-20 rounded-lg border border-[var(--line)] bg-[var(--bg2)] px-2 py-1 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
      />
      <button onClick={save} className="rounded-lg bg-[var(--primary)] p-1 text-white cursor-pointer">
        <Check size={14} />
      </button>
      <button onClick={() => setEditing(false)} className="rounded-lg bg-[var(--surface2)] p-1 text-[var(--muted)] cursor-pointer">
        <X size={14} />
      </button>
    </div>
  );
};

export const StatsView = () => {
  const { stats, dById, settings, setSettings } = useApp();

  const goal = settings.dailyGoal || 100;
  const today = stats.byDate[dateKey()] || 0;
  const yest = yesterdayCount(stats.byDate);
  const streak = computeStreak(stats.byDate);
  const bestStr = bestStreak(stats.byDate);
  const week = last7(stats.byDate);
  const wTotal = weekTotal(stats.byDate);
  const activeDays = activeDayCount(stats.byDate);
  const avg = avgPerActiveDay(stats.total, stats.byDate);

  const max = useMemo(() => Math.max(1, ...week.map((w) => w.count)), [week]);
  const top = useMemo(
    () => Object.entries(stats.perDhikr).sort((a, b) => b[1] - a[1]).slice(0, 6),
    [stats.perDhikr]
  );
  const goalReached = today >= goal && goal > 0;
  const todayKey = dateKey();

  return (
    /* Desktop turns the mobile card stack into a three-column dashboard; the
       col-span hints below describe each card's share of that grid. */
    <div className="space-y-5 anim-fade lg:grid lg:grid-cols-3 lg:items-start lg:gap-5 lg:space-y-0">
      <h1 className="pt-2 font-display text-2xl text-[var(--text)] lg:col-span-3 lg:pt-0 lg:text-3xl">
        Statistics
      </h1>

      <Card className="p-5 lg:col-span-2">
        <div className="flex items-center gap-5">
          <GoalRing value={today} goal={goal} />
          <div className="flex flex-1 flex-col gap-2 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[var(--muted)]">
                <Target size={12} /> Daily goal
              </div>
              <GoalEditor value={goal} onChange={(v) => setSettings((s) => ({ ...s, dailyGoal: v }))} />
            </div>
            <Delta today={today} yest={yest} />
            {goalReached && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{
                  background: "color-mix(in srgb, var(--gold) 18%, transparent)",
                  color: "var(--gold)",
                }}
              >
                <Check size={12} /> Goal reached
              </motion.div>
            )}
            <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-[var(--bg2)] px-2.5 py-2">
                <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">This week</p>
                <p className="font-display text-base text-[var(--text)]">{fmt(wTotal)}</p>
              </div>
              <div className="rounded-xl bg-[var(--bg2)] px-2.5 py-2">
                <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">All-time</p>
                <p className="font-display text-base text-[var(--text)]">{fmt(stats.total)}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden p-5 lg:col-span-1">
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-2xl"
          style={{ background: streak > 0 ? "var(--gold)" : "var(--muted)" }}
        />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={streak > 0 ? { y: [0, -3, 0], rotate: [-2, 2, -2] } : {}}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background: streak > 0
                  ? "color-mix(in srgb, var(--gold) 20%, transparent)"
                  : "var(--surface2)",
              }}
            >
              <Flame
                size={26}
                className={streak > 0 ? "text-[var(--gold)]" : "text-[var(--muted)]"}
                fill={streak > 0 ? "currentColor" : "none"}
              />
            </motion.div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Current streak</p>
              <p className="font-display text-3xl text-[var(--text)] leading-tight">
                {streak} <span className="text-base text-[var(--muted)]">day{streak === 1 ? "" : "s"}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Best</p>
            <p className="font-display text-xl text-[var(--gold)]">{bestStr}</p>
          </div>
        </div>
        {streak === 0 && (
          <p className="mt-3 text-xs text-[var(--muted)]">
            Count any dhikr today to start a new streak.
          </p>
        )}
      </Card>

      {/* lg:contents dissolves this pair wrapper so both cards become direct
          items of the desktop grid instead of a nested two-up row. */}
      <div className="grid grid-cols-2 gap-3 lg:contents">
        <Card className="p-4 lg:col-span-1">
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">Active days</p>
          <p className="font-display text-2xl text-[var(--text)]">{fmt(activeDays)}</p>
        </Card>
        <Card className="p-4 lg:col-span-1">
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">Avg / active day</p>
          <p className="font-display text-2xl text-[var(--text)]">{fmt(avg)}</p>
        </Card>
      </div>

      <Card className="p-5 lg:col-span-1">
        <MilestoneBar total={stats.total} />
      </Card>

      <Card className="p-5 lg:col-span-2">
        <p className="mb-4 font-display text-lg text-[var(--text)]">Last 7 days</p>
        <div className="flex h-36 items-end justify-between gap-2">
          {week.map((w) => {
            const isToday = w.key === todayKey;
            return (
              <div key={w.key} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(w.count / max) * 100}%` }}
                    transition={{ type: "spring", stiffness: 80, damping: 18 }}
                    className="w-full rounded-t-lg"
                    style={{
                      minHeight: w.count ? 6 : 2,
                      background: isToday
                        ? "linear-gradient(180deg, var(--gold), var(--primary))"
                        : w.count
                        ? "var(--primary)"
                        : "var(--surface2)",
                    }}
                  />
                </div>
                <span
                  className="text-[10px]"
                  style={{ color: isToday ? "var(--gold)" : "var(--muted)", fontWeight: isToday ? 700 : 400 }}
                >
                  {w.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-5 lg:col-span-1">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-lg text-[var(--text)]">Activity</p>
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <CalendarDays size={13} /> Last 12 weeks
          </div>
        </div>
        <Heatmap byDate={stats.byDate} />
        <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-[var(--muted)]">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((lv) => (
            <span
              key={lv}
              className="h-3 w-3 rounded-[3px]"
              style={{
                background: lv === 0
                  ? "var(--surface2)"
                  : `color-mix(in srgb, var(--primary) ${[25, 45, 70, 100][lv - 1]}%, transparent)`,
              }}
            />
          ))}
          <span>More</span>
        </div>
      </Card>

      <Card className="p-5 lg:col-span-3">
        <p className="mb-4 font-display text-lg text-[var(--text)]">Most recited</p>
        {top.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            Start counting to see your breakdown.
          </p>
        ) : (
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-3 lg:space-y-0">
            {top.map(([id, n], idx) => {
              const d = dById(id);
              const mx = top[0][1];
              return (
                <div key={id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-[var(--text)] truncate max-w-[200px] flex items-center gap-1.5">
                      {idx === 0 && <Trophy size={13} className="text-[var(--gold)] shrink-0" />}
                      {d?.tr ?? id}
                    </span>
                    <span className="text-[var(--muted)] shrink-0 font-medium">{fmt(n)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--surface2)]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(n / mx) * 100}%` }}
                      transition={{ type: "spring", stiffness: 70, damping: 20, delay: idx * 0.04 }}
                      className="h-full rounded-full"
                      style={{ background: "var(--gold)" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default StatsView;
