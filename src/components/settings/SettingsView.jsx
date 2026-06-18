import React, { useState, useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  Globe, Moon, Sun, Monitor, Disc, Palette, Vibrate, Volume2,
  ChevronRight, RotateCcw, Hand, Keyboard, Sparkles, MousePointerClick,
  Bell, Trash2, Plus, Check, Link, ChevronUp, ChevronDown, Eye, EyeOff, GripVertical, LayoutGrid,
  RefreshCw, Download, Smartphone, DatabaseBackup, Upload, AlertTriangle, ArrowLeft, Type
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useApp } from "../../context/AppContext";
import { parseBackup, readFileAsText } from "../../utils/backup";
import Card from "../common/Card";
import Toggle from "../common/Toggle";
import Seg from "../common/Seg";
import { BEAD_THEMES, THEMES, ARABIC_FONTS, DHIKR_FIELDS, DEFAULT_DHIKR_FIELD_ORDER, DEFAULT_DHIKR_FIELD_VISIBLE, OCCASIONS, OCCASION_ICONS, DEFAULT_QUICK_COLLECTIONS, HOME_SECTIONS, DEFAULT_HOME_SECTIONS } from "../../constants/dhikrData";
import { buildCustom, useEffectiveAppearance } from "../../utils/theme";

const HomeSectionsEditor = ({ value, onChange }) => {
  // Normalize: merge stored order with any newly-introduced section keys so
  // upgrades don't drop new defaults the user has never seen.
  const stored = Array.isArray(value) && value.length ? value : DEFAULT_HOME_SECTIONS;
  const knownKeys = Object.keys(HOME_SECTIONS);
  const list = [
    ...stored.filter((s) => HOME_SECTIONS[s.key]),
    ...knownKeys
      .filter((k) => !stored.some((s) => s.key === k))
      .map((k) => ({ key: k, visible: true })),
  ];

  const move = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };
  const toggle = (idx) => {
    const next = list.map((s, i) => i === idx ? { ...s, visible: !s.visible } : s);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      {list.map((s, idx) => (
        <motion.div
          key={s.key}
          layout
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="flex items-center gap-2 rounded-2xl border px-3 py-2"
          style={{
            borderColor: "color-mix(in srgb, var(--line) 70%, transparent)",
            background: "color-mix(in srgb, var(--surface2) 60%, transparent)",
            opacity: s.visible ? 1 : 0.55,
          }}
        >
          <GripVertical size={15} className="text-[var(--muted)] shrink-0" />
          <span className="flex-1 text-sm font-medium text-[var(--text)] truncate">
            {HOME_SECTIONS[s.key].label}
          </span>
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => move(idx, -1)}
              disabled={idx === 0}
              className="flex h-7 w-7 items-center justify-center rounded-full disabled:opacity-30 cursor-pointer"
              style={{ color: "var(--muted)" }}
              aria-label="Move up"
            >
              <ChevronUp size={15} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => move(idx, 1)}
              disabled={idx === list.length - 1}
              className="flex h-7 w-7 items-center justify-center rounded-full disabled:opacity-30 cursor-pointer"
              style={{ color: "var(--muted)" }}
              aria-label="Move down"
            >
              <ChevronDown size={15} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => toggle(idx)}
              className="flex h-7 w-7 items-center justify-center rounded-full cursor-pointer"
              style={{
                background: s.visible
                  ? "color-mix(in srgb, var(--primary) 14%, transparent)"
                  : "color-mix(in srgb, var(--surface) 80%, transparent)",
                color: s.visible ? "var(--primary)" : "var(--muted)",
              }}
              aria-label={s.visible ? "Hide section" : "Show section"}
            >
              {s.visible ? <Eye size={13} /> : <EyeOff size={13} />}
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const QuickCollectionsEditor = ({ value, onChange }) => {
  const [picking, setPicking] = useState(false);
  const list = (value && value.length > 0 ? value : []).filter((k) => OCCASIONS[k]);
  const remaining = Object.keys(OCCASIONS).filter((k) => !list.includes(k));

  const move = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };

  const remove = (key) => onChange(list.filter((k) => k !== key));
  const add = (key) => {
    onChange([...list, key]);
    setPicking(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence initial={false}>
        {list.map((key, idx) => {
          const Icon = OCCASION_ICONS[key] || Sparkles;
          return (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="flex items-center gap-2 rounded-2xl border px-3 py-2"
              style={{
                borderColor: "color-mix(in srgb, var(--line) 70%, transparent)",
                background: "color-mix(in srgb, var(--surface2) 60%, transparent)",
              }}
            >
              <GripVertical size={15} className="text-[var(--muted)] shrink-0" />
              <div
                className="flex h-7 w-7 items-center justify-center rounded-xl shrink-0"
                style={{
                  background: "color-mix(in srgb, var(--primary) 14%, transparent)",
                  color: "var(--primary)",
                }}
              >
                <Icon size={15} />
              </div>
              <span className="flex-1 text-sm font-medium text-[var(--text)] truncate">{OCCASIONS[key]}</span>
              <div className="flex items-center gap-1">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="flex h-7 w-7 items-center justify-center rounded-full disabled:opacity-30 cursor-pointer"
                  style={{ color: "var(--muted)" }}
                  aria-label="Move up"
                >
                  <ChevronUp size={15} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => move(idx, 1)}
                  disabled={idx === list.length - 1}
                  className="flex h-7 w-7 items-center justify-center rounded-full disabled:opacity-30 cursor-pointer"
                  style={{ color: "var(--muted)" }}
                  aria-label="Move down"
                >
                  <ChevronDown size={15} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => remove(key)}
                  className="flex h-7 w-7 items-center justify-center rounded-full cursor-pointer"
                  style={{
                    background: "color-mix(in srgb, var(--danger) 14%, transparent)",
                    color: "var(--danger)",
                  }}
                  aria-label="Remove"
                >
                  <Trash2 size={13} />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {list.length === 0 && (
        <p className="text-center text-xs text-[var(--muted)] py-2 font-medium">
          No quick collections — the Home grid will be hidden.
        </p>
      )}

      {/* Add picker */}
      {remaining.length > 0 && (
        <div className="mt-1">
          {!picking ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setPicking(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed px-3 py-2.5 text-xs font-bold cursor-pointer"
              style={{
                borderColor: "color-mix(in srgb, var(--primary) 40%, transparent)",
                color: "var(--primary)",
                background: "color-mix(in srgb, var(--primary) 8%, transparent)",
              }}
            >
              <Plus size={14} /> Add a collection
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border p-2"
              style={{
                borderColor: "color-mix(in srgb, var(--line) 70%, transparent)",
                background: "color-mix(in srgb, var(--bg2) 50%, transparent)",
              }}
            >
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Choose one</span>
                <button
                  onClick={() => setPicking(false)}
                  className="text-[11px] font-bold text-[var(--muted)] cursor-pointer hover:text-[var(--text)]"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {remaining.map((key) => {
                  const Icon = OCCASION_ICONS[key] || Sparkles;
                  return (
                    <motion.button
                      key={key}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => add(key)}
                      className="flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left cursor-pointer"
                      style={{
                        borderColor: "color-mix(in srgb, var(--line) 60%, transparent)",
                        background: "color-mix(in srgb, var(--surface) 70%, transparent)",
                      }}
                    >
                      <Icon size={14} className="text-[var(--gold)] shrink-0" />
                      <span className="text-[11px] font-semibold text-[var(--text)] truncate">{OCCASIONS[key]}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

const DhikrFieldList = ({ order, visible, onOrderChange, onVisibleChange }) => {
  // Make sure list shows all known fields; appends any missing from defaults
  const fullOrder = [...order, ...DEFAULT_DHIKR_FIELD_ORDER.filter((k) => !order.includes(k))];
  const visibleCount = fullOrder.filter((k) => visible[k] !== false).length;

  const move = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= fullOrder.length) return;
    const next = [...fullOrder];
    [next[idx], next[j]] = [next[j], next[idx]];
    onOrderChange(next);
  };

  const toggle = (key) => {
    const isOn = visible[key] !== false;
    // Don't allow hiding the last visible field
    if (isOn && visibleCount <= 1) return;
    onVisibleChange({ ...visible, [key]: !isOn });
  };

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence initial={false}>
        {fullOrder.map((key, idx) => {
          const meta = DHIKR_FIELDS[key];
          if (!meta) return null;
          const on = visible[key] !== false;
          const lastVisible = on && visibleCount <= 1;
          return (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="flex items-center gap-2 rounded-2xl border px-3 py-2"
              style={{
                borderColor: "color-mix(in srgb, var(--line) 70%, transparent)",
                background: on
                  ? "color-mix(in srgb, var(--surface2) 60%, transparent)"
                  : "transparent",
              }}
            >
              <GripVertical size={15} className="text-[var(--muted)] shrink-0" />
              <div className="flex items-center justify-center h-6 w-6 rounded-full text-[10px] font-bold"
                style={{
                  background: "color-mix(in srgb, var(--gold) 18%, transparent)",
                  color: "var(--gold)",
                }}
              >
                {idx + 1}
              </div>
              <span className="flex-1 text-sm font-medium text-[var(--text)]">{meta.label}</span>
              <div className="flex items-center gap-1">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="flex h-7 w-7 items-center justify-center rounded-full disabled:opacity-30 cursor-pointer"
                  style={{ color: "var(--muted)" }}
                  aria-label="Move up"
                >
                  <ChevronUp size={15} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => move(idx, 1)}
                  disabled={idx === fullOrder.length - 1}
                  className="flex h-7 w-7 items-center justify-center rounded-full disabled:opacity-30 cursor-pointer"
                  style={{ color: "var(--muted)" }}
                  aria-label="Move down"
                >
                  <ChevronDown size={15} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggle(key)}
                  disabled={lastVisible}
                  title={lastVisible ? "At least one field must remain visible" : on ? "Hide" : "Show"}
                  className="flex h-7 w-7 items-center justify-center rounded-full cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: on
                      ? "color-mix(in srgb, var(--primary) 18%, transparent)"
                      : "color-mix(in srgb, var(--surface2) 60%, transparent)",
                    color: on ? "var(--primary)" : "var(--muted)",
                  }}
                  aria-label={on ? "Hide field" : "Show field"}
                >
                  {on ? <Eye size={14} /> : <EyeOff size={14} />}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export const SettingsView = () => {
  const {
    settings,
    setSettings,
    setStats,
    notifyPermission,
    requestNotificationPermission,
    dhikrs,
    lists,
    resyncLibrary,
    appVersion,
    updateAvailable,
    applyUpdate,
    checkForUpdates,
    installPrompt,
    promptInstall,
    isInstalled,
    cleanUpApp,
    exportData,
    importData,
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const panel = searchParams.get("panel");

  const effectiveAppearance = useEffectiveAppearance(settings.appearance);

  const [newAlert, setNewAlert] = useState({ title: "", time: "09:00", targetType: "none", targetId: "" });
  const [syncState, setSyncState] = useState("idle"); // idle | syncing | done
  const [updateState, setUpdateState] = useState("idle"); // idle | checking | upToDate

  const fileInputRef = useRef(null);
  const [exportState, setExportState] = useState("idle"); // idle | done
  const [restoreState, setRestoreState] = useState("idle"); // idle | working | done
  const [restoreError, setRestoreError] = useState("");

  /* ── Sub-screen (panel) navigation ──────────────────────────────────────
     Each category opens as its own screen, native-settings style. The active
     panel lives in the URL (?panel=…) so hardware/browser back closes it. */
  const openPanel = (id) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("panel", id);
        return next;
      },
      { replace: false }
    );
    window.scrollTo({ top: 0 });
  };

  const closePanel = () => {
    // Pop history when we have an entry to pop (so the pushed panel state is
    // removed cleanly); otherwise (deep-link / refresh) just clear the param.
    if (location.key && location.key !== "default") {
      navigate(-1);
    } else {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("panel");
          return next;
        },
        { replace: true }
      );
    }
  };

  const handleExport = () => {
    try {
      exportData();
      setExportState("done");
      setTimeout(() => setExportState("idle"), 2200);
    } catch (e) {
      setRestoreError("Couldn't create a backup file. Please try again.");
    }
  };

  const handleRestoreFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    setRestoreError("");
    setRestoreState("working");
    try {
      const text = await readFileAsText(file);
      const { data } = parseBackup(text);
      if (
        !window.confirm(
          "Restore this backup? It will replace your current settings, stats, custom dhikrs and any active session with the backed-up data."
        )
      ) {
        setRestoreState("idle");
        return;
      }
      importData(data);
      setRestoreState("done");
      setTimeout(() => setRestoreState("idle"), 2600);
    } catch (err) {
      setRestoreError(err?.message || "That backup couldn't be restored.");
      setRestoreState("idle");
    }
  };

  const handleResync = async () => {
    if (syncState === "syncing") return;
    setSyncState("syncing");
    const res = resyncLibrary();
    setTimeout(() => setSyncState("done"), 400);
    setTimeout(() => setSyncState("idle"), 2200);
    return res;
  };

  const handleCheckUpdates = async () => {
    if (updateState === "checking") return;
    setUpdateState("checking");
    const hasWaiting = await checkForUpdates();
    if (hasWaiting || updateAvailable) {
      // The banner / applyUpdate path will handle reload
      setUpdateState("idle");
    } else {
      setUpdateState("upToDate");
      setTimeout(() => setUpdateState("idle"), 2200);
    }
  };

  const Row = ({ icon: Ico, label, hint, children }) => (
    <div className="flex items-center gap-3 py-3.5">
      <Ico size={19} className="text-[var(--gold)] shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[var(--text)] text-sm font-medium">{label}</p>
        {hint && <p className="text-[var(--muted)] text-[11px] leading-snug mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );

  const set = (k, v) => setSettings((s) => ({ ...s, [k]: v }));

  /* ── Category sections ──────────────────────────────────────────────── */
  const sectionDisplay = (
    <div className="space-y-6">
      <Card className="px-5 py-1">
        <div className="py-3.5">
          <div className="mb-3 flex items-center gap-3 font-semibold text-sm">
            <Globe size={19} className="text-[var(--gold)]" />
            <span className="text-[var(--text)]">Translation</span>
          </div>
          <Seg
            value={settings.lang}
            onChange={(v) => set("lang", v)}
            options={[{ v: "en", l: "English" }, { v: "ur", l: "اردو" }, { v: "both", l: "Both" }]}
          />
        </div>
      </Card>

      {/* Arabic Font — typeface for the Arabic script across the app */}
      <Card className="px-5 py-4">
        <div className="mb-1 flex items-center gap-3 font-semibold text-sm">
          <Type size={19} className="text-[var(--gold)]" />
          <span className="text-[var(--text)]">Arabic Font</span>
        </div>
        <p className="mb-3 text-[11px] text-[var(--muted)] leading-relaxed">
          Choose the typeface used for Arabic text on the counter, library, and 99 Names. Includes Naskh, Indo-Pak (Nastaliq), and Kufi styles.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {ARABIC_FONTS.map((f) => {
            const isSel = (settings.arabicFont || "amiri") === f.id;
            return (
              <button
                key={f.id}
                onClick={() => set("arabicFont", f.id)}
                className="flex flex-col gap-1.5 rounded-2xl border p-3 text-left cursor-pointer transition-all active:scale-[0.97]"
                style={{
                  borderColor: isSel ? "var(--primary)" : "var(--line)",
                  background: isSel ? "var(--surface2)" : "transparent",
                }}
              >
                <span
                  dir="rtl"
                  className="block w-full truncate text-[1.55rem] leading-[1.7] text-[var(--text)]"
                  style={{ fontFamily: f.stack }}
                >
                  بِسْمِ اللّٰه
                </span>
                <span className="flex items-center justify-between gap-2 min-w-0">
                  <span className="text-[11px] font-semibold text-[var(--text)] truncate">{f.name}</span>
                  {isSel && <Check size={13} className="text-[var(--primary)] shrink-0" />}
                </span>
                <span className="text-[9px] text-[var(--muted)] truncate">{f.sub}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Dhikr Display — priority order + visibility */}
      <Card className="px-5 py-4">
        <div className="mb-1 flex items-center gap-3 font-semibold text-sm">
          <Sparkles size={19} className="text-[var(--gold)]" />
          <span className="text-[var(--text)]">Dhikr Display</span>
        </div>
        <p className="mb-3 text-[11px] text-[var(--muted)] leading-relaxed">
          Reorder priority and toggle visibility. Top items show first on the counter page. At least one must remain visible.
        </p>
        <DhikrFieldList
          order={settings.dhikrFieldOrder || DEFAULT_DHIKR_FIELD_ORDER}
          visible={settings.dhikrFieldVisible || DEFAULT_DHIKR_FIELD_VISIBLE}
          onOrderChange={(next) => set("dhikrFieldOrder", next)}
          onVisibleChange={(next) => set("dhikrFieldVisible", next)}
        />
      </Card>

      {/* Home Layout — section order + visibility */}
      <Card className="px-5 py-4">
        <div className="mb-1 flex items-center gap-3 font-semibold text-sm">
          <LayoutGrid size={19} className="text-[var(--gold)]" />
          <span className="text-[var(--text)]">Home Layout</span>
        </div>
        <p className="mb-3 text-[11px] text-[var(--muted)] leading-relaxed">
          Reorder or hide sections on the Home page. The Continue Session widget always sits at the top when an active session exists.
        </p>
        <HomeSectionsEditor
          value={settings.homeSections || DEFAULT_HOME_SECTIONS}
          onChange={(next) => set("homeSections", next)}
        />
      </Card>

      {/* Quick Collections — Home grid configuration */}
      <Card className="px-5 py-4">
        <div className="mb-1 flex items-center gap-3 font-semibold text-sm">
          <LayoutGrid size={19} className="text-[var(--gold)]" />
          <span className="text-[var(--text)]">Quick Collections</span>
        </div>
        <p className="mb-3 text-[11px] text-[var(--muted)] leading-relaxed">
          Choose which occasion shortcuts appear on the Home grid, and in what order. Tapping one opens the Library filtered to that category.
        </p>
        <QuickCollectionsEditor
          value={settings.quickCollections || DEFAULT_QUICK_COLLECTIONS}
          onChange={(next) => set("quickCollections", next)}
        />
      </Card>
    </div>
  );

  const sectionAppearance = (
    <div className="space-y-6">
      <Card className="px-5 py-4">
        <div className="mb-3 flex items-center justify-between gap-3 font-semibold text-sm">
          <div className="flex items-center gap-3">
            {settings.appearance === "system" ? (
              <Monitor size={19} className="text-[var(--gold)]" />
            ) : effectiveAppearance === "light" ? (
              <Sun size={19} className="text-[var(--gold)]" />
            ) : (
              <Moon size={19} className="text-[var(--gold)]" />
            )}
            <span className="text-[var(--text)]">Appearance</span>
          </div>
          <div className="w-48">
            <Seg
              value={settings.appearance || "dark"}
              onChange={(v) => set("appearance", v)}
              options={[
                { v: "dark", l: "Dark" },
                { v: "light", l: "Light" },
                { v: "system", l: "System" },
              ]}
            />
          </div>
        </div>

        <div className="border-t border-[var(--line)] my-3" />

        <div className="mb-3 flex items-center gap-3 font-semibold text-sm">
          <Palette size={19} className="text-[var(--gold)]" />
          <span className="text-[var(--text)]">Theme Preset</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Object.entries(THEMES).map(([key, value]) => {
            const isSel = settings.theme === key;
            const previewVars = value[effectiveAppearance];
            return (
              <button
                key={key}
                onClick={() => set("theme", key)}
                className="flex items-center gap-2.5 rounded-2xl border p-2.5 text-left cursor-pointer transition-all active:scale-[0.97]"
                style={{
                  borderColor: isSel ? "var(--primary)" : "var(--line)",
                  background: isSel ? "var(--surface2)" : "transparent"
                }}
              >
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-black/10 shadow-sm"
                  style={{ background: previewVars["--primary"] }}
                >
                  <span className="font-arabic text-[9px] text-white" dir="rtl">س</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-[var(--text)] truncate">{value.name}</p>
                  <p className="text-[9px] text-[var(--muted)] truncate">
                    {key === "classic" ? "Sandstone Sage" :
                     key === "emerald" ? "Forest Mint" :
                     key === "sage" ? "Oatmeal Sage" :
                     key === "clay" ? "Warm Terracotta" :
                     key === "olive" ? "Olive Grove" :
                     key === "slate" ? "Misty Slate" :
                     key === "mocha" ? "Warm Stone" :
                     key === "rose" ? "Velvet Ruby" : "Obsidian Mono"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="border-t border-[var(--line)] my-4" />

        <div>
          <div className="mb-3 flex items-center gap-3 font-semibold text-sm">
            <Disc size={19} className="text-[var(--gold)]" />
            <span className="text-[var(--text)]">Counter style</span>
          </div>
          <Seg
            value={settings.counterStyle}
            onChange={(v) => set("counterStyle", v)}
            options={[{ v: "beads", l: "Beads" }, { v: "ring", l: "Ring" }]}
          />
        </div>
      </Card>

      <Card className="px-5 py-4">
        <div className="mb-3 flex items-center gap-3 font-semibold text-sm">
          <Palette size={19} className="text-[var(--gold)]" />
          <span className="text-[var(--text)]">Bead style</span>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1.5 scroll-smooth">
          {[...BEAD_THEMES, buildCustom(settings.customBead.dark, settings.customBead.gold)].map((t) => {
            const sel = settings.beadTheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => set("beadTheme", t.id)}
                className="flex shrink-0 flex-col items-center gap-1.5 cursor-pointer"
              >
                <div
                  className="rounded-2xl border p-1.5 transition-all"
                  style={{
                    borderColor: sel ? "var(--primary)" : "var(--line)",
                    background: "var(--bg2)"
                  }}
                >
                  <svg viewBox="0 0 64 64" className="h-14 w-14">
                    <circle cx="32" cy="32" r="22" fill="none" stroke={t.thread} strokeWidth="1" />
                    {Array.from({ length: 9 }).map((_, k) => {
                      const a = k * ((2 * Math.PI) / 9) - Math.PI / 2;
                      const x = 32 + 22 * Math.cos(a);
                      const y = 32 + 22 * Math.sin(a);
                      const front = k === 3;
                      const on = k < 4;
                      return (
                        <circle
                          key={k}
                          cx={x}
                          cy={y}
                          r={front ? 5.5 : 4.5}
                          fill={front ? t.front[1] : on ? t.gold[1] : t.dark[1]}
                        />
                      );
                    })}
                  </svg>
                </div>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: sel ? "var(--text)" : "var(--muted)" }}
                >
                  {t.name}
                </span>
              </button>
            );
          })}
        </div>

        {settings.beadTheme === "custom" && (
          <div className="mt-4 flex items-center gap-5 rounded-2xl border border-[var(--line)] bg-[var(--bg2)] p-3 anim-fade">
            <label className="flex items-center gap-2 text-sm text-[var(--text)] font-medium">
              Bead
              <input
                type="color"
                value={settings.customBead.dark}
                onChange={(e) => set("customBead", { ...settings.customBead, dark: e.target.value })}
                className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--text)] font-medium">
              Active
              <input
                type="color"
                value={settings.customBead.gold}
                onChange={(e) => set("customBead", { ...settings.customBead, gold: e.target.value })}
                className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent"
              />
            </label>
          </div>
        )}

        <div className="mt-4">
          <p className="mb-2 text-sm text-[var(--muted)] font-medium">Active bead style</p>
          <Seg
            value={settings.activeStyle}
            onChange={(v) => set("activeStyle", v)}
            options={[
              { v: "glow", l: "Glow" },
              { v: "ring", l: "Ring" },
              { v: "pulse", l: "Pulse" },
              { v: "plain", l: "Plain" }
            ]}
          />
        </div>
      </Card>
    </div>
  );

  const sectionCounter = (
    <div className="space-y-6">
      <Card className="px-5 py-1">
        <Row icon={Vibrate} label="Haptic feedback">
          <Toggle
            on={settings.haptics}
            onClick={() => set("haptics", !settings.haptics)}
          />
        </Row>
        <div className="border-t border-[var(--line)]" />
        <Row icon={Volume2} label="Click sound">
          <Toggle
            on={settings.sound}
            onClick={() => set("sound", !settings.sound)}
          />
        </Row>
        <div className="border-t border-[var(--line)]" />
        <Row icon={ChevronRight} label="Auto-advance sets">
          <Toggle
            on={settings.autoAdvance}
            onClick={() => set("autoAdvance", !settings.autoAdvance)}
          />
        </Row>
        <div className="border-t border-[var(--line)]" />
        <Row icon={RotateCcw} label="Loop single dhikr">
          <Toggle
            on={settings.loop}
            onClick={() => set("loop", !settings.loop)}
          />
        </Row>
        <div className="border-t border-[var(--line)]" />
        <Row icon={MousePointerClick} label="Full-screen tap to count" hint="Tap anywhere on the counter (except top & bottom bars) to increment">
          <Toggle
            on={settings.fullScreenTap}
            onClick={() => set("fullScreenTap", !settings.fullScreenTap)}
          />
        </Row>
      </Card>

      <Card className="px-5 py-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
          <Hand size={17} className="text-[var(--gold)]" />
          Gestures
        </div>
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          Beads: tap to count, or drag the beads around the loop — clockwise to count up, counter-clockwise to go back. Ring: tap to count, swipe left/right to switch dhikr. Tap the target under the number to change it (33 / 100 / 300 / 1000 / custom).
        </p>
        <div className="mb-3 mt-4 flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
          <Keyboard size={17} className="text-[var(--gold)]" />
          Keyboard (Desktop)
        </div>
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          Space / Enter / ↑ count · Backspace / ↓ undo · ← → switch · R reset · Esc back.
        </p>
      </Card>
    </div>
  );

  const sectionReminders = (
    <div className="space-y-6">
      {/* Customizable PWA Reminders & Alerts Card */}
      <Card className="px-5 py-4 space-y-4">
        <div className="flex items-center justify-between font-semibold text-sm">
          <div className="flex items-center gap-3">
            <Bell size={19} className="text-[var(--gold)] shrink-0" />
            <span className="text-[var(--text)]">Daily Reminders & Alerts</span>
          </div>
          <Toggle
            on={settings.alertsEnabled}
            onClick={async () => {
              const enabling = !settings.alertsEnabled;
              set("alertsEnabled", enabling);
              if (enabling && notifyPermission === "default") {
                await requestNotificationPermission();
              } else if (enabling && notifyPermission === "denied") {
                window.alert("Notifications are blocked. Please enable them in your browser/device settings for this app.");
              }
            }}
          />
        </div>

        {settings.alertsEnabled && (
          <div className="space-y-4 pt-1 anim-fade">
            {/* System Notification Permission Status */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface2)] p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-[var(--text)]">System Authorization</p>
                <p className="text-[10px] text-[var(--muted)]">Required to fire background notifications.</p>
              </div>
              {notifyPermission === "granted" ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2.5 py-1 rounded-full shrink-0">
                  <Check size={12} strokeWidth={3} /> Enabled
                </span>
              ) : notifyPermission === "denied" ? (
                <span className="text-[10px] font-bold text-[var(--danger)] bg-[var(--danger)]/10 px-2.5 py-1 rounded-full shrink-0">
                  Blocked
                </span>
              ) : (
                <button
                  onClick={requestNotificationPermission}
                  className="rounded-xl bg-[var(--primary)] px-3 py-1.5 text-xs font-bold text-white cursor-pointer active:scale-95 transition-all shadow-sm shrink-0"
                >
                  Authorize Reminders
                </button>
              )}
            </div>

            {notifyPermission === "denied" && (
              <p className="text-[10px] text-[var(--danger)] leading-relaxed px-1 -mt-2 font-medium">
                Notifications are blocked. Open your browser or device settings → find this site/app → allow notifications, then refresh.
              </p>
            )}

            {/* iOS PWA limitation */}
            {typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent) && (
              <p className="text-[10px] text-[var(--gold)] leading-relaxed px-1 -mt-2 font-medium">
                ⚠️ On iOS, notifications only fire while the app is open. Keep Sabḥa open or in the background for timely alerts.
              </p>
            )}
            {/* List of active alerts */}
            <div className="space-y-2">
              {settings.alerts && settings.alerts.map((a) => {
                let targetLabel = "";
                let targetTheme = "";
                if (a.targetType === "list" && a.targetId) {
                  const listObj = lists.find(x => x.id === a.targetId);
                  if (listObj) {
                    targetLabel = `${listObj.name} Set`;
                    targetTheme = "text-[var(--gold)]";
                  }
                } else if (a.targetType === "dhikr" && a.targetId) {
                  const dhikrObj = dhikrs.find(x => x.id === a.targetId);
                  if (dhikrObj) {
                    targetLabel = `${dhikrObj.tr} Dhikr`;
                    targetTheme = "text-[var(--primary)]";
                  }
                }

                return (
                  <div key={a.id} className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-bold text-[var(--gold)] shrink-0 bg-[var(--surface2)] px-2 py-0.5 rounded-lg border border-[var(--line)] mt-0.5">
                          {a.time}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[var(--text)] truncate">{a.title}</p>
                          {targetLabel && (
                            <span className={`flex items-center gap-1 mt-1 text-[10px] font-semibold ${targetTheme}`}>
                              <Link size={11} className="shrink-0" />
                              <span className="truncate">{targetLabel}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Toggle
                        on={a.enabled}
                        onClick={() => {
                          const next = settings.alerts.map(x => x.id === a.id ? { ...x, enabled: !x.enabled } : x);
                          set("alerts", next);
                        }}
                      />
                      {a.custom && (
                        <button
                          onClick={() => {
                            const next = settings.alerts.filter(x => x.id !== a.id);
                            set("alerts", next);
                          }}
                          className="p-1.5 text-[var(--danger)] cursor-pointer rounded-lg hover:bg-[var(--surface2)]"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom alarm creator */}
            <div className="border-t border-[var(--line)]/60 pt-3 space-y-3">
              <p className="text-xs font-semibold text-[var(--text)]">Add Custom Reminder Alert</p>

              <div className="space-y-2">
                {/* Selector for Alert Action Target */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Links Recitation Target</label>
                  <select
                    value={newAlert.targetType === "none" ? "none" : `${newAlert.targetType}:${newAlert.targetId}`}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "none") {
                        setNewAlert(prev => ({ ...prev, targetType: "none", targetId: "" }));
                      } else {
                        const [type, id] = val.split(":");
                        let suggestedTitle = "";
                        if (type === "list") {
                          const l = lists.find(x => x.id === id);
                          if (l) suggestedTitle = `${l.name} Routine 🕌`;
                        } else if (type === "dhikr") {
                          const d = dhikrs.find(x => x.id === id);
                          if (d) suggestedTitle = `${d.tr} Recitation 📿`;
                        }
                        setNewAlert(prev => ({
                          ...prev,
                          targetType: type,
                          targetId: id,
                          title: prev.title.trim() === "" ? suggestedTitle : prev.title
                        }));
                      }
                    }}
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface2)] px-3 py-2 text-xs font-semibold text-[var(--text)] outline-none focus:border-[var(--primary)]"
                  >
                    <option value="none">None (General Reminder)</option>
                    <optgroup label="✨ Seeded & Custom Routines">
                      {lists && lists.map(l => (
                        <option key={`list-${l.id}`} value={`list:${l.id}`}>{l.name} Set ({l.steps.length} steps)</option>
                      ))}
                    </optgroup>
                    <optgroup label="📿 Seeded & Custom Dhikrs">
                      {dhikrs && dhikrs.map(d => (
                        <option key={`dhikr-${d.id}`} value={`dhikr:${d.id}`}>{d.tr}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newAlert.title}
                    onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                    placeholder="e.g. Duha prayer remembrance…"
                    className="flex-1 rounded-xl border border-[var(--line)] bg-[var(--surface2)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] font-semibold"
                  />
                  <div className="flex gap-2 shrink-0">
                    <input
                      type="time"
                      value={newAlert.time}
                      onChange={(e) => setNewAlert({ ...newAlert, time: e.target.value })}
                      className="rounded-xl border border-[var(--line)] bg-[var(--surface2)] px-3 py-2 text-xs font-bold text-[var(--text)] outline-none focus:border-[var(--primary)]"
                    />
                    <button
                      onClick={() => {
                        if (!newAlert.title.trim() || !newAlert.time) return;
                        const alertItem = {
                          id: "a_" + Date.now(),
                          title: newAlert.title.trim(),
                          body: newAlert.targetType !== "none"
                            ? `It's time to begin your custom ${newAlert.targetType} recitation session.`
                            : "It's time for your custom dhikr remembrance.",
                          time: newAlert.time,
                          enabled: true,
                          custom: true,
                          targetType: newAlert.targetType,
                          targetId: newAlert.targetId
                        };
                        set("alerts", [...(settings.alerts || []), alertItem]);
                        setNewAlert({ title: "", time: "09:00", targetType: "none", targetId: "" });
                      }}
                      className="rounded-xl bg-[var(--primary)] px-3 py-2 text-xs font-bold text-white cursor-pointer active:scale-95 transition-all shadow-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  const sectionData = (
    <div className="space-y-6">
      {/* Backup & Restore */}
      <Card className="px-5 py-4">
        <div className="mb-1 flex items-center gap-3 font-semibold text-sm">
          <DatabaseBackup size={19} className="text-[var(--gold)]" />
          <span className="text-[var(--text)]">Backup &amp; Restore</span>
        </div>
        <p className="mb-3 text-[11px] text-[var(--muted)] leading-relaxed">
          Save a backup file with your stats, settings, custom dhikrs, sets and current session. Restore it on a new device — or after reinstalling — to pick up right where you left off.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleRestoreFile}
        />

        <div className="flex flex-col gap-2">
          {/* Export */}
          <button
            onClick={handleExport}
            className="flex items-center gap-3 rounded-2xl border px-3 py-3 text-left cursor-pointer transition-all active:scale-[0.99]"
            style={{
              borderColor: "color-mix(in srgb, var(--line) 70%, transparent)",
              background: "color-mix(in srgb, var(--surface2) 50%, transparent)",
            }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
              style={{
                background: "color-mix(in srgb, var(--primary) 14%, transparent)",
                color: "var(--primary)",
              }}
            >
              {exportState === "done" ? <Check size={17} /> : <Download size={16} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--text)]">
                {exportState === "done" ? "Backup downloaded" : "Export backup"}
              </p>
              <p className="text-[11px] text-[var(--muted)] mt-0.5">
                {exportState === "done"
                  ? "Saved as a .json file to your device"
                  : "Download all your data as a single file"}
              </p>
            </div>
          </button>

          {/* Restore */}
          <button
            onClick={() => {
              if (restoreState === "working") return;
              setRestoreError("");
              fileInputRef.current?.click();
            }}
            disabled={restoreState === "working"}
            className="flex items-center gap-3 rounded-2xl border px-3 py-3 text-left cursor-pointer transition-all active:scale-[0.99] disabled:opacity-70"
            style={{
              borderColor: "color-mix(in srgb, var(--line) 70%, transparent)",
              background: "color-mix(in srgb, var(--surface2) 50%, transparent)",
            }}
          >
            <motion.div
              animate={restoreState === "working" ? { rotate: 360 } : { rotate: 0 }}
              transition={restoreState === "working"
                ? { repeat: Infinity, duration: 0.9, ease: "linear" }
                : { duration: 0.2 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
              style={{
                background: "color-mix(in srgb, var(--gold) 16%, transparent)",
                color: "var(--gold)",
              }}
            >
              {restoreState === "done" ? <Check size={17} /> : <Upload size={16} />}
            </motion.div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--text)]">
                {restoreState === "done"
                  ? "Backup restored"
                  : restoreState === "working"
                  ? "Reading backup…"
                  : "Restore from backup"}
              </p>
              <p className="text-[11px] text-[var(--muted)] mt-0.5">
                {restoreState === "done"
                  ? "Your data has been brought back"
                  : "Replace current data with a backup file"}
              </p>
            </div>
          </button>

          {restoreError && (
            <div
              className="flex items-start gap-2 rounded-2xl border px-3 py-2.5 anim-fade"
              style={{
                borderColor: "color-mix(in srgb, var(--danger) 40%, var(--line))",
                background: "color-mix(in srgb, var(--danger) 8%, transparent)",
              }}
            >
              <AlertTriangle size={15} className="text-[var(--danger)] shrink-0 mt-0.5" />
              <p className="text-[11px] font-medium text-[var(--danger)] leading-snug">{restoreError}</p>
            </div>
          )}
        </div>
      </Card>

      {/* App & library maintenance */}
      <Card className="px-5 py-4">
        <div className="mb-1 flex items-center gap-3 font-semibold text-sm">
          <Smartphone size={19} className="text-[var(--gold)]" />
          <span className="text-[var(--text)]">App</span>
        </div>
        <p className="mb-3 text-[11px] text-[var(--muted)] leading-relaxed">
          Resync to pull the latest built-in dhikrs and sets — your custom ones are kept. Install Tasbeeh on your phone for an app-like experience.
        </p>

        <div className="flex flex-col gap-2">
          {/* Resync library */}
          <button
            onClick={handleResync}
            disabled={syncState === "syncing"}
            className="flex items-center gap-3 rounded-2xl border px-3 py-3 text-left cursor-pointer transition-all active:scale-[0.99] disabled:opacity-70"
            style={{
              borderColor: "color-mix(in srgb, var(--line) 70%, transparent)",
              background: "color-mix(in srgb, var(--surface2) 50%, transparent)",
            }}
          >
            <motion.div
              animate={syncState === "syncing" ? { rotate: 360 } : { rotate: 0 }}
              transition={syncState === "syncing"
                ? { repeat: Infinity, duration: 0.9, ease: "linear" }
                : { duration: 0.2 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
              style={{
                background: "color-mix(in srgb, var(--primary) 14%, transparent)",
                color: "var(--primary)",
              }}
            >
              {syncState === "done" ? <Check size={17} /> : <RefreshCw size={16} />}
            </motion.div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--text)]">
                {syncState === "done" ? "Library resynced" : "Resync library"}
              </p>
              <p className="text-[11px] text-[var(--muted)] mt-0.5">
                {syncState === "done"
                  ? `${dhikrs.length} dhikrs · ${lists.length} sets`
                  : "Refresh built-in dhikrs & sets, keep your customs"}
              </p>
            </div>
          </button>

          {/* Check for updates */}
          <button
            onClick={updateAvailable ? applyUpdate : handleCheckUpdates}
            disabled={updateState === "checking"}
            className="flex items-center gap-3 rounded-2xl border px-3 py-3 text-left cursor-pointer transition-all active:scale-[0.99] disabled:opacity-70"
            style={{
              borderColor: updateAvailable
                ? "color-mix(in srgb, var(--gold) 50%, var(--line))"
                : "color-mix(in srgb, var(--line) 70%, transparent)",
              background: updateAvailable
                ? "color-mix(in srgb, var(--gold) 8%, var(--surface))"
                : "color-mix(in srgb, var(--surface2) 50%, transparent)",
            }}
          >
            <motion.div
              animate={updateState === "checking" ? { rotate: 360 } : { rotate: 0 }}
              transition={updateState === "checking"
                ? { repeat: Infinity, duration: 0.9, ease: "linear" }
                : { duration: 0.2 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
              style={{
                background: updateAvailable
                  ? "color-mix(in srgb, var(--gold) 18%, transparent)"
                  : "color-mix(in srgb, var(--primary) 14%, transparent)",
                color: updateAvailable ? "var(--gold)" : "var(--primary)",
              }}
            >
              {updateState === "upToDate" ? <Check size={17} /> : <RefreshCw size={16} />}
            </motion.div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--text)]">
                {updateAvailable
                  ? "Update available — reload"
                  : updateState === "checking"
                  ? "Checking for updates…"
                  : updateState === "upToDate"
                  ? "You're up to date"
                  : "Check for updates"}
              </p>
              <p className="text-[11px] text-[var(--muted)] mt-0.5">
                {updateAvailable
                  ? "A newer version of Tasbeeh is ready"
                  : "Reload the app to fetch the newest version"}
              </p>
            </div>
          </button>

          {/* Clean up & Repair App */}
          <button
            onClick={() => {
              if (window.confirm("Clean up and repair the application? This will reset your settings and cached files, but your recitation stats and custom items will be preserved.")) {
                cleanUpApp();
              }
            }}
            className="flex items-center gap-3 rounded-2xl border px-3 py-3 text-left cursor-pointer transition-all active:scale-[0.99]"
            style={{
              borderColor: "color-mix(in srgb, var(--line) 70%, transparent)",
              background: "color-mix(in srgb, var(--surface2) 50%, transparent)",
            }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
              style={{
                background: "color-mix(in srgb, var(--danger) 14%, transparent)",
                color: "var(--danger)",
              }}
            >
              <RotateCcw size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--text)]">Clean up & Repair App</p>
              <p className="text-[11px] text-[var(--muted)] mt-0.5">
                Clears app caches and resets settings (keeps stats & custom dhikrs)
              </p>
            </div>
          </button>

          {/* Install PWA */}
          {installPrompt ? (
            <button
              onClick={promptInstall}
              className="flex items-center gap-3 rounded-2xl border px-3 py-3 text-left cursor-pointer transition-all active:scale-[0.99]"
              style={{
                borderColor: "color-mix(in srgb, var(--primary) 45%, var(--line))",
                background: "color-mix(in srgb, var(--primary) 8%, var(--surface))",
              }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                style={{
                  background: "color-mix(in srgb, var(--primary) 18%, transparent)",
                  color: "var(--primary)",
                }}
              >
                <Download size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--text)]">Install Tasbeeh</p>
                <p className="text-[11px] text-[var(--muted)] mt-0.5">
                  Add to your home screen for a full-screen, offline-ready experience
                </p>
              </div>
            </button>
          ) : isInstalled ? (
            <div
              className="flex items-center gap-3 rounded-2xl border px-3 py-3"
              style={{
                borderColor: "color-mix(in srgb, var(--line) 70%, transparent)",
                background: "color-mix(in srgb, var(--surface2) 40%, transparent)",
              }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                style={{
                  background: "color-mix(in srgb, var(--gold) 16%, transparent)",
                  color: "var(--gold)",
                }}
              >
                <Check size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--text)]">Installed</p>
                <p className="text-[11px] text-[var(--muted)] mt-0.5">
                  Tasbeeh is running as an installed app
                </p>
              </div>
            </div>
          ) : (
            <div
              className="flex items-start gap-3 rounded-2xl border px-3 py-3"
              style={{
                borderColor: "color-mix(in srgb, var(--line) 70%, transparent)",
                background: "color-mix(in srgb, var(--surface2) 40%, transparent)",
              }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                style={{
                  background: "color-mix(in srgb, var(--primary) 14%, transparent)",
                  color: "var(--primary)",
                }}
              >
                <Smartphone size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--text)]">Install on your device</p>
                <p className="text-[11px] text-[var(--muted)] mt-0.5 leading-relaxed">
                  On iOS Safari, tap <span className="font-semibold">Share → Add to Home Screen</span>. On Android Chrome, tap the menu and choose <span className="font-semibold">Install app</span>.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <button
        onClick={() => {
          if (window.confirm("Reset all statistics? This cannot be undone.")) {
            setStats({ total: 0, byDate: {}, perDhikr: {} });
          }
        }}
        className="w-full rounded-2xl border border-[var(--danger)] py-3 text-sm font-medium text-[var(--danger)] hover:bg-[var(--danger)]/5 transition-all cursor-pointer active:scale-99"
      >
        Reset statistics
      </button>

      <p className="px-4 text-center text-[10px] text-[var(--muted)] leading-relaxed">
        Dhikr wording and counts follow common narrations. Please verify against a trusted source.
      </p>
    </div>
  );

  /* ── Menu config ────────────────────────────────────────────────────── */
  const CATEGORIES = [
    {
      id: "display",
      label: "Display & Reading",
      hint: "Language, dhikr fields, home layout",
      icon: LayoutGrid,
      content: sectionDisplay,
    },
    {
      id: "appearance",
      label: "Appearance & Themes",
      hint: "Light/dark, theme presets, beads",
      icon: Palette,
      content: sectionAppearance,
    },
    {
      id: "counter",
      label: "Counting & Feedback",
      hint: "Haptics, sound, gestures, auto-advance",
      icon: Disc,
      content: sectionCounter,
    },
    {
      id: "reminders",
      label: "Reminders & Alerts",
      hint: "Daily notifications and schedules",
      icon: Bell,
      content: sectionReminders,
    },
    {
      id: "data",
      label: "Backup & App",
      hint: "Backup, restore, updates, reset",
      icon: DatabaseBackup,
      content: sectionData,
    },
  ];

  const active = CATEGORIES.find((c) => c.id === panel) || null;

  return (
    <div className="anim-fade pb-6 overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {!active ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="pt-2 pb-4 font-display text-2xl text-[var(--text)]">Settings</h1>

            <div className="flex flex-col gap-2">
              {CATEGORIES.map((c, i) => {
                const Icon = c.icon;
                return (
                  <motion.button
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, type: "spring", stiffness: 320, damping: 26 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => openPanel(c.id)}
                    className="flex items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left cursor-pointer"
                    style={{
                      borderColor: "color-mix(in srgb, var(--line) 70%, transparent)",
                      background: "color-mix(in srgb, var(--surface) 70%, transparent)",
                    }}
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-2xl shrink-0"
                      style={{
                        background: "color-mix(in srgb, var(--primary) 13%, transparent)",
                        color: "var(--primary)",
                      }}
                    >
                      <Icon size={19} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--text)]">{c.label}</p>
                      <p className="text-[11px] text-[var(--muted)] mt-0.5 truncate">{c.hint}</p>
                    </div>
                    <ChevronRight size={18} className="text-[var(--muted)] shrink-0" />
                  </motion.button>
                );
              })}
            </div>

            <p className="px-4 pt-6 text-center text-[10px] text-[var(--muted)] leading-relaxed font-mono">
              Sabḥa v{appVersion}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 28 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Sub-screen header with back affordance */}
            <div className="flex items-center gap-2 pt-2 pb-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={closePanel}
                aria-label="Back to settings"
                className="flex h-9 w-9 items-center justify-center rounded-full shrink-0 cursor-pointer"
                style={{
                  background: "color-mix(in srgb, var(--surface2) 70%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--line) 60%, transparent)",
                  color: "var(--text)",
                }}
              >
                <ArrowLeft size={18} />
              </motion.button>
              <h1 className="font-display text-xl text-[var(--text)] truncate">{active.label}</h1>
            </div>

            {active.content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsView;
