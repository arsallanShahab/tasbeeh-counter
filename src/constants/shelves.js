import { Pin, Sunrise, MapPin, HeartHandshake, CalendarHeart, Sparkles, BookOpen } from "lucide-react";

/* ─── Library shelves ────────────────────────────────────────────────────
   Everything is organised by purpose, not by kind: a person looks for
   "after salah" or "when anxious", not for "a set" or "a dhikr". The shelf
   list is fixed, so it stays predictable however much content grows; each
   shelf groups its items by the occasions it lists. Today's Explore uses the
   same shelves and words. */
export const SHELVES = [
  {
    key: "yours",
    title: "Yours",
    desc: "Pinned to Today and made by you",
    hint: "Pinned and made by you",
    icon: Pin,
  },
  {
    key: "routine",
    title: "Daily routine",
    desc: "Morning, evening, after salah, before sleep",
    hint: "Morning, evening, salah",
    icon: Sunrise,
    occasions: ["morning", "evening", "after-salah", "sleep", "salah"],
  },
  {
    key: "moments",
    title: "Moments of the day",
    desc: "Home, food, travel, rain, and istikhara",
    hint: "Home, food, travel, rain",
    icon: MapPin,
  },
  {
    key: "heart",
    title: "For the heart",
    desc: "Anxiety, hardship, grief, repentance, gratitude",
    hint: "Anxiety, grief, repentance",
    icon: HeartHandshake,
    occasions: ["anxiety", "distress", "grief", "forgiveness", "repentance", "gratitude", "guidance", "protection"],
  },
  {
    key: "seasons",
    title: "Special days",
    desc: "Friday, Ramadan, Dhul-Hijjah, Eid, the night",
    hint: "Friday, Ramadan, Eid",
    icon: CalendarHeart,
    occasions: ["friday", "ramadan", "dhul-hijjah", "eid", "fasting", "night"],
  },
  {
    key: "names",
    title: "99 Names of Allah",
    desc: "One Name at a time, with its meaning",
    hint: "With their meanings",
    icon: Sparkles,
  },
  {
    key: "more",
    title: "More dhikr",
    desc: "High reward, tawheed, family, knowledge",
    hint: "Reward, tawheed, family",
    icon: BookOpen,
    occasions: ["high-reward", "tawheed", "family", "knowledge", "gathering", "general"],
  },
];

export const shelfByKey = (k) => SHELVES.find((s) => s.key === k);

// The shelf an occasion lives on, for old links such as ?occasion=anxiety.
export const shelfOfOccasion = (occ) => SHELVES.find((s) => s.occasions?.includes(occ))?.key || null;

// The shelf a set ("list") or dhikr belongs to, which also picks its icon.
export const shelfOfItem = (kind, data) => {
  if (typeof data?.id === "string" && data.id.startsWith("c_")) return "yours";
  if (data?.tags?.includes("daily")) return "moments";
  if (data?.tags?.includes("names-of-allah")) return "names";
  const occ = kind === "list" ? data?.occasion : data?.tags?.find((t) => shelfOfOccasion(t));
  return (occ && shelfOfOccasion(occ)) || "more";
};
