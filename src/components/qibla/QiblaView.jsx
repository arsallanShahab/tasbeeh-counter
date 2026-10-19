import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { X, MapPin, Compass, Check } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { qiblaBearing, distanceToKaaba, timezoneCity } from "../../utils/prayerTimes";
import { Button, IconButton } from "../common/Button";

const COMPASS_DIRS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
const dirText = (deg) => COMPASS_DIRS[Math.round((deg % 360) / 22.5) % 16];

/* Position on the dial: angle in degrees from north, radius as a % of size. */
const polar = (deg, r) => {
  const a = (deg * Math.PI) / 180;
  return { left: `${50 + r * Math.sin(a)}%`, top: `${50 - r * Math.cos(a)}%` };
};

/* Kaaba glyph: a cube with the kiswa band, drawn so it reads at 20px. */
const KaabaGlyph = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 3 20 7v10l-8 4-8-4V7l8-4Z" fill="currentColor" />
    <path d="M4 9.2 12 13.2 20 9.2" fill="none" stroke="var(--gold)" strokeWidth="1.6" />
    <path d="M12 13.2V21" fill="none" stroke="var(--bg)" strokeOpacity="0.35" strokeWidth="1" />
  </svg>
);

/* Unwrap a 0-360 heading into a continuous value so spring rotations always
   take the short way across the 360/0 seam. */
function useContinuousAngle(target) {
  const [cont, setCont] = useState(0);
  const lastRef = useRef(null);
  const contRef = useRef(0);
  useEffect(() => {
    if (target == null) return;
    if (lastRef.current == null) {
      lastRef.current = target;
      contRef.current = target;
      setCont(target);
      return;
    }
    if (target !== lastRef.current) {
      const delta = ((((target - lastRef.current) % 360) + 540) % 360) - 180;
      lastRef.current = target;
      contRef.current += delta;
      setCont(contRef.current);
    }
  }, [target]);
  return cont;
}

export const QiblaView = () => {
  const { settings, requestPrayerLocation, feel } = useApp();
  const navigate = useNavigate();
  const loc = settings.prayer?.location || {};
  const hasLoc = loc.lat != null && loc.lng != null;

  const [heading, setHeading] = useState(null);
  const [sensor, setSensor] = useState("idle"); // idle | active | denied | unsupported
  const [locState, setLocState] = useState("idle");
  const [locError, setLocError] = useState("");
  const alignedRef = useRef(false);

  const bearing = useMemo(() => (hasLoc ? qiblaBearing(loc.lat, loc.lng) : null), [hasLoc, loc.lat, loc.lng]);
  const distance = useMemo(() => (hasLoc ? distanceToKaaba(loc.lat, loc.lng) : null), [hasLoc, loc.lat, loc.lng]);

  const qiblaScreenAngle = bearing != null && heading != null ? (bearing - heading + 360) % 360 : null;
  const aligned = qiblaScreenAngle != null && (qiblaScreenAngle <= 6 || qiblaScreenAngle >= 354);

  useEffect(() => {
    if (aligned && !alignedRef.current) {
      alignedRef.current = true;
      feel("target");
    } else if (!aligned) {
      alignedRef.current = false;
    }
  }, [aligned, feel]);

  const handleOrientation = useCallback((e) => {
    let hd = null;
    if (typeof e.webkitCompassHeading === "number") hd = e.webkitCompassHeading;
    else if (typeof e.alpha === "number") hd = 360 - e.alpha;
    if (hd != null && !Number.isNaN(hd)) {
      setHeading(((hd % 360) + 360) % 360);
      setSensor((s) => (s === "active" ? s : "active"));
    }
  }, []);

  const attach = useCallback(() => {
    if (typeof window === "undefined") return;
    const evt = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
    window.addEventListener(evt, handleOrientation, true);
  }, [handleOrientation]);

  const needsPermission =
    typeof window !== "undefined" &&
    window.DeviceOrientationEvent &&
    typeof window.DeviceOrientationEvent.requestPermission === "function";

  const enableCompass = async () => {
    if (needsPermission) {
      try {
        const res = await window.DeviceOrientationEvent.requestPermission();
        if (res === "granted") attach();
        else setSensor("denied");
      } catch {
        setSensor("denied");
      }
    } else {
      attach();
    }
  };

  useEffect(() => {
    if (!hasLoc || needsPermission) return;
    attach();
    const t = setTimeout(() => setSensor((s) => (s === "active" ? s : "unsupported")), 3000);
    return () => {
      clearTimeout(t);
      window.removeEventListener("deviceorientationabsolute", handleOrientation, true);
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [hasLoc, needsPermission, attach, handleOrientation]);

  useEffect(
    () => () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation, true);
      window.removeEventListener("deviceorientation", handleOrientation, true);
    },
    [handleOrientation]
  );

  const enableLocation = async () => {
    setLocState("loading");
    setLocError("");
    try {
      await requestPrayerLocation();
      setLocState("idle");
    } catch (e) {
      setLocState("idle");
      setLocError(
        e?.code === 1
          ? "Location access is blocked. Allow it for this site, or enter coordinates in Settings."
          : "Your location couldn't be found. Try again, or enter it in Settings."
      );
    }
  };

  const dialRotation = useContinuousAngle(heading != null ? -heading : 0);
  const kaabaAngle = bearing != null ? bearing : 0;
  const needleAngle = useContinuousAngle(qiblaScreenAngle != null ? qiblaScreenAngle : kaabaAngle);
  const live = sensor === "active" && heading != null;

  const status = live ? (
    <p className={`text-[0.9375rem] font-medium ${aligned ? "text-accent" : "text-ink"}`} aria-live="polite">
      {aligned ? "You are facing the Qibla." : "Turn slowly until the Kaaba reaches the top."}
    </p>
  ) : sensor === "denied" ? (
    <p className="max-w-[34ch] text-[0.9375rem] leading-relaxed text-muted">
      Compass access was declined. Face {Math.round(bearing)}° ({dirText(bearing)}) from north instead.
    </p>
  ) : sensor === "unsupported" ? (
    <p className="max-w-[34ch] text-[0.9375rem] leading-relaxed text-muted">
      This device has no compass. Face {Math.round(bearing)}° ({dirText(bearing)}) from north.
    </p>
  ) : needsPermission ? (
    <Button icon={Compass} onClick={enableCompass}>
      Turn on the compass
    </Button>
  ) : (
    <p className="text-[0.9375rem] text-muted">Waiting for the compass…</p>
  );

  return (
    <div className="flex min-h-[calc(100svh-1.5rem)] flex-col lg:min-h-[calc(100svh-3rem)]">
      <header className="flex items-center gap-2">
        <IconButton icon={X} label="Close" onClick={() => navigate(-1)} className="-ml-2" />
        <h1 className="flex-1 text-center font-display text-lg text-ink">
          Qibla<span className="sr-only"> direction finder, a live compass to the Kaaba in Makkah</span>
        </h1>
        <span className="w-11" aria-hidden="true" />
      </header>

      {!hasLoc ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-line text-ink">
            <KaabaGlyph size={28} />
          </span>
          <p className="font-display text-2xl text-ink">Where are you praying from?</p>
          <p className="mt-2 max-w-[34ch] text-[0.9375rem] leading-relaxed text-muted">
            Your location is needed to point you to the Kaaba. It stays on this device.
          </p>
          <Button icon={MapPin} loading={locState === "loading"} onClick={enableLocation} className="mt-6">
            Use my location
          </Button>
          {locError && (
            <p className="mt-4 max-w-[34ch] text-sm text-danger" role="alert">
              {locError}
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-10 py-6 lg:flex-row lg:gap-20">
          {/* Dial */}
          <div className="relative aspect-square w-(--dial) [--dial:min(18rem,78vw)] lg:[--dial:22rem]">
            {/* Fixed pointer: the direction the device faces. */}
            <span
              aria-hidden="true"
              className={`absolute left-1/2 -top-3 z-20 h-0 w-0 -translate-x-1/2 border-x-[7px] border-t-[12px] border-x-transparent ${
                aligned ? "border-t-[var(--primary)]" : "border-t-[var(--text)]"
              }`}
            />
            <motion.div
              className="absolute inset-0 rounded-full border border-line-strong bg-surface"
              animate={{ rotate: dialRotation }}
              transition={{ type: "spring", stiffness: 90, damping: 18, mass: 0.5 }}
            >
              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
                {Array.from({ length: 72 }).map((_, i) => {
                  const major = i % 6 === 0;
                  return (
                    <line
                      key={i}
                      x1="100"
                      y1="5"
                      x2="100"
                      y2={major ? 14 : 10}
                      stroke={major ? "var(--muted)" : "var(--line-strong)"}
                      strokeWidth={major ? 1.4 : 0.8}
                      strokeLinecap="round"
                      transform={`rotate(${i * 5} 100 100)`}
                    />
                  );
                })}
              </svg>
              {[
                { d: "N", a: 0 },
                { d: "E", a: 90 },
                { d: "S", a: 180 },
                { d: "W", a: 270 },
              ].map((t) => (
                <span
                  key={t.d}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 text-sm leading-none ${t.d === "N" ? "font-semibold text-ink" : "text-muted"}`}
                  style={{ ...polar(t.a, 38), transform: `translate(-50%, -50%) rotate(${-dialRotation}deg)` }}
                >
                  {t.d}
                </span>
              ))}
              <span
                className={`absolute flex h-10 w-10 items-center justify-center rounded-full ${aligned ? "bg-accent text-on-accent" : "bg-ink text-page"}`}
                style={{ ...polar(kaabaAngle, 26), transform: `translate(-50%, -50%) rotate(${-dialRotation}deg)` }}
              >
                <KaabaGlyph />
              </span>
            </motion.div>

            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 z-[5]"
              animate={{ rotate: needleAngle }}
              transition={{ type: "spring", stiffness: 90, damping: 18, mass: 0.5 }}
              aria-hidden="true"
            >
              <div
                className={`absolute bottom-0 left-1/2 w-0.5 -translate-x-1/2 rounded-full ${aligned ? "bg-accent" : "bg-ink"}`}
                style={{ height: "calc(var(--dial) * 0.24)" }}
              />
            </motion.div>

            <div className="absolute left-1/2 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-page">
              {aligned ? <Check size={22} className="text-accent" aria-hidden="true" /> : <span className="h-2 w-2 rounded-full bg-ink" />}
            </div>
          </div>

          {/* Readout */}
          <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
            <div>
              <p className="eyebrow">Qibla bearing</p>
              <p className={`numerals mt-2 font-display text-[4rem] leading-none ${aligned ? "text-accent" : "text-ink"}`}>
                {Math.round(bearing)}°
              </p>
              <p className="numerals mt-2 text-[0.9375rem] text-muted">
                {dirText(bearing)} from north · {distance?.toLocaleString()} km to Makkah
              </p>
            </div>
            {status}
            <p className="flex items-center gap-1.5 text-sm text-muted">
              <MapPin size={14} aria-hidden="true" /> {loc.label || timezoneCity()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QiblaView;
