import { useState } from "react";
import { Compass } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DAILY_CATS } from "../../constants/dailyDuas";
import { ListGroup, ListRow, Panel, SectionHeader } from "../common/Layout";
import { Button } from "../common/Button";
import DhikrReader from "../counter/DhikrReader";
import IstikharaSheet from "../duas/IstikharaSheet";

/* The Library's Daily tab: du'as for moments in the day, grouped by where
   they belong, searchable by the shared box above, one tap to read. */
export const DailyDuas = ({ query = "" }) => {
  const { dhikrs, settings, startDhikr } = useApp();
  const [cat, setCat] = useState("all");
  const [reading, setReading] = useState(null);
  const [istikhara, setIstikhara] = useState(false);

  const all = dhikrs.filter((d) => d.tags?.includes("daily"));
  const guide = all.find((d) => d.id === "istikhara");
  const q = query.trim().toLowerCase();
  const matches = (d) =>
    !q || [d.moment, d.tr, d.en, DAILY_CATS[d.cat]].some((v) => v?.toLowerCase().includes(q)) || d.arabic.includes(query.trim());
  const shown = all.filter((d) => d.id !== "istikhara" && (cat === "all" || d.cat === cat) && matches(d));
  const showGuide = guide && (cat === "all" || cat === "guidance") && (matches(guide) || /decision|choice|guid/.test(q));
  const groups = Object.keys(DAILY_CATS)
    .map((k) => [k, shown.filter((d) => d.cat === k)])
    .filter(([, list]) => list.length);

  return (
    <div className="space-y-6">
      <div className="scroll-fade-x -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar lg:mx-0 lg:flex-wrap lg:px-0 lg:mask-none" role="group" aria-label="Moments">
        {[["all", "All"], ...Object.entries(DAILY_CATS)].map(([k, v]) => (
          <button key={k} type="button" className="chip" aria-pressed={cat === k} onClick={() => setCat(k)}>
            {v}
          </button>
        ))}
      </div>

      {showGuide && (
        <Panel className="p-5">
          <p className="eyebrow flex items-center gap-2 text-gold">
            <Compass size={14} strokeWidth={2} aria-hidden="true" />
            For a decision
          </p>
          <h2 className="mt-2 font-display text-[1.5rem] leading-tight text-ink">Istikhara</h2>
          <p className="mt-1.5 max-w-[55ch] text-sm leading-relaxed text-muted">
            Two rak'ahs, then the du'a the Prophet ﷺ taught for every matter. With space to note what you are weighing.
          </p>
          <Button className="mt-4" onClick={() => setIstikhara(true)}>
            Open the guide
          </Button>
        </Panel>
      )}

      {groups.length === 0 && !showGuide ? (
        <p className="rounded-2xl border border-dashed border-line px-5 py-8 text-center text-[0.9375rem] text-muted">
          No du'a matches &ldquo;{query.trim()}&rdquo;. Try a word like travel, rain or eating.
        </p>
      ) : (
        groups.map(([k, list]) => (
          <section key={k} aria-labelledby={`daily-${k}`} className="space-y-3">
            <SectionHeader id={`daily-${k}`} title={DAILY_CATS[k]} />
            <ListGroup>
              {list.map((d) => (
                <ListRow key={d.id} title={d.moment} subtitle={d.tr} chevron onClick={() => setReading(d)} ariaLabel={`Read: ${d.moment}`} />
              ))}
            </ListGroup>
          </section>
        ))
      )}

      <DhikrReader open={!!reading} onClose={() => setReading(null)} d={reading} lang={settings.lang} arabicScale={settings.arabicScale ?? 1} textScale={settings.textScale ?? 1} />
      <IstikharaSheet
        open={istikhara}
        onClose={() => setIstikhara(false)}
        d={guide}
        onBegin={
          guide
            ? () => {
                setIstikhara(false);
                startDhikr(guide);
              }
            : undefined
        }
      />
    </div>
  );
};

export default DailyDuas;
