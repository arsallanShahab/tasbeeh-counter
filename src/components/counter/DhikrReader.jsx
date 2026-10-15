import { useState } from "react";
import { Sheet } from "../common/Modal";
import { Seg } from "../common/Seg";

/* The full text of a dhikr, with its virtue and background when the library
   has them. A sheet over the counter, so closing it returns you mid-count. */
export const DhikrReader = ({ open, onClose, d, lang = "both" }) => {
  const [tab, setTab] = useState("text");
  const [forId, setForId] = useState(d?.id);
  if (d?.id !== forId) {
    setForId(d?.id);
    setTab("text");
  }

  if (!d) return <Sheet open={false} onClose={onClose} title="" />;

  const hasVirtue = !!(d.hadith || d.benefits);
  const hasStory = !!d.story;
  const tabs = [
    { v: "text", l: "Text" },
    ...(hasVirtue ? [{ v: "virtue", l: "Virtue" }] : []),
    ...(hasStory ? [{ v: "story", l: "Background" }] : []),
  ];

  return (
    <Sheet open={open} onClose={onClose} title={d.tr} size="lg">
      {tabs.length > 1 && <Seg label="Reader section" value={tab} onChange={setTab} options={tabs} className="mb-6" />}

      {tab === "text" && (
        <div className="space-y-6">
          <p dir="rtl" lang="ar" className="text-center font-arabic text-[2.25rem] leading-[1.95] text-ink">
            {d.arabic}
          </p>
          <div className="space-y-5 border-t border-line pt-6">
            <section>
              <h3 className="eyebrow mb-2">Transliteration</h3>
              <p className="font-display text-xl leading-relaxed italic text-ink">{d.tr}</p>
            </section>
            {(lang === "en" || lang === "both") && d.en && (
              <section>
                <h3 className="eyebrow mb-2">Meaning</h3>
                <p className="max-w-[65ch] text-base leading-relaxed text-ink">{d.en}</p>
              </section>
            )}
            {(lang === "ur" || lang === "both") && d.ur && (
              <section>
                <h3 className="eyebrow mb-2">Urdu</h3>
                <p dir="rtl" lang="ur" className="font-urdu text-xl text-ink">
                  {d.ur}
                </p>
              </section>
            )}
          </div>
        </div>
      )}

      {tab === "virtue" && (
        <div className="space-y-6">
          {d.hadith && (
            <blockquote className="border-l-2 border-line-strong pl-5">
              <p className="font-display text-lg leading-relaxed text-ink">{d.hadith}</p>
            </blockquote>
          )}
          {d.benefits && (
            <section>
              <h3 className="eyebrow mb-2">Why recite it</h3>
              <p className="max-w-[65ch] text-base leading-relaxed text-ink">{d.benefits}</p>
            </section>
          )}
        </div>
      )}

      {tab === "story" && d.story && <p className="max-w-[65ch] text-base leading-relaxed text-ink">{d.story}</p>}
    </Sheet>
  );
};

export default DhikrReader;
