import { useNavigate } from "react-router-dom";
import { Star, Moon, Sun, Sparkles, Mountain, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import { topOccasion } from "../../utils/hijri";

const ICON_MAP = { star: Star, moon: Moon, sun: Sun, sparkles: Sparkles, mountain: Mountain };

export const OccasionCard = () => {
  const { settings, lists, startList } = useApp();
  const navigate = useNavigate();
  const offset = settings.prayer?.hijriOffset || 0;

  // Cheap pure computation from today's date — no memo needed.
  const occ = topOccasion(new Date(), offset);

  if (!occ) return null;

  const Icon = ICON_MAP[occ.icon] || Sparkles;

  const handleCta = () => {
    if (occ.cta?.kind === "list") {
      const list = lists.find((l) => l.id === occ.cta.id);
      if (list) {
        startList(list);
        return;
      }
    }
    // occasion browse (or list fallback)
    const target = occ.cta?.kind === "occasion" ? occ.cta.id : occ.id;
    navigate(`/library?occasion=${encodeURIComponent(target)}`);
  };

  return (
    <Card
      className="p-5 border-2 shadow-md flex items-center gap-4"
      style={{ borderColor: occ.accent }}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
        style={{ background: "color-mix(in srgb, var(--gold) 14%, transparent)", color: occ.accent }}
      >
        <Icon size={22} />
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: occ.accent }}>
          Today
        </p>
        <h3 className="font-display text-lg font-bold text-[var(--text)] leading-tight truncate">
          {occ.label}
        </h3>
        <p className="text-[11px] text-[var(--muted)] leading-snug line-clamp-2">{occ.desc}</p>
      </div>
      <button
        onClick={handleCta}
        className="flex shrink-0 items-center gap-1 rounded-2xl px-3.5 py-2.5 text-[11px] font-bold text-white cursor-pointer active:scale-[0.96] hover:brightness-105 transition-all shadow-sm"
        style={{ background: occ.accent }}
      >
        {occ.cta?.label || "Open"} <ArrowRight size={13} />
      </button>
    </Card>
  );
};

export default OccasionCard;
