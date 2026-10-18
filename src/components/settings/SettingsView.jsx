import { useId, useMemo, useRef, useState } from "react";
import { resolveHomeSections } from "../../utils/homeSections";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  BookOpenText, Palette, Hand, Compass, Bell, DatabaseBackup, ArrowLeft, Check, ChevronUp, ChevronDown,
  Eye, EyeOff, Plus, Trash2, MapPin, Download, Upload, RefreshCw, RotateCcw, Smartphone, Link2, CircleAlert, ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useApp } from "../../context/AppContext";
import { useIsDesktop } from "../../hooks/useMediaQuery";
import { parseBackup, readFileAsText } from "../../utils/backup";
import { PageHeader, Panel, ListGroup, ListRow, IconTile } from "../common/Layout";
import { Button, IconButton } from "../common/Button";
import { Field, TextInput, Select, Stepper } from "../common/Field";
import { Sheet } from "../common/Modal";
import { useToast } from "../common/toastContext";
import Toggle from "../common/Toggle";
import Seg from "../common/Seg";
import CounterStylePicker from "../counter/CounterStylePicker";
import { ArabicFontPicker, TextSizeControls, LanguageControl } from "./ReadingControls";
import {
  THEMES, DHIKR_FIELDS, DEFAULT_DHIKR_FIELD_ORDER, DEFAULT_DHIKR_FIELD_VISIBLE,
  HOME_SECTIONS,
} from "../../constants/dhikrData";
import { useEffectiveAppearance } from "../../utils/theme";
import {
  CALC_METHODS, HIGH_LAT_RULES, autoMethodId, SALAH_KEYS, PRAYER_KEYS, PRAYER_LABELS, prayerSchedule, fmtTime, methodName,
  hijriDisplayOffset,
} from "../../utils/prayerTimes";
import { hijriFormatted } from "../../utils/hijri";

/* ─── Building blocks ──────────────────────────────────────────────────── */

/* A titled group of settings sharing one hairline panel. */
const Group = ({ title, description, children, className = "" }) => (
  <section className={`space-y-3 ${className}`}>
    {(title || description) && (
      <div>
        {title && <h2 className="font-display text-xl leading-tight text-ink">{title}</h2>}
        {description && <p className="mt-1 max-w-[60ch] text-sm leading-relaxed text-muted">{description}</p>}
      </div>
    )}
    {children}
  </section>
);

/* One setting: label and hint on the left, its control on the right. The
   label is wired to the control so a screen reader announces both. */
const Row = ({ label, hint, children, control }) => {
  const id = useId();
  return (
    <div className="flex items-center gap-4 px-4 py-3.5">
      <div className="min-w-0 flex-1">
        <p id={id} className="text-[0.9375rem] font-medium text-ink">
          {label}
        </p>
        {hint && <p className="mt-0.5 text-sm leading-snug text-muted">{hint}</p>}
      </div>
      {control ? control(id) : children}
    </div>
  );
};

/* A sheet of choices: a tap applies and closes, arrow keys browse. */
const OptionSheet = ({ open, onClose, title, description, options, value, onChange }) => {
  const name = useId();
  return (
    <Sheet open={open} onClose={onClose} title={title} description={description}>
      <div role="radiogroup" aria-label={title} className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {options.map((o) => {
          const on = o.v === value;
          return (
            <label
              key={o.v}
              onClick={(e) => e.detail && onClose()}
              className="row-interactive relative flex min-h-[3.75rem] cursor-pointer items-center gap-3 px-4 py-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-accent"
            >
              <input
                type="radio"
                name={name}
                checked={on}
                onChange={() => onChange(o.v)}
                className="sr-only"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[0.9375rem] font-medium text-ink">{o.l}</span>
                {o.hint && <span className="mt-0.5 block text-sm leading-snug text-muted">{o.hint}</span>}
              </span>
              {o.meta && <span className="numerals shrink-0 text-sm text-muted">{o.meta}</span>}
              <span
                aria-hidden="true"
                className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${on ? "border-accent bg-accent text-on-accent" : "border-line-strong"}`}
              >
                {on && <Check size={14} strokeWidth={3} />}
              </span>
            </label>
          );
        })}
      </div>
    </Sheet>
  );
};

const HIGH_LAT_HINTS = {
  auto: "Picks the right rule for your latitude.",
  middleofthenight: "Isha no later, and Fajr no earlier, than the middle of the night.",
  seventhofthenight: "Isha within the first seventh of the night, Fajr within the last seventh.",
  twilightangle: "Splits the night in proportion to the method's twilight angles.",
};

const ToggleRow = ({ label, hint, on, onChange }) => (
  <Row label={label} hint={hint} control={(id) => <Toggle on={on} onClick={onChange} labelledBy={id} />} />
);

/* Reorderable list with a per-row visibility switch. */
const OrderList = ({ items, onMove, renderLabel, isOn, onToggle, canToggle = () => true }) => (
  <ListGroup>
    {items.map((key, idx) => {
      const on = isOn(key);
      return (
        <div key={key} className={`flex items-center gap-2 py-1.5 pl-4 pr-2 ${on ? "" : "text-muted"}`}>
          <span className="numerals w-5 font-display text-base text-muted">{idx + 1}</span>
          <span className={`min-w-0 flex-1 truncate text-[0.9375rem] ${on ? "font-medium text-ink" : "text-muted line-through decoration-line-strong"}`}>
            {renderLabel(key)}
          </span>
          <IconButton icon={ChevronUp} label={`Move ${renderLabel(key)} up`} size="sm" disabled={idx === 0} onClick={() => onMove(idx, -1)} />
          <IconButton
            icon={ChevronDown}
            label={`Move ${renderLabel(key)} down`}
            size="sm"
            disabled={idx === items.length - 1}
            onClick={() => onMove(idx, 1)}
          />
          {onToggle && (
            <IconButton
              icon={on ? Eye : EyeOff}
              label={`${on ? "Hide" : "Show"} ${renderLabel(key)}`}
              size="sm"
              pressed={on}
              disabled={!canToggle(key)}
              onClick={() => onToggle(key)}
            />
          )}
        </div>
      );
    })}
  </ListGroup>
);

const swap = (arr, i, dir) => {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

/* ─── Prayer times & Qibla ─────────────────────────────────────────────── */
const PrayerSettings = () => {
  const { settings, setSettings, requestPrayerLocation } = useApp();
  const navigate = useNavigate();
  const toast = useToast();
  const p = settings.prayer || {};
  const loc = p.location || {};
  const hasLoc = loc.lat != null && loc.lng != null;

  const [locState, setLocState] = useState("idle");
  const [locError, setLocError] = useState("");
  const [manual, setManual] = useState(false);
  const [manualVals, setManualVals] = useState({ lat: loc.lat ?? "", lng: loc.lng ?? "", label: loc.label ?? "" });
  const [manualError, setManualError] = useState("");

  const setP = (patch) => setSettings((s) => ({ ...s, prayer: { ...s.prayer, ...patch } }));
  const setOffset = (key, delta) =>
    setSettings((s) => ({
      ...s,
      prayer: {
        ...s.prayer,
        offsets: { ...s.prayer.offsets, [key]: Math.max(-60, Math.min(60, (s.prayer.offsets?.[key] || 0) + delta)) },
      },
    }));
  const setReminders = (patch) =>
    setSettings((s) => ({ ...s, prayer: { ...s.prayer, reminders: { ...s.prayer.reminders, ...patch } } }));
  const togglePrayerReminder = (key) =>
    setSettings((s) => ({
      ...s,
      prayer: {
        ...s.prayer,
        reminders: {
          ...s.prayer.reminders,
          prayers: { ...s.prayer.reminders.prayers, [key]: !(s.prayer.reminders.prayers?.[key] ?? true) },
        },
      },
    }));

  const locateMe = async () => {
    setLocState("loading");
    setLocError("");
    try {
      const r = await requestPrayerLocation();
      setManualVals({ lat: r.lat, lng: r.lng, label: r.label });
      setLocState("idle");
      toast(r.label ? `Location set to ${r.label}` : "Location updated");
    } catch (e) {
      setLocState("idle");
      setLocError(
        e?.code === 1
          ? "Location access is blocked for this site. Allow it in your browser, or enter coordinates below."
          : "Your location couldn't be found. Try again, or enter coordinates below."
      );
      setManual(true);
    }
  };

  const saveManual = (e) => {
    e.preventDefault();
    const lat = parseFloat(manualVals.lat);
    const lng = parseFloat(manualVals.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setManualError("Latitude must be between -90 and 90, and longitude between -180 and 180.");
      return;
    }
    setP({ location: { mode: "manual", lat, lng, label: manualVals.label?.trim() || "Custom location" } });
    setManual(false);
    setManualError("");
    setLocError("");
    toast("Location saved");
  };

  const offsetsKey = JSON.stringify(p.offsets);
  const preview = useMemo(() => {
    if (!hasLoc) return null;
    try {
      return prayerSchedule({ lat: loc.lat, lng: loc.lng, method: p.method, madhhab: p.madhhab, highLatRule: p.highLatRule, offsets: p.offsets });
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoc, loc.lat, loc.lng, p.method, p.madhhab, p.highLatRule, offsetsKey]);

  // The Asr time each school gives today, shown beside its option.
  const asrTimes = useMemo(() => {
    if (!hasLoc) return null;
    try {
      const at = (madhhab) =>
        fmtTime(prayerSchedule({ lat: loc.lat, lng: loc.lng, method: p.method, madhhab, highLatRule: p.highLatRule, offsets: p.offsets }).today.asr, p.hour12);
      return { shafi: at("shafi"), hanafi: at("hanafi") };
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoc, loc.lat, loc.lng, p.method, p.highLatRule, offsetsKey, p.hour12]);

  const [pick, setPick] = useState(null);
  const closePick = () => setPick(null);
  const autoId = hasLoc ? autoMethodId(loc.lat, loc.lng) : null;
  const methodSummary = p.method === "auto" ? (autoId ? `Automatic, using ${methodName(autoId)}` : "Automatic") : methodName(p.method);
  const highLatName = HIGH_LAT_RULES.find((r) => r.id === p.highLatRule)?.name || "Recommended";
  const changed = PRAYER_KEYS.filter((k) => p.offsets?.[k]);
  const hasOffsets = changed.length > 0;
  const offsetSummary = hasOffsets
    ? changed.map((k) => `${PRAYER_LABELS[k]} ${p.offsets[k] > 0 ? "+" : "\u2212"}${Math.abs(p.offsets[k])}`).join(", ")
    : "None, times as calculated";

  const hijriOffset = p.hijriOffset || 0;

  return (
    <div className="space-y-10">
      <Group>
        <Panel className="divide-y divide-line">
          <ToggleRow label="Prayer times" hint="Worked out on this device. Nothing is sent anywhere." on={!!p.enabled} onChange={() => setP({ enabled: !p.enabled })} />
          <ToggleRow label="Show on Today" on={!!p.showOnHome} onChange={() => setP({ showOnHome: !p.showOnHome })} />
          <ListRow title="Qibla compass" chevron onClick={() => navigate("/qibla")} leading={<IconTile icon={Compass} size={32} />} />
        </Panel>
      </Group>

      <Group title="Location">
        <Panel className="space-y-4 p-4">
          {hasLoc ? (
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-muted" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-[0.9375rem] font-medium text-ink">{loc.label || "Saved location"}</p>
                <p className="numerals text-sm text-muted">
                  {Number(loc.lat).toFixed(3)}, {Number(loc.lng).toFixed(3)} · {loc.mode === "manual" ? "Entered by hand" : "From this device"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-[0.9375rem] text-muted">No location yet. Prayer times and the Qibla need one.</p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" icon={MapPin} loading={locState === "loading"} onClick={locateMe}>
              {hasLoc ? "Update from this device" : "Use my location"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setManual((v) => !v)} aria-expanded={manual}>
              {manual ? "Cancel" : "Enter coordinates"}
            </Button>
          </div>
          {locError && (
            <p className="flex items-start gap-1.5 text-sm text-danger" role="alert">
              <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              {locError}
            </p>
          )}
          {manual && (
            <form onSubmit={saveManual} className="space-y-3 border-t border-line pt-4" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Latitude">
                  <TextInput inputMode="decimal" value={manualVals.lat} onChange={(e) => setManualVals((v) => ({ ...v, lat: e.target.value }))} placeholder="31.5204" />
                </Field>
                <Field label="Longitude">
                  <TextInput inputMode="decimal" value={manualVals.lng} onChange={(e) => setManualVals((v) => ({ ...v, lng: e.target.value }))} placeholder="74.3587" />
                </Field>
              </div>
              <Field label="Place name" optional error={manualError}>
                <TextInput value={manualVals.label} onChange={(e) => setManualVals((v) => ({ ...v, label: e.target.value }))} placeholder="Lahore" />
              </Field>
              <Button type="submit" size="sm">
                Save location
              </Button>
            </form>
          )}
        </Panel>
      </Group>

      <Group title="Calculation" description="Choose the convention your local mosque or authority follows.">
        <Panel className="divide-y divide-line">
          <ListRow title="Calculation method" subtitle={methodSummary} chevron onClick={() => setPick("method")} />
          <ListRow
            title="Asr time"
            subtitle={p.madhhab === "hanafi" ? "Hanafi" : "Standard (Shafi'i, Maliki, Hanbali)"}
            meta={preview ? fmtTime(preview.today.asr, p.hour12) : undefined}
            chevron
            onClick={() => setPick("asr")}
          />
          <ListRow title="High-latitude rule" subtitle={highLatName} chevron onClick={() => setPick("highLat")} />
          <ListRow title="Adjust times" subtitle={offsetSummary} chevron onClick={() => setPick("offsets")} />
          <Row
            label="Clock"
            hint={`Times show as ${fmtTime(new Date(2000, 0, 1, 16, 5), p.hour12)}`}
            control={() => (
              <Seg
                label="Time format"
                size="sm"
                className="shrink-0"
                value={p.hour12 ? "12" : "24"}
                onChange={(v) => setP({ hour12: v === "12" })}
                options={[{ v: "12", l: "12-hour" }, { v: "24", l: "24-hour" }]}
              />
            )}
          />
        </Panel>
      </Group>

      <OptionSheet
        open={pick === "method"}
        onClose={closePick}
        title="Calculation method"
        description="Sets the sun angles used for Fajr and Isha."
        value={p.method}
        onChange={(v) => setP({ method: v })}
        options={CALC_METHODS.map((m) => ({
          v: m.id,
          l: m.name,
          hint: m.id === "auto" ? (autoId ? `Uses ${methodName(autoId)} for your region` : m.note) : `Fajr / Isha: ${m.note}`,
        }))}
      />
      <OptionSheet
        open={pick === "asr"}
        onClose={closePick}
        title="Asr time"
        description="The schools differ on when Asr begins. Follow the one you pray by."
        value={p.madhhab}
        onChange={(v) => setP({ madhhab: v })}
        options={[
          { v: "shafi", l: "Standard", hint: "Shafi'i, Maliki and Hanbali. Begins when a shadow equals its object's length.", meta: asrTimes?.shafi },
          { v: "hanafi", l: "Hanafi", hint: "Begins when a shadow is twice its object's length, so it is later.", meta: asrTimes?.hanafi },
        ]}
      />
      <OptionSheet
        open={pick === "highLat"}
        onClose={closePick}
        title="High-latitude rule"
        description="Only changes Fajr and Isha far north or south, where twilight can last all night."
        value={p.highLatRule}
        onChange={(v) => setP({ highLatRule: v })}
        options={HIGH_LAT_RULES.map((r) => ({ v: r.id, l: r.name, hint: HIGH_LAT_HINTS[r.id] }))}
      />
      <Sheet
        open={pick === "offsets"}
        onClose={closePick}
        title="Adjust times"
        description="Move any time by a few minutes to match your mosque's printed timetable."
        footer={
          hasOffsets ? (
            <Button variant="secondary" icon={RotateCcw} onClick={() => setP({ offsets: {} })}>
              Reset all to calculated
            </Button>
          ) : undefined
        }
      >
        <ListGroup>
          {PRAYER_KEYS.map((key) => (
            <div key={key} className="flex items-center gap-3 px-4 py-2.5">
              <span className="flex-1 text-[0.9375rem] font-medium text-ink">{PRAYER_LABELS[key]}</span>
              {preview && <span className="numerals w-20 text-right text-sm text-muted">{fmtTime(preview.today[key], p.hour12)}</span>}
              <Stepper
                label={`${PRAYER_LABELS[key]} offset`}
                value={p.offsets?.[key] || 0}
                min={-60}
                max={60}
                onDec={() => setOffset(key, -1)}
                onInc={() => setOffset(key, 1)}
                display={`${(p.offsets?.[key] || 0) > 0 ? "+" : ""}${p.offsets?.[key] || 0} min`}
              />
            </div>
          ))}
        </ListGroup>
      </Sheet>

      <Group
        title="Hijri date"
        description="Based on the Umm al-Qura calendar, which can differ from local moon-sighting by a day. It is pre-set for your region; adjust it if your local date differs."
      >
        <Panel className="divide-y divide-line">
          <div className="px-4 py-4">
            <p className="text-sm text-muted">Today</p>
            <p className="mt-0.5 font-display text-xl text-ink">{hijriFormatted(new Date(), hijriDisplayOffset(p)) || "Unavailable"}</p>
          </div>
          <Row label="Adjust by days">
            <Stepper
              label="Hijri adjustment"
              value={hijriOffset}
              min={-2}
              max={2}
              onDec={() => setP({ hijriOffset: Math.max(-2, hijriOffset - 1) })}
              onInc={() => setP({ hijriOffset: Math.min(2, hijriOffset + 1) })}
              display={`${hijriOffset > 0 ? "+" : ""}${hijriOffset} ${Math.abs(hijriOffset) === 1 ? "day" : "days"}`}
            />
          </Row>
        </Panel>
      </Group>

      <Group title="Prayer reminders">
        <Panel className="divide-y divide-line">
          <ToggleRow
            label="Remind me before each prayer"
            on={!!p.reminders?.enabled}
            onChange={() => setReminders({ enabled: !p.reminders?.enabled })}
          />
          {p.reminders?.enabled && (
            <>
              <Row label="How early">
                <Stepper
                  label="Minutes before adhan"
                  value={p.reminders?.before || 0}
                  min={0}
                  max={60}
                  onDec={() => setReminders({ before: Math.max(0, (p.reminders?.before || 0) - 5) })}
                  onInc={() => setReminders({ before: Math.min(60, (p.reminders?.before || 0) + 5) })}
                  display={(p.reminders?.before || 0) === 0 ? "On time" : `${p.reminders.before} min`}
                />
              </Row>
              <div className="px-4 py-4">
                <p className="mb-3 text-[0.9375rem] font-medium text-ink">Which prayers</p>
                <div className="flex flex-wrap gap-2">
                  {SALAH_KEYS.map((key) => {
                    const on = p.reminders?.prayers?.[key] ?? true;
                    return (
                      <button key={key} type="button" className="chip" aria-pressed={on} onClick={() => togglePrayerReminder(key)}>
                        {on && <Check size={14} aria-hidden="true" />}
                        {PRAYER_LABELS[key]}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">
                  On iPhone, reminders only arrive while the app is open or in the background.
                </p>
              </div>
            </>
          )}
          <ToggleRow
            label="Last third of the night"
            hint={hasLoc ? "A quiet reminder when it begins, with the night adhkar." : "Set your location first: it is worked out from Maghrib and Fajr."}
            on={!!p.reminders?.lastThird}
            onChange={() => hasLoc && setReminders({ lastThird: !p.reminders?.lastThird })}
          />
        </Panel>
      </Group>
    </div>
  );
};

/* ─── Theme swatch: a tiny page in that theme's own colours ─────────────── */
const ThemeSwatch = ({ vars }) => (
  <span
    className="relative flex h-14 w-full flex-col justify-end overflow-hidden rounded-lg border p-2"
    style={{ background: vars["--bg"], borderColor: vars["--line"] }}
    aria-hidden="true"
  >
    <span className="mb-1.5 block h-1.5 w-3/5 rounded-full" style={{ background: vars["--text"] }} />
    <span className="mb-1.5 block h-1 w-2/5 rounded-full" style={{ background: vars["--muted"] }} />
    <span className="absolute right-2 top-2 h-4 w-4 rounded-full" style={{ background: vars["--primary"] }} />
  </span>
);

/* ─── View ─────────────────────────────────────────────────────────────── */
export const SettingsView = () => {
  const {
    settings, setSettings, setStats, notifyPermission, requestNotificationPermission, dhikrs, lists, resyncLibrary,
    appVersion, updateAvailable, applyUpdate, checkForUpdates, installPrompt, promptInstall, isInstalled, cleanUpApp,
    exportData, importData,
  } = useApp();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = useIsDesktop();
  const [searchParams, setSearchParams] = useSearchParams();
  const panel = searchParams.get("panel");
  const effectiveAppearance = useEffectiveAppearance(settings.appearance);

  const [newAlert, setNewAlert] = useState({ title: "", time: "09:00", target: "none" });
  const [alertError, setAlertError] = useState("");
  const [syncState, setSyncState] = useState("idle");
  const [updateState, setUpdateState] = useState("idle");
  const [restoreState, setRestoreState] = useState("idle");
  const [restoreError, setRestoreError] = useState("");
  const [pendingRestore, setPendingRestore] = useState(null);
  const [confirm, setConfirm] = useState(null); // { title, body, action, onConfirm }
  const fileInputRef = useRef(null);

  const set = (k, v) => setSettings((s) => ({ ...s, [k]: v }));

  const openPanel = (id) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("panel", id);
        return next;
      },
      { replace: isDesktop }
    );
    window.scrollTo({ top: 0 });
  };
  const closePanel = () => {
    if (location.key && location.key !== "default") navigate(-1);
    else
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("panel");
          return next;
        },
        { replace: true }
      );
  };

  /* ── Data actions ── */
  const handleExport = () => {
    try {
      exportData();
      toast("Backup saved to your downloads");
    } catch {
      setRestoreError("The backup file couldn't be created. Please try again.");
    }
  };

  const handleRestoreFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setRestoreError("");
    setRestoreState("working");
    try {
      const text = await readFileAsText(file);
      const { data } = parseBackup(text);
      setPendingRestore(data);
    } catch (err) {
      setRestoreError(err?.message || "That file isn't a Tasbeeh Go backup, or it is damaged.");
    }
    setRestoreState("idle");
  };

  const handleResync = () => {
    if (syncState === "syncing") return;
    setSyncState("syncing");
    const res = resyncLibrary();
    setTimeout(() => {
      setSyncState("idle");
      toast(`Library refreshed: ${res.dhikrs} dhikr, ${res.lists} sets`);
    }, 400);
  };

  const handleCheckUpdates = async () => {
    if (updateState === "checking") return;
    setUpdateState("checking");
    const hasWaiting = await checkForUpdates();
    setUpdateState("idle");
    if (!hasWaiting && !updateAvailable) toast("You have the latest version");
  };

  const toggleAlerts = async () => {
    const enabling = !settings.alertsEnabled;
    set("alertsEnabled", enabling);
    if (enabling && notifyPermission === "default") await requestNotificationPermission();
  };

  const addAlert = (e) => {
    e.preventDefault();
    if (!newAlert.title.trim()) {
      setAlertError("Give the reminder a name, for example “Duha”.");
      return;
    }
    const [targetType, targetId] = newAlert.target === "none" ? ["none", ""] : newAlert.target.split(":");
    set("alerts", [
      ...(settings.alerts || []),
      {
        id: "a_" + Date.now(),
        title: newAlert.title.trim(),
        body: targetType !== "none" ? "Tap to begin your recitation." : "It's time for your dhikr.",
        time: newAlert.time,
        enabled: true,
        custom: true,
        targetType,
        targetId,
      },
    ]);
    setNewAlert({ title: "", time: "09:00", target: "none" });
    setAlertError("");
    toast("Reminder added");
  };

  /* ── Sections ── */
  const fieldOrder = (() => {
    const order = settings.dhikrFieldOrder || DEFAULT_DHIKR_FIELD_ORDER;
    return [...order, ...DEFAULT_DHIKR_FIELD_ORDER.filter((k) => !order.includes(k))].filter((k) => DHIKR_FIELDS[k]);
  })();
  const fieldVisible = settings.dhikrFieldVisible || DEFAULT_DHIKR_FIELD_VISIBLE;
  const visibleFieldCount = fieldOrder.filter((k) => fieldVisible[k] !== false).length;

  const homeSections = resolveHomeSections(settings.homeSections);

  const sectionReading = (
    <div className="space-y-10">
      <Group title="Translation">
        <LanguageControl />
      </Group>

      <Group title="Text size" description="For the counter and the reader.">
        <TextSizeControls />
      </Group>

      <Group title="Arabic typeface" description="Used for Arabic everywhere: the counter, the library and the 99 Names.">
        <ArabicFontPicker />
      </Group>

      <Group title="While counting" description="What appears above the counter, in this order. Keep at least one.">
        <OrderList
          items={fieldOrder}
          renderLabel={(k) => DHIKR_FIELDS[k].label}
          onMove={(i, dir) => set("dhikrFieldOrder", swap(fieldOrder, i, dir))}
          isOn={(k) => fieldVisible[k] !== false}
          canToggle={(k) => !(fieldVisible[k] !== false && visibleFieldCount <= 1)}
          onToggle={(k) => set("dhikrFieldVisible", { ...fieldVisible, [k]: !(fieldVisible[k] !== false) })}
        />
      </Group>

      <Group title="Today page" description="Reorder or hide the sections on Today. The greeting and any session in progress always stay at the top.">
        <OrderList
          items={homeSections.map((s) => s.key)}
          renderLabel={(k) => HOME_SECTIONS[k].label}
          onMove={(i, dir) => set("homeSections", swap(homeSections, i, dir))}
          isOn={(k) => homeSections.find((s) => s.key === k)?.visible}
          onToggle={(k) => set("homeSections", homeSections.map((s) => (s.key === k ? { ...s, visible: !s.visible } : s)))}
        />
      </Group>

    </div>
  );

  const sectionAppearance = (
    <div className="space-y-10">
      <Group title="Light or dark">
        <Seg
          label="Appearance"
          value={settings.appearance || "system"}
          onChange={(v) => set("appearance", v)}
          options={[
            { v: "light", l: "Light" },
            { v: "dark", l: "Dark" },
            { v: "system", l: "Match device" },
          ]}
        />
      </Group>

      <Group title="Theme">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Theme">
          {Object.entries(THEMES).map(([key, t]) => {
            const on = (settings.theme || "qalam") === key;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => set("theme", key)}
                className={`flex flex-col gap-2.5 rounded-xl border p-2.5 text-left transition-colors ${
                  on ? "border-ink bg-surface" : "border-line hover:border-line-strong"
                }`}
              >
                <ThemeSwatch vars={t[effectiveAppearance]} />
                <span className="flex items-center justify-between gap-2 px-0.5">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">{t.name}</span>
                    <span className="block truncate text-[0.8125rem] text-muted">{t.sub}</span>
                  </span>
                  {on && <Check size={15} className="shrink-0 text-accent" aria-hidden="true" />}
                </span>
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Counter">
        <CounterStylePicker />
      </Group>
    </div>
  );

  const sectionCounting = (
    <div className="space-y-10">
      <Group>
        <Panel className="divide-y divide-line">
          <ToggleRow label="Vibrate on each count" hint="A stronger pulse when a count is complete." on={settings.haptics} onChange={() => set("haptics", !settings.haptics)} />
          {settings.haptics && (
            <ToggleRow
              label="Feel which dhikr you're on"
              hint="In a set, each count taps once for the first dhikr, twice for the second, up to four. A new dhikr starts with longer pulses."
              on={!!settings.stepRhythm}
              onChange={() => set("stepRhythm", !settings.stepRhythm)}
            />
          )}
          <ToggleRow label="Click sound" on={settings.sound} onChange={() => set("sound", !settings.sound)} />
          <ToggleRow
            label="Move on automatically"
            hint="In a set, go to the next dhikr when one is complete."
            on={settings.autoAdvance}
            onChange={() => set("autoAdvance", !settings.autoAdvance)}
          />
          <ToggleRow
            label="Keep going after the target"
            hint="For a single dhikr, start another round instead of stopping."
            on={settings.loop}
            onChange={() => set("loop", !settings.loop)}
          />
          <ToggleRow
            label="Tap anywhere to count"
            hint="The whole screen counts, apart from the top and bottom controls."
            on={!!settings.fullScreenTap}
            onChange={() => set("fullScreenTap", !settings.fullScreenTap)}
          />
        </Panel>
      </Group>
      <Group title="Gestures and keys">
        <dl className="divide-y divide-line border-y border-line text-[0.9375rem]">
          {[
            ["Count", "Tap the beads, or press Space, Enter or Up"],
            ["Undo", "Backspace or Down"],
            ["Next or previous dhikr", "Swipe sideways, or press Left and Right"],
            ["Slide the beads", "Drag clockwise to count up, anticlockwise to go back"],
            ["Start again", "R"],
            ["Leave the counter", "Escape"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:gap-6">
              <dt className="font-medium text-ink sm:w-52 sm:shrink-0">{k}</dt>
              <dd className="text-muted">{v}</dd>
            </div>
          ))}
        </dl>
      </Group>
    </div>
  );

  const targetOptions = (
    <>
      <option value="none">None, just a reminder</option>
      <optgroup label="Sets">
        {lists.map((l) => (
          <option key={`list-${l.id}`} value={`list:${l.id}`}>
            {l.name}
          </option>
        ))}
      </optgroup>
      <optgroup label="Dhikr">
        {dhikrs
          .filter((d) => !d.tags?.includes("names-of-allah"))
          .map((d) => (
            <option key={`dhikr-${d.id}`} value={`dhikr:${d.id}`}>
              {d.tr}
            </option>
          ))}
      </optgroup>
    </>
  );

  const sectionReminders = (
    <div className="space-y-10">
      <Group>
        <Panel className="divide-y divide-line">
          <ToggleRow label="Daily reminders" on={settings.alertsEnabled} onChange={toggleAlerts} />
          {settings.alertsEnabled && (
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-[0.9375rem] font-medium text-ink">Notifications</p>
                <p className="mt-0.5 text-sm leading-snug text-muted">
                  {notifyPermission === "granted"
                    ? "Allowed. Reminders will arrive on time."
                    : notifyPermission === "denied"
                      ? "Blocked. Allow notifications for this site in your browser or device settings, then reload."
                      : "Needed so reminders can reach you."}
                </p>
              </div>
              {notifyPermission === "granted" ? (
                <span className="flex items-center gap-1 text-sm font-medium text-accent">
                  <Check size={16} aria-hidden="true" /> On
                </span>
              ) : notifyPermission !== "denied" ? (
                <Button size="sm" onClick={requestNotificationPermission}>
                  Allow
                </Button>
              ) : null}
            </div>
          )}
        </Panel>
      </Group>

      {settings.alertsEnabled && (
        <>
          <Group title="Your reminders">
            {(settings.alerts || []).length === 0 ? (
              <p className="text-[0.9375rem] text-muted">No reminders yet. Add one below.</p>
            ) : (
              <ListGroup>
                {settings.alerts.map((a) => {
                  const target =
                    a.targetType === "list"
                      ? lists.find((x) => x.id === a.targetId)?.name
                      : a.targetType === "dhikr"
                        ? dhikrs.find((x) => x.id === a.targetId)?.tr
                        : null;
                  return (
                    <div key={a.id} className="flex items-center gap-3 py-3 pl-4 pr-3">
                      <span className="numerals w-14 shrink-0 font-display text-lg text-ink">{a.time}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[0.9375rem] font-medium text-ink">{a.title}</p>
                        {target && (
                          <p className="flex items-center gap-1 truncate text-sm text-muted">
                            <Link2 size={13} className="shrink-0" aria-hidden="true" /> Opens {target}
                          </p>
                        )}
                      </div>
                      <Toggle
                        on={a.enabled}
                        label={`${a.title} at ${a.time}`}
                        onClick={() => set("alerts", settings.alerts.map((x) => (x.id === a.id ? { ...x, enabled: !x.enabled } : x)))}
                      />
                      {a.custom && (
                        <IconButton
                          icon={Trash2}
                          label={`Delete ${a.title}`}
                          size="sm"
                          className="text-danger"
                          onClick={() => {
                            const prev = settings.alerts;
                            set("alerts", prev.filter((x) => x.id !== a.id));
                            toast(`Deleted “${a.title}”`, { action: { label: "Undo", onClick: () => set("alerts", prev) } });
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </ListGroup>
            )}
          </Group>

          <Group title="Add a reminder">
            <Panel as="form" onSubmit={addAlert} noValidate className="space-y-4 p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_9rem]">
                <Field label="Name" error={alertError}>
                  <TextInput value={newAlert.title} onChange={(e) => setNewAlert((n) => ({ ...n, title: e.target.value }))} placeholder="Duha" />
                </Field>
                <Field label="Time">
                  <TextInput type="time" value={newAlert.time} onChange={(e) => setNewAlert((n) => ({ ...n, time: e.target.value }))} className="numerals" />
                </Field>
              </div>
              <Field label="Opens" hint="Tapping the notification goes straight to this set or dhikr.">
                <Select
                  value={newAlert.target}
                  onChange={(e) => {
                    const val = e.target.value;
                    let suggested = "";
                    if (val !== "none") {
                      const [type, id] = val.split(":");
                      suggested = type === "list" ? lists.find((x) => x.id === id)?.name : dhikrs.find((x) => x.id === id)?.tr;
                    }
                    setNewAlert((n) => ({ ...n, target: val, title: n.title.trim() ? n.title : suggested || "" }));
                  }}
                >
                  {targetOptions}
                </Select>
              </Field>
              <Button type="submit" icon={Plus}>
                Add reminder
              </Button>
            </Panel>
          </Group>
        </>
      )}
    </div>
  );

  const sectionData = (
    <div className="space-y-10">
      <Group title="Backup" description="Save everything (stats, settings, your own dhikr and sets, and any session in progress) to one file. Restore it on a new phone to carry on where you left off.">
        <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleRestoreFile} />
        <Panel className="divide-y divide-line">
          <ListRow title="Save a backup file" subtitle="Downloads a .json file" leading={<IconTile icon={Download} size={36} />} onClick={handleExport} />
          <ListRow
            title={restoreState === "working" ? "Reading the file" : "Restore from a backup"}
            subtitle="Replaces what is on this device"
            leading={<IconTile icon={Upload} size={36} />}
            onClick={() => {
              setRestoreError("");
              fileInputRef.current?.click();
            }}
          />
        </Panel>
        {restoreError && (
          <p className="flex items-start gap-1.5 text-sm text-danger" role="alert">
            <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            {restoreError}
          </p>
        )}
      </Group>

      <Group title="App">
        <Panel className="divide-y divide-line">
          <ListRow
            title="Refresh the library"
            subtitle="Gets the latest built-in dhikr and sets. Yours are kept."
            leading={<IconTile icon={RefreshCw} size={36} />}
            onClick={handleResync}
          />
          <ListRow
            title={updateAvailable ? "Update ready, reload now" : updateState === "checking" ? "Checking for updates" : "Check for updates"}
            subtitle={`You have version ${appVersion}`}
            leading={<IconTile icon={RefreshCw} size={36} tone={updateAvailable ? "accent" : "neutral"} />}
            onClick={updateAvailable ? applyUpdate : handleCheckUpdates}
          />
          {installPrompt ? (
            <ListRow title="Install on this device" subtitle="Opens full screen and works offline" leading={<IconTile icon={Smartphone} size={36} tone="accent" />} onClick={promptInstall} />
          ) : isInstalled ? (
            <ListRow title="Installed" subtitle="Running as an app on this device" leading={<IconTile icon={Check} size={36} />} />
          ) : (
            <ListRow
              title="Install on your phone"
              subtitle="iPhone: Share, then Add to Home Screen. Android: menu, then Install app."
              leading={<IconTile icon={Smartphone} size={36} />}
            />
          )}
          <ListRow
            title="Privacy"
            subtitle="Your data stays on this device"
            leading={<IconTile icon={ShieldCheck} size={36} />}
            chevron
            onClick={() => navigate("/privacy")}
          />
        </Panel>
      </Group>

      <Group title="Reset">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="danger"
            icon={RotateCcw}
            onClick={() =>
              setConfirm({
                title: "Repair the app?",
                body: "This clears cached files and resets your settings. Your stats and your own dhikr and sets are kept. The app reloads afterwards.",
                action: "Repair and reload",
                onConfirm: cleanUpApp,
              })
            }
          >
            Repair the app
          </Button>
          <Button
            variant="danger"
            icon={Trash2}
            onClick={() =>
              setConfirm({
                title: "Erase all statistics?",
                body: "Every count, streak and the activity history will be removed from this device. This can't be undone, so save a backup first if you may want them.",
                action: "Erase statistics",
                onConfirm: () => {
                  setStats({ total: 0, byDate: {}, perDhikr: {} });
                  toast("Statistics erased");
                },
              })
            }
          >
            Erase statistics
          </Button>
        </div>
      </Group>

      <p className="max-w-[60ch] text-sm leading-relaxed text-muted">
        Wording and counts follow common narrations. Please check them against a scholar or source you trust.
      </p>
    </div>
  );

  const CATEGORIES = [
    { id: "display", label: "Reading", hint: "Translation, Arabic typeface, the Today page", icon: BookOpenText, content: sectionReading },
    { id: "appearance", label: "Appearance", hint: "Light or dark, theme, beads", icon: Palette, content: sectionAppearance },
    { id: "counter", label: "Counting", hint: "Vibration, sound, moving on, gestures", icon: Hand, content: sectionCounting },
    { id: "prayer", label: "Prayer times & Qibla", hint: "Location, method, Hijri date", icon: Compass, content: <PrayerSettings /> },
    { id: "reminders", label: "Reminders", hint: "Daily notifications", icon: Bell, content: sectionReminders },
    { id: "data", label: "Backup & app", hint: "Backup, restore, updates, reset", icon: DatabaseBackup, content: sectionData },
  ];
  const active = CATEGORIES.find((c) => c.id === panel) || null;

  const dialogs = (
    <>
      <Sheet
        open={!!confirm}
        onClose={() => setConfirm(null)}
        size="sm"
        title={confirm?.title || ""}
        description={confirm?.body}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                confirm?.onConfirm();
                setConfirm(null);
              }}
            >
              {confirm?.action}
            </Button>
          </div>
        }
      />
      <Sheet
        open={!!pendingRestore}
        onClose={() => setPendingRestore(null)}
        size="sm"
        title="Restore this backup?"
        description="Your settings, stats, own dhikr and sets, and any session in progress will be replaced by the ones in the file."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setPendingRestore(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                try {
                  const r = importData(pendingRestore);
                  toast(`Restored ${r.total.toLocaleString()} counts and ${r.lists} sets`);
                } catch (err) {
                  setRestoreError(err?.message || "That backup couldn't be restored.");
                }
                setPendingRestore(null);
              }}
            >
              Replace and restore
            </Button>
          </div>
        }
      />
    </>
  );

  if (isDesktop) {
    const current = active || CATEGORIES[0];
    return (
      <div className="space-y-10">
        <PageHeader title="Settings" />
        <div className="grid grid-cols-[16rem_minmax(0,1fr)] items-start gap-12">
          <nav aria-label="Settings sections" className="sticky top-12">
            <ul className="space-y-0.5">
              {CATEGORIES.map((c) => {
                const on = current.id === c.id;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => openPanel(c.id)}
                      aria-current={on ? "page" : undefined}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        on ? "bg-sunken" : "hover:bg-sunken"
                      }`}
                    >
                      <c.icon size={18} strokeWidth={on ? 2 : 1.6} className={on ? "text-accent" : "text-muted"} aria-hidden="true" />
                      <span className={`text-[0.9375rem] ${on ? "font-semibold text-ink" : "font-medium text-ink"}`}>{c.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="numerals mt-6 px-3 text-sm text-muted">Tasbeeh Go {appVersion}</p>
          </nav>
          <div className="min-w-0 max-w-3xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <h2 className="mb-8 font-display text-[2rem] leading-tight text-ink">{current.label}</h2>
                {current.content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        {dialogs}
      </div>
    );
  }

  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        {!active ? (
          <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="space-y-8">
            <PageHeader title="Settings" />
            <ListGroup>
              {CATEGORIES.map((c) => (
                <ListRow key={c.id} leading={<IconTile icon={c.icon} />} title={c.label} subtitle={c.hint} chevron onClick={() => openPanel(c.id)} />
              ))}
            </ListGroup>
            <p className="numerals text-center text-sm text-muted">Tasbeeh Go {appVersion}</p>
          </motion.div>
        ) : (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <div className="flex items-center gap-2">
              <IconButton icon={ArrowLeft} label="Back to settings" onClick={closePanel} className="-ml-2" />
              <h1 className="truncate font-display text-[2rem] leading-tight text-ink">{active.label}</h1>
            </div>
            {active.content}
          </motion.div>
        )}
      </AnimatePresence>
      {dialogs}
    </div>
  );
};

/* Loads every Arabic typeface so the font picker can preview each one. */

export default SettingsView;
