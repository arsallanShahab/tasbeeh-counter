import { Check, Eye, EyeOff } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useGoogleFonts } from "../../utils/fonts";
import Seg from "../common/Seg";
import {
  ARABIC_FONTS, DHIKR_FIELDS, DEFAULT_DHIKR_FIELD_ORDER, DEFAULT_DHIKR_FIELD_VISIBLE,
} from "../../constants/dhikrData";

// Reading controls shared by Settings and the counter's Display sheet.

const SCALES = [
  { v: 0.875, l: "Small" },
  { v: 1, l: "Default" },
  { v: 1.15, l: "Large" },
  { v: 1.3, l: "Larger" },
];

const useSet = () => {
  const { settings, setSettings } = useApp();
  return [settings, (k, v) => setSettings((s) => ({ ...s, [k]: v }))];
};

const fieldOrderOf = (settings) => {
  const order = settings.dhikrFieldOrder || DEFAULT_DHIKR_FIELD_ORDER;
  return [...order, ...DEFAULT_DHIKR_FIELD_ORDER.filter((k) => !order.includes(k))].filter((k) => DHIKR_FIELDS[k]);
};

const Label = ({ children, hint }) => (
  <div className="mb-2 flex items-baseline justify-between gap-3">
    <p className="text-sm font-medium text-ink">{children}</p>
    {hint && <p className="text-[0.8125rem] text-muted">{hint}</p>}
  </div>
);

export const TextSizeControls = () => {
  const [settings, set] = useSet();
  return (
    <div className="space-y-4">
      <div>
        <Label>Arabic size</Label>
        <Seg label="Arabic size" size="sm" value={settings.arabicScale ?? 1} onChange={(v) => set("arabicScale", v)} options={SCALES} />
      </div>
      <div>
        <Label>Text size</Label>
        <Seg
          label="Transliteration and translation size"
          size="sm"
          value={settings.textScale ?? 1}
          onChange={(v) => set("textScale", v)}
          options={SCALES}
        />
      </div>
    </div>
  );
};

export const LanguageControl = () => {
  const [settings, set] = useSet();
  return (
    <Seg
      label="Translation language"
      size="sm"
      value={settings.lang}
      onChange={(v) => set("lang", v)}
      options={[
        { v: "en", l: "English" },
        { v: "ur", l: "اردو", dir: "rtl" },
        { v: "both", l: "Both" },
      ]}
    />
  );
};

// Show or hide each line above the counter; at least one stays on.
export const FieldToggles = () => {
  const [settings, set] = useSet();
  const order = fieldOrderOf(settings);
  const visible = settings.dhikrFieldVisible || DEFAULT_DHIKR_FIELD_VISIBLE;
  const onCount = order.filter((k) => visible[k] !== false).length;
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Lines shown while counting">
      {order.map((k) => {
        const on = visible[k] !== false;
        const Icon = on ? Eye : EyeOff;
        return (
          <button
            key={k}
            type="button"
            className="chip"
            aria-pressed={on}
            disabled={on && onCount <= 1}
            onClick={() => set("dhikrFieldVisible", { ...visible, [k]: !on })}
          >
            <Icon size={14} aria-hidden="true" />
            {DHIKR_FIELDS[k].label}
          </button>
        );
      })}
    </div>
  );
};

// `rail` scrolls sideways for a sheet; `grid` suits the Settings page.
export const ArabicFontPicker = ({ layout = "grid" }) => {
  const [settings, set] = useSet();
  useGoogleFonts(ARABIC_FONTS.map((f) => f.gf));
  const rail = layout === "rail";
  return (
    <div
      role="radiogroup"
      aria-label="Arabic typeface"
      className={rail ? "scroll-fade-x -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar" : "grid grid-cols-2 gap-2 sm:grid-cols-3"}
    >
      {ARABIC_FONTS.map((f) => {
        const on = (settings.arabicFont || "amiri") === f.id;
        return (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => set("arabicFont", f.id)}
            className={`flex flex-col gap-1 rounded-xl border p-3 text-left transition-colors ${rail ? "w-34 shrink-0" : ""} ${
              on ? "border-ink bg-surface" : "border-line hover:border-line-strong"
            }`}
          >
            <span dir="rtl" lang="ar" className={`block w-full truncate leading-[1.7] text-ink ${rail ? "text-[1.375rem]" : "text-[1.6rem]"}`} style={{ fontFamily: f.stack }}>
              بِسْمِ اللّٰهِ
            </span>
            <span className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-medium text-ink">{f.name}</span>
              {on && <Check size={15} className="shrink-0 text-accent" aria-hidden="true" />}
            </span>
            <span className="truncate text-[0.8125rem] text-muted">{f.sub}</span>
          </button>
        );
      })}
    </div>
  );
};

export { Label as ControlLabel };
