import React, { useState } from "react";
import { 
  Globe, Moon, Sun, Disc, Palette, Vibrate, Volume2, 
  ChevronRight, RotateCcw, Hand, Keyboard, Sparkles,
  Bell, Trash2, Plus, Check, Link
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import Toggle from "../common/Toggle";
import Seg from "../common/Seg";
import { BEAD_THEMES, THEMES } from "../../constants/dhikrData";
import { buildCustom } from "../../utils/theme";

export const SettingsView = () => {
  const {
    settings,
    setSettings,
    setStats,
    notifyPermission,
    requestNotificationPermission,
    dhikrs,
    lists
  } = useApp();

  const [newAlert, setNewAlert] = useState({ title: "", time: "09:00", targetType: "none", targetId: "" });

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
        <div className="border-t border-[var(--line)]" />
        <Row icon={Sparkles} label="Show transliteration">
          <Toggle 
            on={settings.translit} 
            onClick={() => set("translit", !settings.translit)} 
          />
        </Row>
      </Card>

      <Card className="px-5 py-4">
        <div className="mb-3 flex items-center justify-between font-semibold text-sm">
          <div className="flex items-center gap-3">
            {settings.appearance === "light" ? (
              <Sun size={19} className="text-[var(--gold)]" />
            ) : (
              <Moon size={19} className="text-[var(--gold)]" />
            )}
            <span className="text-[var(--text)]">Appearance</span>
          </div>
          <div className="w-36">
            <Seg 
              value={settings.appearance || "dark"} 
              onChange={(v) => set("appearance", v)} 
              options={[{ v: "dark", l: "Dark" }, { v: "light", l: "Light" }]} 
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
            const previewVars = value[settings.appearance || "dark"];
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
                    {key === "classic" ? "Sandstone Sage" : key === "emerald" ? "Forest Mint" : key === "lapis" ? "Blue Sapphire" : key === "rose" ? "Velvet Ruby" : key === "amber" ? "Honey Amber" : "Obsidian Mono"}
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
            onClick={() => set("alertsEnabled", !settings.alertsEnabled)} 
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
                  Blocked in Browser
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
