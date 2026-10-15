import { Star, Moon, Sun, Sparkles, Mountain, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { BrandMark } from "../common/BrandMark";
import { Button } from "../common/Button";
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
  const greet = hr < 5 ? "Peaceful night" : hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";

  const offset = hijriDisplayOffset(settings.prayer, d);
  const greg = d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
  const hijri = hijriFormatted(d, offset);
  const OccIcon = occ ? ICON_MAP[occ.icon] || Sparkles : null;

  return (
    <header>
      <div className="mb-8 lg:hidden">
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
      <p className="mt-3 font-display text-[2.75rem] leading-[1.02] font-medium tracking-[-0.015em] text-ink lg:text-6xl">
        {greet}.
      </p>

      {occ && (
        <div className="mt-6 flex items-start gap-4 border-t border-line pt-5">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-gold">
            {OccIcon && <OccIcon size={19} strokeWidth={1.75} aria-hidden="true" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl leading-snug text-ink">{occ.label}</p>
            <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{occ.desc}</p>
            <Button variant="link" size="sm" iconRight={ArrowRight} onClick={() => startList(occ.set)} className="-ml-2 mt-2">
              {occ.set.name}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default HomeIntro;
