import { store } from "./storage";
import { STORAGE_VERSION } from "../constants/dhikrData";

/* A backup is a self-describing JSON snapshot of every localStorage key that
   makes up the user's state. Bumping BACKUP_FORMAT lets future readers detect
   shape changes; the importer is lenient and tolerates missing keys. */
export const BACKUP_TYPE = "tasbeeh-go-backup";
export const BACKUP_FORMAT = 1;

// Keys that together form a complete restore-able snapshot.
const BACKUP_KEYS = [
  "dhikrs",
  "lists",
  "pinned",
  "stats",
  "settings",
  "session",
  "complete",
  "names_session",
];

/* Read the current persisted state straight from storage (not React state) so
   exports are consistent even mid-session. */
export function buildBackup(appVersion = "") {
  const data = {};
  for (const key of BACKUP_KEYS) {
    data[key] = store.get(key, null);
  }
  return {
    type: BACKUP_TYPE,
    format: BACKUP_FORMAT,
    storageVersion: store.get("storage_version", STORAGE_VERSION),
    appVersion,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export function backupFilename() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(
    d.getHours()
  )}${pad(d.getMinutes())}`;
  return `tasbeeh-backup-${stamp}.json`;
}

/* Trigger a file download of the current backup. Returns the backup object so
   callers can show a summary. */
export function downloadBackup(appVersion = "") {
  const backup = buildBackup(appVersion);
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = backupFilename();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Defer revocation so the download has time to start (Safari quirk).
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return backup;
}

/* Validate + normalise an imported file's text into { data, meta }.
   Throws a user-readable Error on anything that isn't a recognisable backup. */
export function parseBackup(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    throw new Error("This file isn't valid JSON.");
  }
  if (!parsed || typeof parsed !== "object") {
    throw new Error("This file doesn't look like a Tasbeeh backup.");
  }

  // Accept both the wrapped backup ({ type, data }) and a bare data object.
  const data = parsed.type === BACKUP_TYPE && parsed.data ? parsed.data : parsed;

  const looksLikeData =
    data &&
    typeof data === "object" &&
    (Array.isArray(data.dhikrs) ||
      Array.isArray(data.lists) ||
      (data.stats && typeof data.stats === "object") ||
      (data.settings && typeof data.settings === "object"));

  if (!looksLikeData) {
    throw new Error("This file doesn't contain Tasbeeh backup data.");
  }

  return {
    data,
    meta: {
      storageVersion: parsed.storageVersion ?? null,
      appVersion: parsed.appVersion ?? null,
      exportedAt: parsed.exportedAt ?? null,
    },
  };
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Couldn't read that file."));
    reader.readAsText(file);
  });
}
