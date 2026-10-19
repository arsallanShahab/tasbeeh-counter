import { Star, Moon, Sun, Sparkles, Mountain, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { BrandMark } from "../common/BrandMark";
import { hijriFormatted } from "../../utils/hijri";
import { hijriDisplayOffset } from "../../utils/prayerTimes";
import { useNow } from "../../hooks/useNow";

const ICON_MAP = { star: Star, moon: Moon, sun: Sun, sparkles: Sparkles, mountain: Mountain };

/* The top of Today: the date in both calendars, a greeting set large, and,
   on a special day the occasion underneath when the lead card isn't showing
   it. Open on the page, no card. Ticks so the dates roll at midnight and Maghrib. */
export const HomeIntro = ({ occasion: occ = null }) => {
  const { settings, startList } = useApp();
  const now = useNow();

  const d = new Date(now);
  const hr = d.getHours();
  const first = (settings.name || "").trim().split(/\s+/)[0];
  const greet = hr < 5 ? "Peaceful night" : hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";

  const offset = hijriDisplayOffset(settings.prayer, d);
  const greg = d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
  const hijri = hijriFormatted(d, offset);
  const OccIcon = occ ? ICON_MAP[occ.icon] || Sparkles : null;

  return (
    <header>
      <div className="mb-5 lg:hidden">
        <BrandMark />
      </div>

      <p className="eyebrow">
        <span>{greg}</span>
        {hijri && (
          <>
            <span className="mx-2 text-line-strong" aria-hidden="true">/</span>
            <span>{hijri}</span>
          </>
        )}
      </p>
      <p className="mt-2 font-display text-[2.5rem] leading-[1.02] font-medium tracking-[-0.015em] text-ink lg:text-6xl">
        {greet}
        {first ? <span className="[overflow-wrap:anywhere]">, {first}</span> : null}.
      </p>

      {occ && (
        <button
          type="button"
          onClick={() => startList(occ.set)}
          aria-label={`Begin ${occ.set.name}, ${occ.label}`}
          className="row-interactive -mx-3 mt-4 flex min-h-12 w-[calc(100%+1.5rem)] items-center gap-3 rounded-xl px-3 py-2 text-left"
        >
          {OccIcon && <OccIcon size={18} strokeWidth={1.75} className="shrink-0 text-gold" aria-hidden="true" />}
          <span className="min-w-0 flex-1">
            <span className="block text-[0.9375rem] font-medium text-ink">{occ.label}</span>
            <span className="block truncate text-sm text-muted">{occ.set.name}</span>
          </span>
          <ArrowRight size={16} className="shrink-0 text-muted" aria-hidden="true" />
        </button>
      )}
    </header>
  );
};

export default HomeIntro;
