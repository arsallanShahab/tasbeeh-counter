import React, { useState } from "react";
import {
  Globe, Moon, Sun, Monitor, Disc, Palette, Vibrate, Volume2,
  ChevronRight, RotateCcw, Hand, Keyboard, Sparkles,
  Bell, Trash2, Plus, Check, Link, ChevronUp, ChevronDown, Eye, EyeOff, GripVertical, LayoutGrid,
  RefreshCw, Download, Smartphone
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import Toggle from "../common/Toggle";
import Seg from "../common/Seg";
import { BEAD_THEMES, THEMES, DHIKR_FIELDS, DEFAULT_DHIKR_FIELD_ORDER, DEFAULT_DHIKR_FIELD_VISIBLE, OCCASIONS, OCCASION_ICONS, DEFAULT_QUICK_COLLECTIONS } from "../../constants/dhikrData";
import { buildCustom, useEffectiveAppearance } from "../../utils/theme";

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
    updateAvailable,
    applyUpdate,
    checkForUpdates,
    installPrompt,
    promptInstall,
    isInstalled,
  } = useApp();

  const effectiveAppearance = useEffectiveAppearance(settings.appearance);

  const [newAlert, setNewAlert] = useState({ title: "", time: "09:00", targetType: "none", targetId: "" });
  const [syncState, setSyncState] = useState("idle"); // idle | syncing | done
  const [updateState, setUpdateState] = useState("idle"); // idle | checking | upToDate

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

  const Row = ({ icon: Ico, label, children }) => (
    <div className="flex items-center gap-3 py-3.5">
      <Ico size={19} className="text-[var(--gold)] shrink-0" />
      <span className="flex-1 text-[var(--text)] text-sm font-medium">{label}</span>
      {children}
    </div>
  );

  const set = (k, v) => setSettings((s) => ({ ...s, [k]: v }));

  return (
    <div className="space-y-6 anim-fade pb-6">
      <h1 className="pt-2 font-display text-2xl text-[var(--text)]">Settings</h1>

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
      </Card>

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
};

export default SettingsView;
