import React from "react";
import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import { fmt, computeStreak, bestStreak, last7, dateKey } from "../../utils/stats";

export const StatsView = () => {
  const { stats, dById } = useApp();

  const today = stats.byDate[dateKey()] || 0;
  const streak = computeStreak(stats.byDate);
  const bestStr = bestStreak(stats.byDate);
  const week = last7(stats.byDate);
  
  const max = Math.max(1, ...week.map((w) => w.count));
  const top = Object.entries(stats.perDhikr)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="space-y-6 anim-fade">
      <h1 className="pt-2 font-display text-2xl text-[var(--text)]">Statistics</h1>
      
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <p className="text-xs text-[var(--muted)]">Today</p>
          <p className="font-display text-3xl text-[var(--text)]">{fmt(today)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[var(--muted)]">All-time</p>
          <p className="font-display text-3xl text-[var(--text)]">{fmt(stats.total)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[var(--muted)]">Current streak</p>
          <p className="font-display text-3xl text-[var(--gold)]">{streak}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[var(--muted)]">Best streak</p>
          <p className="font-display text-3xl text-[var(--text)]">{bestStr}</p>
        </Card>
      </div>

      <Card className="p-5">
        <p className="mb-4 font-display text-lg text-[var(--text)]">Last 7 days</p>
        <div className="flex h-36 items-end justify-between gap-2">
          {week.map((w) => (
            <div key={w.key} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-1 items-end">
                <div 
                  className="w-full rounded-t-lg transition-all" 
                  style={{ 
                    height: `${(w.count / max) * 100}%`, 
                    minHeight: w.count ? 6 : 2, 
                    background: w.count ? "var(--primary)" : "var(--surface2)" 
                  }} 
                />
              </div>
              <span className="text-[10px] text-[var(--muted)]">{w.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <p className="mb-4 font-display text-lg text-[var(--text)]">Most recited</p>
        {top.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            Start counting to see your breakdown.
          </p>
        ) : (
          <div className="space-y-3">
            {top.map(([id, n]) => {
              const d = dById(id); 
              const mx = top[0][1];
              return (
                <div key={id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-[var(--text)] truncate max-w-[200px]">
                      {d?.tr ?? id}
                    </span>
                    <span className="text-[var(--muted)] shrink-0 font-medium">{fmt(n)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--surface2)]">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${(n / mx) * 100}%`, 
                        background: "var(--gold)" 
                      }} 
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
