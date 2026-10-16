import { dateKey } from "./stats";
import { computePrayerTimes } from "./prayerTimes";

/* ─── Daily adhkar ───────────────────────────────────────────────────────
   Eight moments in the day. A finished set ticks the moment its occasion
   belongs to; an After Salah set ticks the prayer it was recited after. The
   adhkar day runs from Fajr to Fajr, so Isha and sleep adhkar said after
   midnight still count for the evening they belong to. */
export const SLOTS = [
  { key: "fajr", label: "After Fajr", short: "Fajr", occasion: "after-salah", set: "after-salah" },
  { key: "morning", label: "Morning", short: "Morning", occasion: "morning", set: "morning-short" },
  { key: "dhuhr", label: "After Dhuhr", short: "Dhuhr", occasion: "after-salah", set: "after-salah" },
  { key: "asr", label: "After Asr", short: "Asr", occasion: "after-salah", set: "after-salah" },
  { key: "evening", label: "Evening", short: "Evening", occasion: "evening", set: "evening-short" },
  { key: "maghrib", label: "After Maghrib", short: "Maghrib", occasion: "after-salah", set: "after-salah" },
  { key: "isha", label: "After Isha", short: "Isha", occasion: "after-salah", set: "after-salah" },
  { key: "sleep", label: "Before sleep", short: "Bedtime", occasion: "sleep", set: "before-sleep" },
];
export const DEFAULT_SLOTS = SLOTS.map((s) => s.key);
const SALAH = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
const BY_OCCASION = { morning: "morning", evening: "evening", sleep: "sleep" };

export const midnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

// Prayer times for a day; without a saved location, typical clock times.
export function dayTimes(prayer, day) {
  const loc = prayer?.location;
  if (loc && loc.lat != null && loc.lng != null) {
    try {
      const { times } = computePrayerTimes({
        lat: loc.lat,
        lng: loc.lng,
        method: prayer.method,
        madhhab: prayer.madhhab,
        highLatRule: prayer.highLatRule,
        offsets: prayer.offsets,
        date: new Date(day.getFullYear(), day.getMonth(), day.getDate(), 12),
      });
      return { ...times, exact: true };
    } catch {
      // fall through to the clock times
    }
  }
  const at = (h, m) => new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m);
  return { fajr: at(4, 30), sunrise: at(6, 0), dhuhr: at(12, 30), asr: at(15, 45), maghrib: at(18, 0), isha: at(19, 30), exact: false };
}

// When each moment is due: [from, until).
export function slotWindows(t, next) {
  return {
    fajr: [t.fajr, t.sunrise],
    morning: [t.fajr, t.dhuhr],
    dhuhr: [t.dhuhr, t.asr],
    asr: [t.asr, t.maghrib],
    evening: [t.asr, t.isha],
    maghrib: [t.maghrib, t.isha],
    isha: [t.isha, next.fajr],
    sleep: [t.isha, next.fajr],
  };
}

// The adhkar day `now` falls in: before Fajr it is still yesterday.
export function adhkarDay(prayer, now = new Date()) {
  const today = midnight(now);
  return now < dayTimes(prayer, today).fajr ? addDays(today, -1) : today;
}

const salahAt = (ms, t) => SALAH.reduce((k, p) => (ms >= t[p].getTime() ? p : k), "fajr");

/* What was done on adhkar day `day`. `log` is stats.doneLog ({ date: [{id, t}] }),
   `manual` is stats.adhkarManual ({ date: { slot: t } }), `occasionOf` maps a set
   id to its occasion. */
export function dayDone({ day, log = {}, manual = {}, occasionOf, prayer }) {
  const t = dayTimes(prayer, day);
  const next = dayTimes(prayer, addDays(day, 1));
  const from = t.fajr.getTime();
  const until = next.fajr.getTime();
  const entries = [...(log[dateKey(day)] || []), ...(log[dateKey(addDays(day, 1))] || [])]
    .filter((e) => e.t >= from && e.t < until)
    .sort((a, b) => a.t - b.t);
  const done = {};
  for (const e of entries) {
    const occ = occasionOf(e.id);
    const slot = occ === "after-salah" ? salahAt(e.t, t) : BY_OCCASION[occ];
    if (slot && !done[slot]) done[slot] = { t: e.t };
  }
  for (const [k, v] of Object.entries(manual[dateKey(day)] || {})) if (v && !done[k]) done[k] = { t: v, manual: true };
  return { done, times: t, next };
}
