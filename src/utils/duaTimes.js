import { addDays, dayTimes, midnight } from "./adhkar";
import { PRAYER_LABELS, SALAH_KEYS } from "./prayerTimes";

/* ─── Times when du'a is answered ────────────────────────────────────────
   Worked out from the saved location's prayer times; without one these stay
   hidden rather than guess. The iqamah is not known, so the first 15 minutes
   after each adhan stand in for the time between the adhan and the iqamah. */
const MIN = 60000;
const AFTER_ADHAN = 15 * MIN;

// Tonight's last third: from two-thirds of the way from Maghrib to Fajr.
export function lastThird(prayer, now = new Date()) {
  const today = midnight(now);
  const t = dayTimes(prayer, today);
  if (!t.exact) return null;
  const [maghrib, fajr] = now < t.fajr ? [dayTimes(prayer, addDays(today, -1)).maghrib, t.fajr] : [t.maghrib, dayTimes(prayer, addDays(today, 1)).fajr];
  return { start: new Date(fajr.getTime() - (fajr - maghrib) / 3), end: fajr };
}

const WINDOWS = {
  "last-third": {
    label: "The last third of the night",
    desc: "Our Lord descends each night when the last third remains and says: Who is calling upon Me, that I may answer him? (Bukhari 1145)",
  },
  friday: {
    label: "The last hour of Friday",
    desc: "On Friday there is an hour in which no Muslim asks Allah for good but He gives it; seek it in the last hour after Asr. (Bukhari 935, Abu Dawud 1048)",
  },
  adhan: {
    label: "Between the adhan and iqamah",
    desc: "The du'a between the adhan and the iqamah is not turned away. (Abu Dawud 521, Tirmidhi 212)",
  },
};

// Every window touching today and tomorrow, in time order.
function windowsAround(prayer, now) {
  const out = [];
  for (const offset of [0, 1]) {
    const day = addDays(midnight(now), offset);
    const t = dayTimes(prayer, day);
    if (!t.exact) return [];
    for (const k of SALAH_KEYS) {
      out.push({ id: "adhan", ...WINDOWS.adhan, label: `Between the adhan and iqamah of ${PRAYER_LABELS[k]}`, start: t[k], end: new Date(t[k].getTime() + AFTER_ADHAN) });
    }
    if (day.getDay() === 5) out.push({ id: "friday", ...WINDOWS.friday, start: new Date(t.maghrib.getTime() - 60 * MIN), end: t.maghrib });
    const lt = lastThird(prayer, new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59));
    if (lt) out.push({ id: "last-third", ...WINDOWS["last-third"], ...lt });
  }
  const night = lastThird(prayer, now);
  if (night) out.push({ id: "last-third", ...WINDOWS["last-third"], ...night });
  return out.sort((a, b) => a.start - b.start);
}

// The window `now` is in, if any; the last third wins over an overlap.
export function acceptanceWindow(prayer, now = new Date()) {
  const open = windowsAround(prayer, now).filter((w) => now >= w.start && now < w.end);
  return open.find((w) => w.id === "last-third") || open[0] || null;
}

// The next window to begin after `now`.
export function nextAcceptance(prayer, now = new Date()) {
  return windowsAround(prayer, now).find((w) => w.start > now) || null;
}
