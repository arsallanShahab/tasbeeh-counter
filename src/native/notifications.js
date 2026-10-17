import { LocalNotifications } from "@capacitor/local-notifications";
import { buildPrayerAlerts, computePrayerTimes } from "../utils/prayerTimes";
import { lastThird } from "../utils/duaTimes";
import { addDays, midnight } from "../utils/adhkar";
import { dateKey } from "../utils/stats";

/* Reminders in the app are real scheduled notifications: they fire with the
   app closed. Daily reminders repeat at their time. Prayer and last-third
   reminders move each day, so the next week is scheduled and refreshed each
   time the app opens. */
const DAYS_AHEAD = 7;

// Notification ids must be 32-bit integers; derive them from stable keys.
const idOf = (key) => {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
};

const linkOf = (a) =>
  a.targetType === "dhikr" && a.targetId ? `/counter?dhikr=${a.targetId}` : a.targetType === "list" && a.targetId ? `/counter?list=${a.targetId}` : "/";

const atTime = (day, hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m);
};

// Every notification to schedule, from the same settings the web app uses.
export function buildNativeReminders(settings, now = new Date()) {
  const out = [];
  if (settings.alertsEnabled) {
    for (const a of settings.alerts || []) {
      if (!a.enabled || !a.time) continue;
      const [hour, minute] = a.time.split(":").map(Number);
      out.push({ key: `a-${a.id}`, title: a.title, body: a.body || "It's time for your dhikr.", on: { hour, minute }, url: linkOf(a) });
    }
  }
  const p = settings.prayer;
  const loc = p?.location;
  if (p?.enabled && loc?.lat != null && loc?.lng != null) {
    for (let d = 0; d < DAYS_AHEAD; d++) {
      const day = addDays(midnight(now), d);
      if (p.reminders?.enabled) {
        try {
          const { times } = computePrayerTimes({ lat: loc.lat, lng: loc.lng, method: p.method, madhhab: p.madhhab, highLatRule: p.highLatRule, offsets: p.offsets, date: new Date(day.getFullYear(), day.getMonth(), day.getDate(), 12) });
          for (const a of buildPrayerAlerts(p, { today: times })) {
            const at = atTime(day, a.time);
            if (at > now) out.push({ key: `p-${a.id}-${dateKey(day)}`, title: a.title, body: a.body, at, url: linkOf(a) });
          }
        } catch {
          // a day the times cannot be worked out is skipped
        }
      }
      if (p.reminders?.lastThird) {
        const lt = lastThird(p, new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59));
        if (lt && lt.start > now) {
          out.push({ key: `n-${dateKey(day)}`, title: "The last third of the night", body: "A time when du'a is answered. Tap for the night adhkar.", at: lt.start, url: "/counter?list=tahajjud" });
        }
      }
    }
  }
  return out;
}

export async function nativePermission() {
  const { display } = await LocalNotifications.checkPermissions();
  return display === "granted" ? "granted" : display === "denied" ? "denied" : "default";
}

export async function requestNativePermission() {
  const { display } = await LocalNotifications.requestPermissions();
  return display === "granted" ? "granted" : display === "denied" ? "denied" : "default";
}

// Replace everything scheduled with `list`.
export async function syncNativeReminders(list) {
  const pending = await LocalNotifications.getPending();
  if (pending.notifications.length) await LocalNotifications.cancel({ notifications: pending.notifications.map((n) => ({ id: n.id })) });
  if (!list.length) return;
  await LocalNotifications.schedule({
    notifications: list.map((r) => ({
      id: idOf(r.key),
      title: r.title,
      body: r.body,
      extra: { url: r.url },
      schedule: r.on ? { on: r.on, allowWhileIdle: true } : { at: r.at, allowWhileIdle: true },
    })),
  });
}

// Tapping a reminder opens what it points at.
export function onReminderTap(open) {
  const handle = LocalNotifications.addListener("localNotificationActionPerformed", (e) => open(e.notification?.extra?.url || "/"));
  return () => handle.then((h) => h.remove());
}
