/* ─── Hijri date & occasion awareness ────────────────────────────────────
   The Hijri date is computed natively by the browser via the Umm al-Qura
   calendar (Intl) — no library. Note the tabular Umm al-Qura date can differ
   by ±1 day from local moon-sighting (which decides Ramadan/Eid in a given
   country), so `offset` lets the user nudge it to match their region.

   Occasions are derived purely from the (adjusted) Hijri/Gregorian date and
   surface contextual dhikr — Friday → Surah Kahf & Salawat, the last ten
   nights → Laylat al-Qadr, the White Days → fasting, etc. */

export const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabiʿ al-Awwal",
  "Rabiʿ al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Shaʿban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qaʿdah",
  "Dhu al-Hijjah",
];

const ISLAMIC_LOCALE = "en-US-u-ca-islamic-umalqura";

function shift(date, offsetDays) {
  return new Date(date.getTime() + (Number(offsetDays) || 0) * 864e5);
}

/* Numeric Hijri parts via Intl. Falls back gracefully if the umalqura
   calendar is unavailable on an old engine. */
export function hijriParts(date = new Date(), offset = 0) {
  const d = shift(date, offset);
  try {
    const fmt = new Intl.DateTimeFormat(ISLAMIC_LOCALE, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    const parts = fmt.formatToParts(d);
    const get = (t) => Number(parts.find((p) => p.type === t)?.value);
    const day = get("day");
    const month = get("month"); // 1-based
    const year = get("year");
    return {
      day,
      month,
      year,
      monthName: HIJRI_MONTHS[month - 1] || "",
      ok: Number.isFinite(day) && Number.isFinite(month),
    };
  } catch {
    return { day: 0, month: 0, year: 0, monthName: "", ok: false };
  }
}

/* "12 Ramadan 1447 AH" */
export function hijriFormatted(date = new Date(), offset = 0) {
  const { day, monthName, year, ok } = hijriParts(date, offset);
  if (!ok) return "";
  return `${day} ${monthName} ${year} AH`;
}

/* Compact "12 Ramadan" for tight header slots. */
export function hijriShort(date = new Date(), offset = 0) {
  const { day, monthName, ok } = hijriParts(date, offset);
  if (!ok) return "";
  return `${day} ${monthName}`;
}

/* ─── Occasions ───────────────────────────────────────────────────────────
   Each occasion names the seed set Today leads with (`setId`), the Library
   collection to browse, and an optional outside link. `night` is 1 after
   Maghrib, when the Islamic day has already begun: the Hijri `offset` then
   includes it, and Friday starts on Thursday evening. Most significant first. */
const ordinal = (n) => ["first", "second", "third"][n - 1];
const nth = (n) => `${n}${(n % 100 < 11 || n % 100 > 13) && ["th", "st", "nd", "rd"][n % 10] || "th"}`;

export function detectOccasions(date = new Date(), offset = 0, night = 0) {
  const greg = new Date(date);
  const { day, month, ok } = hijriParts(date, offset);
  const out = [];
  const add = (o) => out.push(o);

  const ramadan = ok && month === 9;
  const lastTen = ramadan && day >= 21;
  const dhulHijjah = ok && month === 12;
  // Jumuʿah runs from Maghrib on Thursday to Maghrib on Friday.
  const friday = night ? greg.getDay() === 4 : greg.getDay() === 5;
  // Fasting is not allowed on the Days of Tashreeq (11 to 13 Dhul-Hijjah).
  const whiteDay = ok && day >= 13 && day <= 15 && !ramadan && !(dhulHijjah && day === 13);

  if (ok && month === 10 && day === 1) {
    add({
      id: "eid-fitr",
      label: "Eid al-Fitr Mubarak",
      desc: "Say the Takbir from the sighting of the moon until the Eid prayer begins.",
      icon: "sparkles",
      setId: "eid-takbir",
      browse: "eid",
    });
  }
  if (dhulHijjah && day === 10) {
    add({
      id: "eid-adha",
      label: "Eid al-Adha Mubarak",
      desc: "The Day of Sacrifice. Say the Takbir on the way to the prayer and after every salah.",
      icon: "sparkles",
      setId: "eid-takbir",
      browse: "eid",
    });
  }
  if (dhulHijjah && day === 9) {
    add({
      id: "arafah",
      label: "Day of ʿArafah",
      desc: "The best du'a is the du'a of ʿArafah, and fasting today expiates two years. (Tirmidhi 3585, Muslim 1162)",
      icon: "mountain",
      setId: "arafah-day",
      browse: "dhul-hijjah",
    });
  }
  if (lastTen) {
    const odd = night && day % 2 === 1;
    add({
      id: "last-ten",
      label: odd ? `The ${nth(day)} night of Ramadan` : "The Last Ten Nights",
      desc: odd
        ? "An odd night of the last ten: seek Laylat al-Qadr. ʿA'ishah was taught to say: Allahumma innaka ʿAfuwwun. (Tirmidhi 3513)"
        : "Seek Laylat al-Qadr in the odd nights, and say much: Allahumma innaka ʿAfuwwun. (Tirmidhi 3513)",
      icon: "star",
      setId: "last-ten-nights",
      browse: "ramadan",
    });
  }
  if (dhulHijjah && day >= 11 && day <= 13) {
    add({
      id: "tashreeq",
      label: "Days of Tashreeq",
      desc: "Days of eating, drinking and remembering Allah. Say the Takbir after every salah. (Muslim 1141)",
      icon: "sparkles",
      setId: "eid-takbir",
      browse: "eid",
    });
  }
  if (dhulHijjah && day <= 8) {
    add({
      id: "dhul-hijjah",
      label: `Day ${day} of Dhul-Hijjah`,
      desc: "The best ten days of the year: say much tahlil, takbir and tahmid in them. (Ahmad 5446)",
      icon: "mountain",
      setId: "dhul-hijjah-ten",
      browse: "dhul-hijjah",
    });
  }
  if (friday) {
    add({
      id: "friday",
      label: night ? "The night of Jumuʿah" : "Jumuʿah Mubarak",
      desc: "Send abundant salawat, and read Surah al-Kahf for a light that lasts until the next Friday. (Abu Dawud 1047, al-Hakim)",
      icon: "star",
      setId: "friday-salawat",
      browse: "friday",
      link: { label: "Read Surah al-Kahf", href: "https://quran.com/18" },
    });
  }
  if (ok && month === 1 && (day === 9 || day === 10)) {
    add({
      id: "ashura",
      label: day === 10 ? "Day of ʿAshura" : "Tasuʿa, the 9th of Muharram",
      desc: "Fasting ʿAshura expiates the year before; fast the 9th with it. (Muslim 1162, 1134)",
      icon: "moon",
      setId: "iftar",
      browse: "fasting",
    });
  }
  if (ramadan && !lastTen) {
    add({
      id: "ramadan",
      label: `Ramadan, day ${day}`,
      desc: "A month of mercy, fasting and the Qur'an. Break your fast with the du'a of the Prophet ﷺ.",
      icon: "moon",
      setId: "iftar",
      browse: "ramadan",
    });
  }
  if (whiteDay) {
    const n = day - 12;
    add({
      id: "white-days",
      label: `The White Days, ${ordinal(n)} of three`,
      desc: night
        ? "Fasting tomorrow is Sunnah: the 13th, 14th and 15th of every month. (Tirmidhi 761)"
        : "Sunnah to fast the 13th, 14th and 15th; it is like fasting the whole year. At Maghrib, break your fast with this du'a. (Tirmidhi 761)",
      icon: "sun",
      setId: "iftar",
      browse: "fasting",
    });
  }

  return out;
}

export function topOccasion(date = new Date(), offset = 0, night = 0) {
  return detectOccasions(date, offset, night)[0] || null;
}

/* ─── Regional offset ──────────────────────────────────────────────────────
   We keep Umm al-Qura (Saudi) as the base calendar and apply the *commonly
   used* ±day offset for the device's region — most of the world follows the
   Saudi/Umm al-Qura date (offset 0), while the Indian subcontinent typically
   observes one day later (offset −1). This is the conventional regional shift,
   not a per-night sighting calculation, so the manual ±day stepper in Settings
   stays available to fine-tune for a specific country/authority. */
const REGION_OFFSETS = [
  {
    // Regions that commonly observe one day after Saudi via local moon-sighting.
    // Everything not listed defaults to 0 (follows Umm al-Qura / Saudi), which
    // covers the Gulf, the Levant, Egypt, Türkiye, Europe, the Americas and most
    // of Africa. The manual ±day stepper handles any country that differs.
    off: -1,
    tz: new Set([
      // South Asia
      "Asia/Kolkata", "Asia/Calcutta", "Asia/Karachi", "Asia/Dhaka",
      "Asia/Colombo", "Asia/Kathmandu", "Asia/Thimphu", "Asia/Kabul",
      "Indian/Maldives",
      // Iran (Tehran sighting)
      "Asia/Tehran",
      // Southeast Asia — MABIMS (Indonesia, Malaysia, Singapore, Brunei)
      "Asia/Jakarta", "Asia/Pontianak", "Asia/Makassar", "Asia/Jayapura",
      "Asia/Kuala_Lumpur", "Asia/Kuching", "Asia/Singapore", "Asia/Brunei",
    ]),
  },
];

export function regionalHijriOffset() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    for (const r of REGION_OFFSETS) if (r.tz.has(tz)) return r.off;
    return 0; // most of the world follows Umm al-Qura
  } catch {
    return 0;
  }
}
