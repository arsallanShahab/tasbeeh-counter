import { useState } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useNow } from "../../hooks/useNow";
import { SLOTS, DEFAULT_SLOTS, adhkarDay, dayDone, slotWindows } from "../../utils/adhkar";
import { dateKey } from "../../utils/stats";
import { fmtTime } from "../../utils/prayerTimes";
import { SectionHeader } from "../common/Layout";
import { Button } from "../common/Button";
import { Sheet } from "../common/Modal";
import Toggle from "../common/Toggle";

// Today's moments of remembrance, ticked by finished sets or by hand.
export const AdhkarChecklist = () => {
  const { settings, setSettings, stats, setStats, lists, startList } = useApp();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [showPassed, setShowPassed] = useState(false);
  const now = new Date(useNow(60000));

  const prayer = settings.prayer;
  const enabled = settings.adhkarSlots?.length ? settings.adhkarSlots : DEFAULT_SLOTS;
  const day = adhkarDay(prayer, now);
  const occasionOf = (id) => lists.find((l) => l.id === id)?.occasion;
  const { done, times, next } = dayDone({ day, log: stats.doneLog, manual: stats.adhkarManual, occasionOf, prayer });
  const win = slotWindows(times, next);
  const slots = SLOTS.filter((s) => enabled.includes(s.key));
  const doneCount = slots.filter((s) => done[s.key]).length;
  const at = (d) => fmtTime(d, prayer?.hour12 ?? true);

  // The set you finish most for this moment, else the usual one.
  const setFor = (slot) => {
    const fits = lists.filter((l) => l.occasion === slot.occasion);
    const best = [...fits].sort((a, b) => (stats.completed?.[b.id]?.n || 0) - (stats.completed?.[a.id]?.n || 0))[0];
    return (best && stats.completed?.[best.id]?.n ? best : null) || lists.find((l) => l.id === slot.set) || fits[0];
  };

  const toggleManual = (key) => {
    const dk = dateKey(day);
    setStats((st) => {
      const m = { ...(st.adhkarManual || {}) };
      const dayMarks = { ...(m[dk] || {}) };
      if (dayMarks[key]) delete dayMarks[key];
      else dayMarks[key] = Date.now();
      m[dk] = dayMarks;
      return { ...st, adhkarManual: m };
    });
  };

  const statusOf = (key) => {
    if (done[key]) return "done";
    const [from, until] = win[key];
    if (now >= until) return "passed";
    return now >= from ? "now" : "later";
  };

  const subOf = (key, status) => {
    if (status === "done") return done[key].manual ? "Marked done" : `Done ${at(new Date(done[key].t))}`;
    const [from, until] = win[key];
    if (status === "now") return times.exact ? `Until ${at(until)}` : "Now";
    if (status === "later") return times.exact ? `From ${at(from)}` : "Later";
    return "Passed";
  };

  // Done, now and the next moment show; the rest fold into one line.
  const nextLater = slots.find((s) => statusOf(s.key) === "later");
  const visible = (s) => ["done", "now"].includes(statusOf(s.key)) || s === nextLater;
  const shown = showPassed ? slots : slots.filter(visible);
  const earlier = slots.filter((s) => !visible(s) && statusOf(s.key) === "passed").length;
  const later = slots.filter((s) => !visible(s) && statusOf(s.key) === "later").length;

  return (
    <>
    <section aria-labelledby="adhkar-h" className="space-y-4">
      <SectionHeader
        id="adhkar-h"
        title="Today's adhkar"
        count={`${doneCount} of ${slots.length}`}
        action={
          <Button variant="link" size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
        }
      />
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {shown.map((slot) => {
          const status = statusOf(slot.key);
          const isDone = status === "done";
          const manual = !!done[slot.key]?.manual;
          const set = setFor(slot);
          return (
            <li
              key={slot.key}
              className={`flex min-h-14 min-w-0 items-center rounded-xl border bg-surface ${
                status === "now" ? "border-accent" : "border-line"
              }`}
            >
              <button
                type="button"
                aria-pressed={isDone}
                disabled={isDone && !manual}
                onClick={() => toggleManual(slot.key)}
                aria-label={isDone ? (manual ? `${slot.label}: marked done. Unmark` : `${slot.label}: done`) : `Mark ${slot.label} as done`}
                className="flex h-12 w-10 shrink-0 items-center justify-center rounded-l-xl"
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                    isDone ? "bg-accent text-on-accent" : status === "now" ? "border-[1.5px] border-accent" : "border-[1.5px] border-line-strong"
                  }`}
                >
                  {isDone && <Check size={14} strokeWidth={3} aria-hidden="true" />}
                </span>
              </button>
              <button
                type="button"
                disabled={!set}
                onClick={() => set && startList(set)}
                aria-label={set ? `Begin ${set.name} for ${slot.label}` : slot.label}
                className="row-interactive flex min-h-14 min-w-0 flex-1 flex-col justify-center rounded-r-xl py-2 pr-3 text-left"
              >
                <span className={`block truncate text-[0.9375rem] font-medium ${status === "passed" ? "text-muted" : "text-ink"}`}>{slot.short}</span>
                <span className={`block truncate text-[0.8125rem] ${status === "now" ? "text-accent" : "text-muted"}`}>{subOf(slot.key, status)}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {earlier + later > 0 && (
        <button
          type="button"
          onClick={() => setShowPassed((v) => !v)}
          aria-expanded={showPassed}
          className="row-interactive -mx-2 flex min-h-11 w-[calc(100%+1rem)] items-center justify-between gap-3 rounded-lg px-2 text-left text-sm text-muted"
        >
          <span className="min-w-0 truncate">
            {showPassed ? "Showing every moment" : [earlier && `${earlier} earlier`, later && `${later} later`].filter(Boolean).join(" · ")}
          </span>
          <span className="shrink-0 font-medium text-accent">{showPassed ? "Show less" : "Show all"}</span>
        </button>
      )}
      {!times.exact && (
        <p className="text-sm text-muted">
          Times are approximate.{" "}
          <Button variant="link" size="sm" className="-ml-1" onClick={() => navigate("/settings?panel=prayer")}>
            Set your location
          </Button>
        </p>
      )}
    </section>

      <Sheet open={editing} onClose={() => setEditing(false)} title="Today's adhkar" description="Choose the moments you want to keep track of.">
        <ul className="divide-y divide-line rounded-2xl border border-line">
          {SLOTS.map((slot) => {
            const on = enabled.includes(slot.key);
            const id = `adhkar-slot-${slot.key}`;
            return (
              <li key={slot.key} className="flex items-center gap-4 px-4 py-3">
                <span id={id} className="flex-1 text-[0.9375rem] font-medium text-ink">
                  {slot.label}
                </span>
                <Toggle
                  on={on}
                  labelledBy={id}
                  disabled={on && enabled.length <= 1}
                  onClick={() =>
                    setSettings((s) => ({
                      ...s,
                      adhkarSlots: on ? enabled.filter((k) => k !== slot.key) : DEFAULT_SLOTS.filter((k) => k === slot.key || enabled.includes(k)),
                    }))
                  }
                />
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-[0.8125rem] text-muted">Finishing a set ticks its moment. Tap the circle to tick one you recited from memory.</p>
      </Sheet>
    </>
  );
};

export default AdhkarChecklist;
