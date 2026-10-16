import { useApp } from "../../context/AppContext";
import { BEAD_THEMES } from "../../constants/dhikrData";
import { beadMark, buildCustom } from "../../utils/theme";

// Tiny previews for each counter style (64 x 44).
const ringDots = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
  return [32 + 17 * Math.cos(a), 22 + 17 * Math.sin(a)];
});
const strandDots = Array.from({ length: 9 }, (_, i) => {
  const t = 0.06 + i * 0.11;
  const u = 1 - t;
  return [u * u * u * -4 + 3 * u * u * t * 18 + 3 * u * t * t * 46 + t * t * t * 68, u * u * u * 38 + 3 * u * u * t * 10 + 3 * u * t * t * 10 + t * t * t * 38];
});

const COUNTER_STYLES = [
  {
    v: "beads",
    l: "Circle",
    hint: "A full misbaha",
    preview: ringDots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 0 ? 3.4 : 2.4} fill={i === 0 ? "var(--primary)" : "currentColor"} />),
  },
  {
    v: "strand",
    l: "Strand",
    hint: "Beads flow along a string",
    preview: (
      <>
        <path d="M-4 38 C18 10 46 10 68 38" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
        {strandDots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 4 ? 3.2 : 2.4} fill={i === 4 ? "var(--primary)" : "currentColor"} opacity={i < 1 || i > 7 ? 0.4 : 1} />
        ))}
      </>
    ),
  },
  {
    v: "ring",
    l: "Minimal",
    hint: "A simple progress ring",
    preview: (
      <>
        <circle cx="32" cy="22" r="17" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
        <path d="M32 5 A17 17 0 0 1 48.2 27" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
  },
];

// Three beads on a cord; the middle one shows the mark (64 x 32).
const side = (
  <>
    <path d="M2 26 Q32 6 62 26" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
    <circle cx="13" cy="20" r="3.6" fill="currentColor" opacity="0.55" />
    <circle cx="51" cy="20" r="3.6" fill="currentColor" opacity="0.55" />
  </>
);
const MARKS = [
  {
    v: "raised",
    l: "Raised",
    preview: (
      <>
        {side}
        <ellipse cx="32" cy="20" rx="4.6" ry="1.8" fill="currentColor" opacity="0.18" />
        <circle cx="32" cy="12.5" r="5" fill="var(--primary)" />
      </>
    ),
  },
  {
    v: "rim",
    l: "Rim light",
    preview: (
      <>
        {side}
        <circle cx="32" cy="16" r="4.2" fill="var(--primary)" />
        <path d="M26.2 13.9 A6.2 6.2 0 0 1 37.8 13.9" fill="none" stroke="var(--gold)" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
  },
  {
    v: "marker",
    l: "Marker",
    preview: (
      <>
        {side}
        <circle cx="32" cy="16" r="4.2" fill="var(--primary)" />
        <circle cx="32" cy="6.5" r="1.4" fill="var(--gold)" />
      </>
    ),
  },
  {
    v: "none",
    l: "None",
    preview: (
      <>
        {side}
        <circle cx="32" cy="16" r="3.8" fill="currentColor" opacity="0.55" />
      </>
    ),
  },
];

const Label = ({ children }) => <p className="mb-2.5 text-sm font-medium text-ink">{children}</p>;

// Counter style, bead colours and the current-bead highlight. Used in
// Settings and in the counter's own style sheet.
export const CounterStylePicker = () => {
  const { settings, setSettings } = useApp();
  const set = (k, v) => setSettings((s) => ({ ...s, [k]: v }));
  const style = settings.counterStyle || "beads";
  const beads = [...BEAD_THEMES, buildCustom(settings.customBead.dark, settings.customBead.gold)];

  return (
    <div className="space-y-7">
      <div>
        <Label>Style</Label>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Counter style">
          {COUNTER_STYLES.map((c) => {
            const on = style === c.v;
            return (
              <button
                key={c.v}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => set("counterStyle", c.v)}
                className={`flex flex-col items-center gap-2 rounded-xl border px-2 pb-3 pt-4 transition-colors ${
                  on ? "border-ink bg-surface" : "border-line hover:border-line-strong"
                }`}
              >
                <svg viewBox="0 0 64 44" className="h-11 w-16 text-ink" aria-hidden="true">
                  {c.preview}
                </svg>
                <span className="text-sm font-medium text-ink">{c.l}</span>
                <span className="text-center text-[0.8125rem] leading-snug text-muted">{c.hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      {style !== "ring" && (
        <>
          <div>
            <Label>Beads</Label>
            <div className="scroll-fade-x -mx-6 flex gap-3 overflow-x-auto px-6 pb-1 no-scrollbar lg:mx-0 lg:flex-wrap lg:px-0 lg:mask-none" role="radiogroup" aria-label="Bead colours">
              {beads.map((t) => {
                const on = settings.beadTheme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => set("beadTheme", t.id)}
                    className="flex shrink-0 flex-col items-center gap-1.5"
                  >
                    <span className={`rounded-xl border p-1.5 transition-colors ${on ? "border-ink" : "border-line"}`}>
                      <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden="true">
                        <circle cx="32" cy="32" r="22" fill="none" stroke={t.thread} strokeWidth="1" />
                        {Array.from({ length: 9 }).map((_, k) => {
                          const a = k * ((2 * Math.PI) / 9) - Math.PI / 2;
                          return (
                            <circle
                              key={k}
                              cx={32 + 22 * Math.cos(a)}
                              cy={32 + 22 * Math.sin(a)}
                              r={k === 3 ? 5.5 : 4.5}
                              fill={k === 3 ? t.front[1] : k < 4 ? t.gold[1] : t.dark[1]}
                            />
                          );
                        })}
                      </svg>
                    </span>
                    <span className={`text-[0.8125rem] ${on ? "font-medium text-ink" : "text-muted"}`}>{t.name}</span>
                  </button>
                );
              })}
            </div>
            {settings.beadTheme === "custom" && (
              <div className="mt-3 flex flex-wrap items-center gap-6 rounded-2xl border border-line bg-surface p-4">
                <label className="flex items-center gap-3 text-[0.9375rem] font-medium text-ink">
                  Beads
                  <input
                    type="color"
                    value={settings.customBead.dark}
                    onChange={(e) => set("customBead", { ...settings.customBead, dark: e.target.value })}
                    className="h-9 w-12 cursor-pointer rounded-lg border border-line-strong bg-transparent"
                  />
                </label>
                <label className="flex items-center gap-3 text-[0.9375rem] font-medium text-ink">
                  Counted
                  <input
                    type="color"
                    value={settings.customBead.gold}
                    onChange={(e) => set("customBead", { ...settings.customBead, gold: e.target.value })}
                    className="h-9 w-12 cursor-pointer rounded-lg border border-line-strong bg-transparent"
                  />
                </label>
              </div>
            )}
          </div>
          <div>
            <Label>Next bead</Label>
            <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="How the next bead stands out">
              {MARKS.map((m) => {
                const on = beadMark(settings.activeStyle) === m.v;
                return (
                  <button
                    key={m.v}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => set("activeStyle", m.v)}
                    className={`flex min-w-0 flex-col items-center gap-1.5 rounded-xl border px-1 pb-2.5 pt-3 transition-colors ${
                      on ? "border-ink bg-surface" : "border-line hover:border-line-strong"
                    }`}
                  >
                    <svg viewBox="0 0 64 32" className="h-8 w-full max-w-16 text-ink" aria-hidden="true">
                      {m.preview}
                    </svg>
                    <span className="text-center text-[0.8125rem] leading-tight font-medium text-ink">{m.l}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CounterStylePicker;
