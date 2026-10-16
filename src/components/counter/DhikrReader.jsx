import { useMemo, useState } from "react";
import { Share2 } from "lucide-react";
import { Sheet } from "../common/Modal";
import { Seg } from "../common/Seg";
import { Button } from "../common/Button";
import ShareSheet from "../common/ShareSheet";

// The reference at the end of a hadith, such as "Bukhari 1145".
const refOf = (h) => (h?.match(/\(([^()]*\d[^()]*)\)\s*$/) || [])[1] || "";

/* The full text of a dhikr, with its virtue and background when the library
   has them. A sheet over the counter, so closing it returns you mid-count. */
export const DhikrReader = ({ open, onClose, d, lang = "both", arabicScale = 1, textScale = 1 }) => {
  const [tab, setTab] = useState("text");
  const [forId, setForId] = useState(d?.id);
  const [sharing, setSharing] = useState(false);
  const card = useMemo(
    () =>
      d && {
        eyebrow: d.moment || "",
        arabic: d.arabic,
        title: d.tr,
        meaning: d.en,
        source: refOf(d.hadith),
        filename: `${(d.moment || d.tr).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "dhikr"}.png`,
      },
    [d]
  );
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
    ...(hasStory ? [{ v: "story", l: d.moment ? "When" : "Background" }] : []),
  ];

  return (
    <>
    <Sheet open={open} onClose={onClose} title={d.moment || d.tr} size="lg">
      {tabs.length > 1 && <Seg label="Reader section" value={tab} onChange={setTab} options={tabs} className="mb-6" />}

      {tab === "text" && (
        <div className="space-y-6">
          <p dir="rtl" lang="ar" className="text-center font-arabic leading-[1.95] text-ink" style={{ fontSize: `${2.25 * arabicScale}rem` }}>
            {d.arabic}
          </p>
          <div className="space-y-5 border-t border-line pt-6">
            <section>
              <h3 className="eyebrow mb-2">Transliteration</h3>
              <p className="font-display leading-relaxed italic text-ink" style={{ fontSize: `${1.25 * textScale}rem` }}>
                {d.tr}
              </p>
            </section>
            {(lang === "en" || lang === "both") && d.en && (
              <section>
                <h3 className="eyebrow mb-2">Meaning</h3>
                <p className="max-w-[65ch] leading-relaxed text-ink" style={{ fontSize: `${textScale}rem` }}>
                  {d.en}
                </p>
              </section>
            )}
            {(lang === "ur" || lang === "both") && d.ur && (
              <section>
                <h3 className="eyebrow mb-2">Urdu</h3>
                <p dir="rtl" lang="ur" className="font-urdu text-ink" style={{ fontSize: `${1.25 * textScale}rem` }}>
                  {d.ur}
                </p>
              </section>
            )}
          </div>
          <Button variant="tonal" size="sm" icon={Share2} onClick={() => setSharing(true)}>
            Share as image
          </Button>
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
    <ShareSheet open={open && sharing} onClose={() => setSharing(false)} card={card} />
    </>
  );
};

export default DhikrReader;
