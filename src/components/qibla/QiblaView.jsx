import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, MapPin, Navigation, Compass, AlertCircle, Check } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { qiblaBearing, distanceToKaaba, timezoneCity } from "../../utils/prayerTimes";

const COMPASS_DIRS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
const dirText = (deg) => COMPASS_DIRS[Math.round(((deg % 360) / 22.5)) % 16];

/* Turn a wrapping 0–360 angle (compass heading) into a continuous, ever-
   accumulating value so spring rotations always take the shortest path instead
   of unwinding the long way around when crossing the 360°↔0° seam. State-driven
   (updated in an effect) so it never reads refs during render. */
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
      const delta = ((((target - lastRef.current) % 360) + 540) % 360) - 180; // (-180, 180]
      lastRef.current = target;
      contRef.current += delta;
      setCont(contRef.current);
    }
  }, [target]);
  return cont;
}

export const QiblaView = () => {
  const { settings, requestPrayerLocation, vibe } = useApp();
  const navigate = useNavigate();
  const loc = settings.prayer?.location || {};
  const hasLoc = loc.lat != null && loc.lng != null;

  const [heading, setHeading] = useState(null); // device compass heading, deg from N
  const [sensor, setSensor] = useState("idle"); // idle | active | denied | unsupported
  const [locState, setLocState] = useState("idle");
  const [locError, setLocError] = useState("");
  const alignedRef = useRef(false);

  const bearing = useMemo(
    () => (hasLoc ? qiblaBearing(loc.lat, loc.lng) : null),
    [hasLoc, loc.lat, loc.lng]
  );
  const distance = useMemo(
    () => (hasLoc ? distanceToKaaba(loc.lat, loc.lng) : null),
    [hasLoc, loc.lat, loc.lng]
  );

  // Screen-space angle of the Qibla relative to where the device points (top).
  const qiblaScreenAngle =
    bearing != null && heading != null ? ((bearing - heading + 360) % 360) : null;
  const aligned =
    qiblaScreenAngle != null && (qiblaScreenAngle <= 6 || qiblaScreenAngle >= 354);

  // Haptic nudge when you swing onto the Qibla.
  useEffect(() => {
    if (aligned && !alignedRef.current) {
      alignedRef.current = true;
      vibe([0, 38, 28, 38]);
    } else if (!aligned) {
      alignedRef.current = false;
    }
  }, [aligned, vibe]);

  // Stable handler so add/removeEventListener pair reliably. It only reads the
  // event and calls setters, so it has no reactive dependencies.
  const handleOrientation = useCallback((e) => {
    let hd = null;
    if (typeof e.webkitCompassHeading === "number") {
      hd = e.webkitCompassHeading; // iOS — already true-north referenced
    } else if (typeof e.alpha === "number") {
      hd = 360 - e.alpha; // Android absolute orientation
    }
    if (hd != null && !Number.isNaN(hd)) {
      setHeading(((hd % 360) + 360) % 360);
      setSensor((s) => (s === "active" ? s : "active"));
    }
  }, []);

  const attach = useCallback(() => {
    if (typeof window === "undefined") return;
    const evt = "ondeviceorientationabsolute" in window
      ? "deviceorientationabsolute"
      : "deviceorientation";
    window.addEventListener(evt, handleOrientation, true);
  }, [handleOrientation]);

  const needsPermission =
    typeof window !== "undefined" &&
    window.DeviceOrientationEvent &&
    typeof window.DeviceOrientationEvent.requestPermission === "function";

  const enableCompass = async () => {
    // iOS 13+ gates the sensor behind a permission request from a user gesture.
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

  // Auto-attach where no explicit permission is required (Android / desktop).
  // If no reading arrives (e.g. a desktop without a magnetometer) fall back to
  // the static numeric bearing. The setState here runs in a timeout, not
  // synchronously in the effect body, so it can't cascade renders.
  useEffect(() => {
    if (!hasLoc || needsPermission) return;
    attach();
    const t = setTimeout(
      () => setSensor((s) => (s === "active" ? s : "unsupported")),
      3000
    );
    return () => {
      clearTimeout(t);
      window.removeEventListener("deviceorientationabsolute", handleOrientation, true);
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [hasLoc, needsPermission, attach, handleOrientation]);

  // Clean up listeners added via the permission button path on unmount.
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
      setLocState("error");
      setLocError(
        e?.code === 1
          ? "Location permission denied. Enable it or set your location in Settings."
          : "Couldn't get your location. Try again or set it in Settings."
      );
    }
  };

  const back = () => navigate(-1);

  // Dial rotates opposite to heading so its North tick tracks true north; in
  // static mode (no sensor) we keep North up and just mark the Qibla bearing.
  // Both rotations are unwrapped so they animate the short way across 0°/360°.
  const dialRotation = useContinuousAngle(heading != null ? -heading : 0);
  const kaabaAngle = bearing != null ? bearing : 0;
  const needleAngle = useContinuousAngle(qiblaScreenAngle != null ? qiblaScreenAngle : kaabaAngle);

  return (
    <div className="anim-fade min-h-svh flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 pt-1 pb-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={back}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full shrink-0 cursor-pointer"
          style={{
            background: "color-mix(in srgb, var(--surface2) 70%, transparent)",
            border: "1px solid color-mix(in srgb, var(--line) 60%, transparent)",
            color: "var(--text)",
          }}
        >
          <ArrowLeft size={18} />
        </motion.button>
        <div className="flex items-center gap-2">
          <Compass size={20} className="text-[var(--gold)]" />
          <h1 className="font-display text-xl text-[var(--text)]">
            Qibla<span className="sr-only"> Direction Finder — live compass to the Kaaba in Makkah</span>
          </h1>
        </div>
      </div>

      {!hasLoc ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-3xl"
            style={{ background: "color-mix(in srgb, var(--primary) 12%, transparent)", color: "var(--primary)" }}
          >
            <MapPin size={28} />
          </div>
          <p className="text-sm text-[var(--muted)] leading-relaxed max-w-xs">
            We need your location to point you toward the Kaaba in Makkah.
          </p>
          <button
            onClick={enableLocation}
            disabled={locState === "loading"}
            className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white cursor-pointer active:scale-[0.97] hover:brightness-105 transition-all shadow-sm disabled:opacity-60"
            style={{ background: "var(--primary)" }}
          >
            <MapPin size={15} />
            {locState === "loading" ? "Locating…" : "Use my location"}
          </button>
          {locState === "error" && (
            <p className="flex items-start gap-1.5 text-[12px] text-[var(--danger)] leading-snug max-w-xs">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              {locError}
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-7 pb-10">
          {/* Bearing readout */}
          <div className="text-center">
            <p className="font-display text-5xl font-bold" style={{ color: aligned ? "var(--primary)" : "var(--text)" }}>
              {Math.round(bearing)}°
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">
              {dirText(bearing)} from North · {distance?.toLocaleString()} km to Makkah
            </p>
          </div>

          {/* Compass dial — 288px (radius 144). Every radial element is placed
              with the clock-number pattern: translate to center, rotate to its
              angle, push outward, then counter-rotate the content upright. */}
          <div className="relative h-72 w-72">
            {/* Fixed top pointer — the direction the device is facing. Its tip
                meets the rim and points inward. */}
            <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-2.5">
              <div
                className="h-0 w-0"
                style={{
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderTop: `13px solid ${aligned ? "var(--primary)" : "var(--gold)"}`,
                }}
              />
            </div>

            {/* Rotating dial */}
            <motion.div
              className="absolute inset-0 rounded-full border"
              style={{
                borderColor: "color-mix(in srgb, var(--line) 80%, transparent)",
                background:
                  "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--surface2) 70%, transparent), color-mix(in srgb, var(--surface) 55%, transparent))",
              }}
              animate={{ rotate: dialRotation }}
              transition={{ type: "spring", stiffness: 90, damping: 18, mass: 0.5 }}
            >
              {/* Minor ticks — radial bars hugging the rim (rotate with dial). */}
              {Array.from({ length: 72 }).map((_, i) => {
                const major = i % 6 === 0;
                return (
                  <div
                    key={i}
                    className="absolute left-1/2 top-1/2"
                    style={{ transform: `translate(-50%, -50%) rotate(${i * 5}deg) translateY(-136px)` }}
                  >
                    <div
                      className="rounded-full"
                      style={{
                        width: major ? 2 : 1,
                        height: major ? 12 : 6,
                        background: `color-mix(in srgb, var(--muted) ${major ? 60 : 35}%, transparent)`,
                      }}
                    />
                  </div>
                );
              })}

              {/* Cardinal letters */}
              {[
                { d: "N", a: 0, c: "var(--danger)" },
                { d: "E", a: 90, c: "var(--muted)" },
                { d: "S", a: 180, c: "var(--muted)" },
                { d: "W", a: 270, c: "var(--muted)" },
              ].map((t) => (
                <div
                  key={t.d}
                  className="absolute left-1/2 top-1/2"
                  style={{ transform: `translate(-50%, -50%) rotate(${t.a}deg) translateY(-114px)` }}
                >
                  <span
                    className="block text-sm font-bold leading-none"
                    style={{ color: t.c, transform: `rotate(${-t.a - dialRotation}deg)` }}
                  >
                    {t.d}
                  </span>
                </div>
              ))}

              {/* Kaaba marker at the Qibla bearing (content stays upright). */}
              <div
                className="absolute left-1/2 top-1/2"
                style={{ transform: `translate(-50%, -50%) rotate(${kaabaAngle}deg) translateY(-92px)` }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl text-xl shadow-lg ring-2"
                  style={{
                    background: aligned ? "var(--primary)" : "var(--gold)",
                    "--tw-ring-color": "color-mix(in srgb, var(--surface) 85%, transparent)",
                    transform: `rotate(${-kaabaAngle - dialRotation}deg)`,
                  }}
                >
                  🕋
                </div>
              </div>
            </motion.div>

            {/* Needle from center toward the Qibla (above the dial, below hub). */}
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 z-[5]"
              animate={{ rotate: needleAngle }}
              transition={{ type: "spring", stiffness: 90, damping: 18, mass: 0.5 }}
              style={{ transformOrigin: "center" }}
            >
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  bottom: 0,
                  width: 3,
                  height: 92,
                  borderRadius: 3,
                  background: `linear-gradient(to top, transparent, ${aligned ? "var(--primary)" : "var(--gold)"})`,
                }}
              />
            </motion.div>

            {/* Center hub */}
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{
                  background: "var(--surface)",
                  border: "1px solid color-mix(in srgb, var(--line) 70%, transparent)",
                  color: aligned ? "var(--primary)" : "var(--muted)",
                }}
              >
                {aligned ? <Check size={24} strokeWidth={3} /> : <Navigation size={20} />}
              </div>
            </div>
          </div>

          {/* Status / actions */}
          <div className="flex min-h-[3rem] flex-col items-center gap-2 px-6 text-center">
            {sensor === "active" && heading != null ? (
              <p
                className="text-sm font-bold"
                style={{ color: aligned ? "var(--primary)" : "var(--muted)" }}
              >
                {aligned ? "Facing the Qibla — Allahu Akbar" : "Turn until the marker reaches the top"}
              </p>
            ) : sensor === "denied" ? (
              <p className="flex items-start gap-1.5 text-[12px] text-[var(--danger)] leading-snug max-w-xs">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                Compass access was denied. The Qibla is {Math.round(bearing)}° ({dirText(bearing)}) from North.
              </p>
            ) : sensor === "unsupported" ? (
              <p className="text-[12px] text-[var(--muted)] leading-snug max-w-xs">
                No compass on this device. Face {Math.round(bearing)}° ({dirText(bearing)}) from North.
              </p>
            ) : needsPermission ? (
              <button
                onClick={enableCompass}
                className="flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-white cursor-pointer active:scale-[0.97] hover:brightness-105 transition-all shadow-sm"
                style={{ background: "var(--primary)" }}
              >
                <Compass size={15} /> Enable compass
              </button>
            ) : (
              <p className="text-[12px] text-[var(--muted)] leading-snug max-w-xs">
                Calibrating compass… Meanwhile, the Qibla is {Math.round(bearing)}° ({dirText(bearing)}) from North.
              </p>
            )}
            {loc.label && (
              <p className="flex items-center gap-1 text-[10px] text-[var(--muted)]">
                <MapPin size={10} /> {loc.label || timezoneCity()}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QiblaView;
