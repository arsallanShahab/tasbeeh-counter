import { SEED_DHIKRS, SEED_LISTS, SEED_NAMES_OF_ALLAH } from "../constants/dhikrData";

// The keys that hold a person's state.
export const STATE_KEYS = ["dhikrs", "lists", "pinned", "stats", "settings", "session", "complete", "names_session"];

export const isOwnDhikr = (d) => typeof d?.id === "string" && (d.id.startsWith("c_") || !!d.tags?.includes("custom"));
export const isOwnList = (l) => typeof l?.id === "string" && l.id.startsWith("c_");

// Built-in dhikr and sets come from the code, so storage keeps only the person's own.
export function toStored(key, value) {
  if (key === "dhikrs") return (value || []).filter(isOwnDhikr);
  if (key === "lists") return (value || []).filter(isOwnList);
  return value;
}

// The reverse: the person's own items after the current built-ins.
export function withBuiltIns(key, value) {
  if (key === "dhikrs") return [...SEED_DHIKRS, ...SEED_NAMES_OF_ALLAH, ...(Array.isArray(value) ? value.filter(isOwnDhikr) : [])];
  if (key === "lists") return [...SEED_LISTS, ...(Array.isArray(value) ? value.filter(isOwnList) : [])];
  return value;
}

// A saved session can be resumed only if every dhikr it steps through still exists.
export const sessionFits = (session, dhikrs) =>
  !!session && Array.isArray(session.steps) && session.steps.every((s) => dhikrs.some((d) => d.id === s?.dhikr));
