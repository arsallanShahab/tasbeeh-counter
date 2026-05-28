import React from "react";
import { 
  Globe, Moon, Sun, Disc, Palette, Vibrate, Volume2, 
  ChevronRight, RotateCcw, Hand, Keyboard, Sparkles 
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import Toggle from "../common/Toggle";
import Seg from "../common/Seg";
import { BEAD_THEMES } from "../../constants/dhikrData";
import { buildCustom } from "../../utils/theme";

export const SettingsView = () => {
  const {
    settings,
    setSettings,
    setStats
  } = useApp();

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

      <Card className="px-5 py-1">
        <div className="py-3.5">
          <div className="mb-3 flex items-center gap-3 font-semibold text-sm">
            {settings.theme === "dark" ? (
              <Moon size={19} className="text-[var(--gold)]" />
            ) : (
              <Sun size={19} className="text-[var(--gold)]" />
            )}
            <span className="text-[var(--text)]">Theme</span>
          </div>
          <Seg 
            value={settings.theme} 
            onChange={(v) => set("theme", v)} 
            options={[{ v: "dark", l: "Dark" }, { v: "light", l: "Light" }]} 
          />
        </div>
        <div className="border-t border-[var(--line)]" />
        <div className="py-3.5">
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

      <Card className="px-5 py-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
          <Hand size={17} className="text-[var(--gold)]" /> 
          Gestures
        </div>
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          Beads: tap to count, or drag the beads around the loop — left to count up, right to go back. Ring: tap to count, swipe left/right to switch dhikr. Tap the target under the number to change it (33 / 100 / 300 / 1000 / custom).
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
