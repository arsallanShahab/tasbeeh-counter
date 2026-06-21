/* ─── Prayer times & Qibla ────────────────────────────────────────────────
   Everything here is computed on-device from the sun's position via adhan-js
   — no network, fully offline. The only variation between sources is the
   *convention* (calculation method, Asr madhhab, high-latitude rule), so we
   expose all three and let the user match their local mosque, plus per-prayer
   minute offsets for the final reconciliation. */
import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  Madhab,
  HighLatitudeRule,
  Qibla,
  SunnahTimes,
} from "adhan";

export const KAABA = { lat: 21.4225, lng: 39.8262 };

// Prayers in chronological order. Sunrise is shown but is not a salah, so it's
// excluded from reminder scheduling and the "current/next prayer" highlight.
export const PRAYER_KEYS = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
export const SALAH_KEYS = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export const PRAYER_LABELS = {
  fajr: "Fajr",
  sunrise: "Sunrise",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

export const PRAYER_ARABIC = {
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
};

// Calculation methods exposed in Settings. `id` maps to a CalculationMethod
// factory of the same name (except "auto", which is resolved by region).
export const CALC_METHODS = [
  { id: "auto", name: "Automatic", note: "Pick by region" },
  { id: "MuslimWorldLeague", name: "Muslim World League", note: "18° / 17°" },
  { id: "NorthAmerica", name: "ISNA (North America)", note: "15° / 15°" },
  { id: "Egyptian", name: "Egyptian Authority", note: "19.5° / 17.5°" },
  { id: "Karachi", name: "Karachi (Univ. of Islamic Sci.)", note: "18° / 18°" },
  { id: "UmmAlQura", name: "Umm al-Qura (Makkah)", note: "18.5° / 90 min" },
  { id: "Dubai", name: "Dubai (UAE)", note: "18.2° / 18.2°" },
  { id: "Qatar", name: "Qatar", note: "18° / 90 min" },
  { id: "Kuwait", name: "Kuwait", note: "18° / 17.5°" },
  { id: "Singapore", name: "Singapore (MUIS)", note: "20° / 18°" },
  { id: "Turkey", name: "Diyanet (Turkey)", note: "18° / 17°" },
  { id: "Tehran", name: "Tehran (Geophysics)", note: "17.7° / 14°" },
  { id: "MoonsightingCommittee", name: "Moonsighting Committee", note: "18° / 18°" },
];

export const HIGH_LAT_RULES = [
  { id: "auto", name: "Recommended" },
  { id: "middleofthenight", name: "Middle of the Night" },
  { id: "seventhofthenight", name: "Seventh of the Night" },
  { id: "twilightangle", name: "Twilight Angle" },
];

const METHOD_NAME = Object.fromEntries(CALC_METHODS.map((m) => [m.id, m.name]));
export const methodName = (id) => METHOD_NAME[id] || id;

/* Region heuristic for the "Automatic" method. The astronomy is identical
   everywhere — this only chooses the convention most people in that area use.
   Bounding boxes are deliberately coarse; the user can always override. */
export function autoMethodId(lat, lng) {
  const inBox = (la1, la2, lo1, lo2) =>
    lat >= la1 && lat <= la2 && lng >= lo1 && lng <= lo2;

  // Arabian Peninsula → Umm al-Qura
  if (inBox(12, 32, 34, 60)) return "UmmAlQura";
  // UAE specifically
  if (inBox(22, 26.5, 51, 57)) return "Dubai";
  // Egypt & most of North/Sub-Saharan Africa
  if (inBox(-35, 32, -18, 52)) return "Egyptian";
  // South Asia (Pakistan, India, Bangladesh, Afghanistan)
  if (inBox(5, 37, 60, 97)) return "Karachi";
  // Turkey
  if (inBox(35, 43, 25, 45)) return "Turkey";
  // Iran
  if (inBox(25, 40, 44, 64)) return "Tehran";
  // Singapore / Malaysia / Indonesia
  if (inBox(-11, 8, 95, 120)) return "Singapore";
  // North America
  if (inBox(15, 72, -170, -50)) return "NorthAmerica";
  // Everywhere else (Europe, etc.)
  return "MuslimWorldLeague";
}

function paramsForMethod(id) {
  const fn = CalculationMethod[id];
  return typeof fn === "function" ? fn() : CalculationMethod.MuslimWorldLeague();
}

/* Compute the six daily times for one date. Returns Date objects in the
   device's local timezone (adhan returns absolute instants; the UI formats
   them with the local tz). */
export function computePrayerTimes({
  lat,
  lng,
  date = new Date(),
  method = "auto",
  madhhab = "shafi",
  highLatRule = "auto",
  offsets = {},
}) {
  const coords = new Coordinates(lat, lng);
  const methodId = method === "auto" ? autoMethodId(lat, lng) : method;
  const params = paramsForMethod(methodId);

  params.madhab = madhhab === "hanafi" ? Madhab.Hanafi : Madhab.Shafi;
  params.highLatitudeRule =
    highLatRule && highLatRule !== "auto"
      ? highLatRule
      : HighLatitudeRule.recommended(coords);
  params.adjustments = {
    fajr: Number(offsets.fajr) || 0,
    sunrise: Number(offsets.sunrise) || 0,
    dhuhr: Number(offsets.dhuhr) || 0,
    asr: Number(offsets.asr) || 0,
    maghrib: Number(offsets.maghrib) || 0,
    isha: Number(offsets.isha) || 0,
  };

  const pt = new PrayerTimes(coords, date, params);
  const sunnah = new SunnahTimes(pt);

  return {
    methodId,
    times: {
      fajr: pt.fajr,
      sunrise: pt.sunrise,
      dhuhr: pt.dhuhr,
      asr: pt.asr,
      maghrib: pt.maghrib,
      isha: pt.isha,
    },
    sunnah: {
      midnight: sunnah.middleOfTheNight,
      lastThird: sunnah.lastThirdOfTheNight,
    },
  };
}

/* The full schedule the UI needs: today's times plus the resolved "current"
   and "next" prayer, correctly wrapping across midnight (after Isha the next
   prayer is tomorrow's Fajr; before Fajr the current prayer is yesterday's
   Isha). */
export function prayerSchedule(opts) {
  const now = opts.date instanceof Date ? opts.date : new Date();
  const base = { ...opts, date: now };

  const today = computePrayerTimes(base);
  const tomorrow = computePrayerTimes({ ...base, date: new Date(now.getTime() + 864e5) });
  const yesterday = computePrayerTimes({ ...base, date: new Date(now.getTime() - 864e5) });

  const t = now.getTime();
  const seq = PRAYER_KEYS.map((key) => ({ key, time: today.times[key] }));

  // Next: first time strictly after now, else tomorrow's Fajr.
  const next =
    seq.find((p) => p.time.getTime() > t) ||
    { key: "fajr", time: tomorrow.times.fajr, tomorrow: true };

  // Current: latest time at/before now, else yesterday's Isha.
  let current = null;
  for (const p of seq) if (p.time.getTime() <= t) current = p;
  if (!current) current = { key: "isha", time: yesterday.times.isha, yesterday: true };

  return {
    methodId: today.methodId,
    today: today.times,
    tomorrow: tomorrow.times,
    sunnah: today.sunnah,
    seq,
    current,
    next,
  };
}

export function qiblaBearing(lat, lng) {
  return Qibla(new Coordinates(lat, lng));
}

/* Great-circle distance to the Kaaba in km (Haversine) — shown on the Qibla
   screen for a little extra grounding. */
export function distanceToKaaba(lat, lng) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(KAABA.lat - lat);
  const dLng = toRad(KAABA.lng - lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat)) * Math.cos(toRad(KAABA.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/* ─── Formatting helpers ──────────────────────────────────────────────── */
export function fmtTime(date, hour12 = true) {
  if (!(date instanceof Date) || isNaN(date)) return "--:--";
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12,
  });
}

export function fmtHHMM(date) {
  if (!(date instanceof Date) || isNaN(date)) return "00:00";
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
}

/* Human countdown like "2h 14m" / "8m" / "now". */
export function fmtCountdown(ms) {
  if (ms <= 0) return "now";
  const totalMin = Math.round(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h <= 0) return `${m}m`;
  return `${h}h ${m}m`;
}

/* A friendly location label derived offline from the IANA timezone
   (e.g. "Asia/Karachi" → "Karachi"). Good enough to confirm the right city
   without a reverse-geocoding network call. */
export function timezoneCity() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const tail = tz.split("/").pop() || "";
    return tail.replace(/_/g, " ");
  } catch {
    return "";
  }
}

/* ─── Geolocation ─────────────────────────────────────────────────────── */
export function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      reject(new Error("Location isn't supported on this device."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 10 * 60 * 1000, ...options }
    );
  });
}

/* ─── Prayer-time reminders ───────────────────────────────────────────────
   We reuse the existing alert pipeline (SW + foreground loop) by projecting
   prayer times into the same alert schema ({ id, title, body, time:"HH:MM",
   enabled, targetType, targetId }). Because prayer times shift daily, these
   are regenerated each day and re-synced — see AppContext. The deep links
   point at the adhkar that naturally follow each prayer. */
const REMINDER_TARGET = {
  fajr: { type: "list", id: "morning-short" },
  dhuhr: { type: "list", id: "after-salah" },
  asr: { type: "list", id: "after-salah" },
  maghrib: { type: "list", id: "evening-short" },
  isha: { type: "list", id: "before-sleep" },
};

export function buildPrayerAlerts(prayerSettings, schedule) {
  const rem = prayerSettings?.reminders;
  if (!prayerSettings?.enabled || !rem?.enabled || !schedule) return [];

  const before = Number(rem.before) || 0; // minutes before the adhan
  const perPrayer = rem.prayers || {};

  return SALAH_KEYS.filter((k) => perPrayer[k] !== false).map((key) => {
    const time = schedule.today[key];
    const fireAt = new Date(time.getTime() - before * 60000);
    const target = REMINDER_TARGET[key] || { type: "none", id: "" };
    return {
      id: `prayer-${key}`,
      prayer: true,
      title: `${PRAYER_LABELS[key]} · ${fmtTime(time)}`,
      body:
        before > 0
          ? `${PRAYER_LABELS[key]} is in ${before} min. Prepare for salah.`
          : `It's time for ${PRAYER_LABELS[key]}. Tap for the adhkar.`,
      time: fmtHHMM(fireAt),
      enabled: true,
      targetType: target.type,
      targetId: target.id,
    };
  });
}
