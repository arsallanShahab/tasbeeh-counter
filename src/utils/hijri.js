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
   Each occasion carries presentation (icon key, accent) and a contextual CTA
   that maps to existing library content:
     cta.kind === "list"     → start that list immediately (startList)
     cta.kind === "occasion" → browse that occasion collection (Library)
   They're returned most-significant first; the UI shows the top one. */
export function detectOccasions(date = new Date(), offset = 0) {
  const greg = new Date(date);
  const isFriday = greg.getDay() === 5;
  const { day, month, ok } = hijriParts(date, offset);
  const out = [];

  const ramadan = ok && month === 9;
  const lastTen = ramadan && day >= 21;
  const oddNight = lastTen && day % 2 === 1; // 21,23,25,27,29 — likely Qadr
  const whiteDays = ok && (day === 13 || day === 14 || day === 15);
  const dhulHijjah = ok && month === 12;
  const firstTenDhulHijjah = dhulHijjah && day <= 10;
  const arafah = dhulHijjah && day === 9;
  const eidAdha = dhulHijjah && day === 10;
  const eidFitr = ok && month === 10 && day === 1;
  const ashura = ok && month === 1 && (day === 9 || day === 10);
  const muharram = ok && month === 1 && day <= 10;

  // Highest significance first.
  if (eidFitr) {
    out.push({
      id: "eid-fitr",
      label: "Eid al-Fitr Mubarak",
      desc: "Glorify Allah with the Takbir of Eid.",
      icon: "sparkles",
      accent: "var(--gold)",
      cta: { kind: "list", id: "tahleel-100", label: "Recite Takbir" },
    });
  }
  if (eidAdha) {
    out.push({
      id: "eid-adha",
      label: "Eid al-Adha Mubarak",
      desc: "Days of Takbir, Tahmid and Tahlil.",
      icon: "sparkles",
      accent: "var(--gold)",
      cta: { kind: "list", id: "tahleel-100", label: "Recite Takbir" },
    });
  }
  if (arafah) {
    out.push({
      id: "arafah",
      label: "Day of ʿArafah",
      desc: "The best du'a is that of ʿArafah — make tahlil abundantly.",
      icon: "mountain",
      accent: "var(--primary)",
      cta: { kind: "list", id: "tahleel-100", label: "Begin Tahlil" },
    });
  }
  if (oddNight) {
    out.push({
      id: "laylatul-qadr",
      label: "A Night of the Last Ten",
      desc: "Seek Laylat al-Qadr: “Allahumma innaka ʿAfuwwun…”",
      icon: "star",
      accent: "var(--gold)",
      cta: { kind: "list", id: "laylatul-qadr", label: "Laylat al-Qadr du'a" },
    });
  } else if (lastTen) {
    out.push({
      id: "last-ten",
      label: "The Last Ten Nights",
      desc: "Increase in worship — the night of decree is near.",
      icon: "moon",
      accent: "var(--gold)",
      cta: { kind: "list", id: "laylatul-qadr", label: "Laylat al-Qadr du'a" },
    });
  } else if (ramadan) {
    out.push({
      id: "ramadan",
      label: "Ramadan Mubarak",
      desc: "A month of mercy, fasting and the Qur'an.",
      icon: "moon",
      accent: "var(--primary)",
      cta: { kind: "occasion", id: "ramadan", label: "Ramadan adhkar" },
    });
  }
  if (isFriday) {
    out.push({
      id: "friday",
      label: "Jumuʿah Mubarak",
      desc: "Read Surah al-Kahf and send abundant Salawat.",
      icon: "star",
      accent: "var(--primary)",
      cta: { kind: "list", id: "friday-salawat", label: "Friday Salawat ×100" },
    });
  }
  if (firstTenDhulHijjah && !arafah && !eidAdha) {
    out.push({
      id: "dhul-hijjah",
      label: "First Ten of Dhul-Hijjah",
      desc: "The most beloved days — abundant Takbir & dhikr.",
      icon: "mountain",
      accent: "var(--primary)",
      cta: { kind: "list", id: "tahleel-100", label: "Begin Tahlil" },
    });
  }
  if (ashura) {
    out.push({
      id: "ashura",
      label: day === 10 ? "Day of ʿAshura" : "Eve of ʿAshura",
      desc: "A recommended day of fasting and remembrance.",
      icon: "moon",
      accent: "var(--primary)",
      cta: { kind: "occasion", id: "general", label: "Browse dhikr" },
    });
  } else if (muharram) {
    out.push({
      id: "muharram",
      label: "Sacred Month of Muharram",
      desc: "Increase in voluntary fasting and dhikr.",
      icon: "moon",
      accent: "var(--primary)",
      cta: { kind: "occasion", id: "general", label: "Browse dhikr" },
    });
  }
  if (whiteDays && !ramadan) {
    out.push({
      id: "white-days",
      label: "The White Days (Ayyam al-Bid)",
      desc: "Sunnah to fast the 13th, 14th & 15th.",
      icon: "sun",
      accent: "var(--gold)",
      cta: { kind: "list", id: "tasbeeh-100", label: "Tasbih ×100" },
    });
  }

  return out;
}

export function topOccasion(date = new Date(), offset = 0) {
  return detectOccasions(date, offset)[0] || null;
}
