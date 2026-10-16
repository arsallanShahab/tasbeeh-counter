import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Compass, SlidersHorizontal } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Panel, SectionHeader } from "../common/Layout";
import { Button, IconButton } from "../common/Button";
import {
  prayerSchedule,
  PRAYER_KEYS,
  PRAYER_LABELS,
  PRAYER_ARABIC,
  fmtTime,
  fmtCountdown,
} from "../../utils/prayerTimes";

/* Prayer times as a quiet timetable: the next prayer set large with its
   countdown, then the day's six times in one hairline row. */
export const PrayerTimesCard = () => {
  const { settings, requestPrayerLocation } = useApp();
  const navigate = useNavigate();
  const p = settings.prayer || {};
  const loc = p.location || {};
  const hasLoc = loc.lat != null && loc.lng != null;

  const [now, setNow] = useState(() => Date.now());
  const [locState, setLocState] = useState("idle"); // idle | loading | error
  const [locError, setLocError] = useState("");

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
          ? "Location access is blocked. Allow it for this site, or enter your city in Settings."
          : "Your location couldn't be found. Try again, or enter it in Settings."
      );
    }
  };

  const actions = (
    <div className="-mr-2 flex items-center">
      <IconButton icon={Compass} label="Qibla direction" size="sm" onClick={() => navigate("/qibla")} />
      <IconButton
        icon={SlidersHorizontal}
        label="Prayer time settings"
        size="sm"
        onClick={() => navigate("/settings?panel=prayer")}
      />
    </div>
  );

  if (!hasLoc) {
    return (
      <section aria-labelledby="prayer-h" className="space-y-4">
        <SectionHeader id="prayer-h" title="Prayer times" />
        <Panel className="p-5">
          <p className="text-[0.9375rem] leading-relaxed text-muted">
            Set your location to see today&rsquo;s salah times. They are worked out on this device and never leave it.
          </p>
          <Button
            variant="secondary"
            icon={MapPin}
            loading={locState === "loading"}
            onClick={enableLocation}
            className="mt-4"
          >
            {locState === "loading" ? "Finding you" : "Use my location"}
          </Button>
          {locState === "error" && (
            <p className="mt-3 text-sm leading-snug text-danger" role="alert">
              {locError}
            </p>
          )}
        </Panel>
      </section>
    );
  }

  if (!schedule) {
    return (
      <section aria-labelledby="prayer-h" className="space-y-4">
        <SectionHeader id="prayer-h" title="Prayer times" action={actions} />
        <p className="text-[0.9375rem] text-muted">Prayer times couldn&rsquo;t be calculated for this location.</p>
      </section>
    );
  }

  const next = schedule.next;
  const countdownMs = next.time.getTime() - now;

  return (
    <section aria-labelledby="prayer-h" className="space-y-4">
      <SectionHeader id="prayer-h" title="Prayer times" action={actions} />
      <Panel className="overflow-hidden">
        <div className="flex items-end justify-between gap-4 px-4 pb-3 pt-4">
          <div className="min-w-0">
            <p className="text-sm text-muted">
              Next{loc.label ? ` in ${loc.label}` : ""}
            </p>
            <p className="mt-1 flex items-baseline gap-2.5">
              <span className="font-display text-[1.625rem] leading-none font-medium text-ink">{PRAYER_LABELS[next.key]}</span>
              <span dir="rtl" lang="ar" className="font-arabic text-xl text-muted">
                {PRAYER_ARABIC[next.key]}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="numerals font-display text-[1.625rem] leading-none text-accent">{fmtTime(next.time, p.hour12)}</p>
            <p className="numerals mt-1 text-sm text-muted">in {fmtCountdown(countdownMs)}</p>
          </div>
        </div>
        <ol className="grid grid-cols-6 border-t border-line">
          {PRAYER_KEYS.map((key, i) => {
            const isNext = next.key === key && !next.tomorrow;
            const isSunrise = key === "sunrise";
            return (
              <li
                key={key}
                aria-current={isNext ? "time" : undefined}
                className={`flex flex-col items-center gap-1 py-3 ${i > 0 ? "border-l border-line" : ""} ${
                  isNext ? "bg-accent-soft" : ""
                }`}
              >
                <span className={`text-xs ${isNext ? "font-semibold text-accent" : isSunrise ? "text-muted" : "font-medium text-ink"}`}>
                  {PRAYER_LABELS[key]}
                </span>
                <span className={`numerals text-[0.8125rem] ${isNext ? "font-semibold text-accent" : "text-muted"}`}>
                  {fmtTime(schedule.today[key], p.hour12).replace(/\s?[AP]M$/i, "")}
                </span>
              </li>
            );
          })}
        </ol>
      </Panel>
    </section>
  );
};

export default PrayerTimesCard;
