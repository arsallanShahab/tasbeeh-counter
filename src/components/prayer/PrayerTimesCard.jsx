import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { MapPin, Compass, Settings2, Sunrise, Clock, AlertCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import {
  prayerSchedule,
  PRAYER_KEYS,
  PRAYER_LABELS,
  PRAYER_ARABIC,
  fmtTime,
  fmtCountdown,
} from "../../utils/prayerTimes";

export const PrayerTimesCard = () => {
  const { settings, requestPrayerLocation } = useApp();
  const navigate = useNavigate();
  const p = settings.prayer || {};
  const loc = p.location || {};
  const hasLoc = loc.lat != null && loc.lng != null;

  const [now, setNow] = useState(() => Date.now());
  const [locState, setLocState] = useState("idle"); // idle | loading | error
  const [locError, setLocError] = useState("");

  // One ticking clock drives both the live countdown (per second) and the
  // schedule recompute (per minute, via the memo key below).
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const cfgKey = `${p.method}|${p.madhhab}|${p.highLatRule}|${JSON.stringify(p.offsets)}`;
  const minute = Math.floor(now / 60000);

  const schedule = useMemo(() => {
    if (!hasLoc) return null;
    try {
      return prayerSchedule({
        lat: loc.lat,
        lng: loc.lng,
        method: p.method,
        madhhab: p.madhhab,
        highLatRule: p.highLatRule,
        offsets: p.offsets,
        date: new Date(),
      });
    } catch (e) {
      console.warn("Prayer schedule failed:", e);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoc, loc.lat, loc.lng, cfgKey, minute]);

  const enableLocation = async () => {
    setLocState("loading");
    setLocError("");
    try {
      await requestPrayerLocation();
      setLocState("idle");
    } catch (e) {
      setLocState("error");
      setLocError(
        e?.code === 1
          ? "Location permission was denied. Enable it for this app, or set your location manually in Settings."
          : "Couldn't get your location. Try again or set it manually in Settings."
      );
    }
  };

  /* ── No location yet: invite the user to enable it ───────────────────── */
  if (!hasLoc) {
    return (
      <Card className="p-5 border-[var(--line)] shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-[var(--gold)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
            Prayer Times
          </span>
        </div>
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          Get accurate salah times for your location — calculated on your device,
          fully offline.
        </p>
        <button
          onClick={enableLocation}
          disabled={locState === "loading"}
          className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-bold text-white cursor-pointer active:scale-[0.97] hover:brightness-105 transition-all shadow-sm disabled:opacity-60"
          style={{ background: "var(--primary)" }}
        >
          <MapPin size={14} />
          {locState === "loading" ? "Locating…" : "Use my location"}
        </button>
        {locState === "error" && (
          <p className="flex items-start gap-1.5 text-[11px] text-[var(--danger)] leading-snug">
            <AlertCircle size={13} className="mt-0.5 shrink-0" />
            {locError}
          </p>
        )}
      </Card>
    );
  }

  if (!schedule) {
    return (
      <Card className="p-5 border-[var(--line)] shadow-sm">
        <p className="text-xs text-[var(--muted)]">Couldn't compute prayer times.</p>
      </Card>
    );
  }

  const next = schedule.next;
  const countdownMs = next.time.getTime() - now;

  return (
    <Card className="p-5 border-[var(--line)] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <Clock size={16} className="text-[var(--gold)] shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
            Prayer Times
          </span>
          {loc.label && (
            <span className="flex items-center gap-0.5 text-[10px] text-[var(--muted)] truncate ml-1">
              <MapPin size={10} /> {loc.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/qibla")}
            aria-label="Open Qibla compass"
            className="flex h-8 w-8 items-center justify-center rounded-full cursor-pointer"
            style={{ background: "color-mix(in srgb, var(--primary) 12%, transparent)", color: "var(--primary)" }}
          >
            <Compass size={15} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/settings?panel=prayer")}
            aria-label="Prayer time settings"
            className="flex h-8 w-8 items-center justify-center rounded-full cursor-pointer"
            style={{ background: "color-mix(in srgb, var(--surface2) 70%, transparent)", color: "var(--muted)" }}
          >
            <Settings2 size={15} />
          </motion.button>
        </div>
      </div>

      {/* Next-prayer hero */}
      <div className="mb-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--gold)]">
            Up next
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="font-display text-2xl font-bold text-[var(--text)] leading-tight">
              {PRAYER_LABELS[next.key]}
            </h3>
            <span dir="rtl" className="font-arabic text-lg text-[var(--muted)]">
              {PRAYER_ARABIC[next.key]}
            </span>
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            in {fmtCountdown(countdownMs)}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-display text-2xl font-bold" style={{ color: "var(--primary)" }}>
            {fmtTime(next.time, p.hour12)}
          </p>
        </div>
      </div>

      {/* All times for the day */}
      <div className="grid grid-cols-6 gap-1 rounded-2xl border border-[var(--line)]/60 bg-[var(--surface2)]/40 p-1.5">
        {PRAYER_KEYS.map((key) => {
          const isNext = next.key === key && !next.tomorrow;
          const isCurrent = schedule.current.key === key && !schedule.current.yesterday;
          const isSunrise = key === "sunrise";
          return (
            <div
              key={key}
              className="flex flex-col items-center gap-1 rounded-xl py-2 transition-colors"
              style={{
                background: isNext
                  ? "color-mix(in srgb, var(--primary) 16%, transparent)"
                  : isCurrent
                  ? "color-mix(in srgb, var(--gold) 12%, transparent)"
                  : "transparent",
              }}
            >
              <span
                className="text-[9px] font-bold uppercase tracking-wide flex items-center gap-0.5"
                style={{
                  color: isNext
                    ? "var(--primary)"
                    : isSunrise
                    ? "var(--muted)"
                    : "var(--text)",
                }}
              >
                {isSunrise && <Sunrise size={9} />}
                {PRAYER_LABELS[key]}
              </span>
              <span
                className="text-[10px] font-semibold tabular-nums"
                style={{ color: isNext ? "var(--primary)" : "var(--muted)" }}
              >
                {fmtTime(schedule.today[key], p.hour12)}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PrayerTimesCard;
