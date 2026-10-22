import { useId } from "react";
import { useApp } from "../../context/AppContext";
import { sound, knowsRingerMode } from "../../utils/feedback";
import Seg from "../common/Seg";
import Toggle from "../common/Toggle";

// Vibration and sound rows, shared by Settings, the counter's Adjust sheet and setup.
const Row = ({ label, hint, children }) => {
  const id = useId();
  return (
    <div className="flex items-center gap-4 px-4 py-3.5">
      <div className="min-w-0 flex-1">
        <p id={id} className="text-[0.9375rem] font-medium text-ink">
          {label}
        </p>
        {hint && <p className="mt-0.5 text-sm leading-snug text-muted">{hint}</p>}
      </div>
      {typeof children === "function" ? children(id) : children}
    </div>
  );
};

export default function FeelControls({ rhythm = true, tapAnywhere = false, className = "" }) {
  const { settings, setSettings } = useApp();
  const flip = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }));
  const pickSound = (v) => {
    setSettings((s) => ({ ...s, sound: v !== "off", soundType: v === "off" ? s.soundType : v }));
    if (v !== "off") sound("count", { type: v });
  };

  return (
    <div className={`divide-y divide-line rounded-2xl border border-line bg-surface ${className}`}>
      <Row label="Vibration">
        <Seg
          label="Vibration"
          size="sm"
          className="shrink-0"
          value={settings.haptics ? settings.hapticStrength || "soft" : "off"}
          onChange={(v) => setSettings((s) => ({ ...s, haptics: v !== "off", hapticStrength: v === "off" ? s.hapticStrength : v }))}
          options={[{ v: "off", l: "Off" }, { v: "soft", l: "Soft" }, { v: "firm", l: "Firm" }]}
        />
      </Row>
      {settings.haptics && (
        <Row label="Only when a dhikr is done" hint="A pulse at each tick mark, plus every 100 on long counts. Also happens by itself on low battery.">
          {(id) => <Toggle labelledBy={id} on={!!settings.hapticMilestones} onClick={() => flip("hapticMilestones")} />}
        </Row>
      )}
      {settings.haptics && rhythm && (
        <Row label="Feel which dhikr you're on" hint="In a set, each count taps once for the first dhikr, twice for the second, up to four.">
          {(id) => <Toggle labelledBy={id} on={!!settings.stepRhythm} onClick={() => flip("stepRhythm")} />}
        </Row>
      )}
      <Row label="Sound" hint={knowsRingerMode() ? "Stays quiet while your phone is on silent or vibrate." : undefined}>
        <Seg
          label="Sound"
          size="sm"
          className="shrink-0"
          value={settings.sound ? settings.soundType || "bead" : "off"}
          onChange={pickSound}
          options={[{ v: "off", l: "Off" }, { v: "bead", l: "Bead" }, { v: "click", l: "Click" }]}
        />
      </Row>
      {tapAnywhere && (
        <Row label="Tap anywhere to count" hint="The whole screen counts, apart from the top and bottom controls.">
          {(id) => <Toggle labelledBy={id} on={!!settings.fullScreenTap} onClick={() => flip("fullScreenTap")} />}
        </Row>
      )}
    </div>
  );
}
