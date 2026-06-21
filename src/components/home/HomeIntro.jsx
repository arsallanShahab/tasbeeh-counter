import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Moon, Sun, Sparkles, Mountain, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import BrandMark from "../common/BrandMark";
import { hijriFormatted, topOccasion } from "../../utils/hijri";
import { hijriNightOffset } from "../../utils/prayerTimes";

const ICON_MAP = { star: Star, moon: Moon, sun: Sun, sparkles: Sparkles, mountain: Mountain };

/* The top-of-home intro: date + Hijri + brand + greeting, and — when there's a
   special day — the occasion folded into the same block. Intentionally has no
   card background; it's the one "open" section above the carded stack. Live:
   ticks so the date rolls at midnight and the Hijri date flips at Maghrib. */
export const HomeIntro = () => {
  const { settings, lists, startList } = useApp();
  const navigate = useNavigate();

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const d = new Date(now);
  const hr = d.getHours();
  const greet = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";

  const offset = (settings.prayer?.hijriOffset || 0) + hijriNightOffset(settings.prayer, d);
  const abbr = d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const hijri = hijriFormatted(d, offset);
  const occ = topOccasion(d, offset);
  const OccIcon = occ ? ICON_MAP[occ.icon] || Sparkles : null;

  const handleCta = () => {
    if (!occ) return;
    if (occ.cta?.kind === "list") {
      const list = lists.find((l) => l.id === occ.cta.id);
      if (list) {
        startList(list);
        return;
      }
    }
    const target = occ.cta?.kind === "occasion" ? occ.cta.id : occ.id;
    navigate(`/library?occasion=${encodeURIComponent(target)}`);
  };

  return (
    <header className="pt-2">
      {/* Brand + greeting */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
            {abbr}
            {hijri && <span className="text-[var(--muted)] normal-case"> · {hijri}</span>}
          </p>
          <BrandMark className="mt-1 text-4xl" />
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs text-[var(--muted)] block font-medium">{greet},</span>
          <span className="text-sm font-bold text-[var(--text)]">Seeker</span>
        </div>
      </div>

      {/* Occasion — inline, still background-free, separated by a faint hairline */}
      {occ && (
        <div
          className="mt-4 flex items-center gap-3 border-t pt-4"
          style={{ borderColor: "color-mix(in srgb, var(--line) 45%, transparent)" }}
        >
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: "color-mix(in srgb, var(--gold) 14%, transparent)", color: occ.accent }}
          >
            {OccIcon && <OccIcon size={21} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: occ.accent }}>
              {occ.label}
            </p>
            <p className="text-[11px] text-[var(--muted)] leading-snug mt-0.5 line-clamp-2">
              {occ.desc}
            </p>
          </div>
          <button
            onClick={handleCta}
            className="flex shrink-0 items-center gap-1 rounded-2xl px-3.5 py-2.5 text-[11px] font-bold text-white cursor-pointer active:scale-[0.96] hover:brightness-105 transition-all shadow-sm"
            style={{ background: occ.accent }}
          >
            {occ.cta?.label || "Open"} <ArrowRight size={13} />
          </button>
        </div>
      )}
    </header>
  );
};

export default HomeIntro;
