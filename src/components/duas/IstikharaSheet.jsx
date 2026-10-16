import { useMemo, useState } from "react";
import { Share2, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../common/toastContext";
import { Sheet } from "../common/Modal";
import { Button, IconButton } from "../common/Button";
import ShareSheet from "../common/ShareSheet";

const STEPS = [
  "Make wudu and pray two rak'ahs, other than the obligatory prayer.",
  "After the prayer, praise Allah, send salawat on the Prophet ﷺ, then say the du'a below.",
  "Where it says \"this matter\", name what you are deciding, aloud or in your heart.",
  "Then go ahead with what you are inclined to, trusting Allah. There is no need to wait for a dream or a sign: if it is good He will ease it, and if not He will turn it away.",
  "You may repeat it, and ask people you trust for their advice as well.",
];

/* The istikhara prayer: steps, the du'a, and private notes on what you are
   weighing. `d` is the istikhara dhikr from the library. */
export const IstikharaSheet = ({ open, onClose, d, onBegin }) => {
  const { settings, setSettings } = useApp();
  const toast = useToast();
  const [text, setText] = useState("");
  const [sharing, setSharing] = useState(false);
  const card = useMemo(
    () => d && { eyebrow: "Istikhara", arabic: d.arabic, title: d.tr, meaning: d.en, source: "Bukhari 1162", filename: "istikhara.png" },
    [d]
  );
  const notes = settings.istikharaNotes || [];
  const save = (next) => setSettings((s) => ({ ...s, istikharaNotes: next }));
  const showMeaning = settings.lang !== "ur";

  const add = (e) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    save([{ id: `is_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`, text: v, createdAt: Date.now() }, ...notes]);
    setText("");
  };
  const remove = (n) => {
    const before = notes;
    save(notes.filter((x) => x.id !== n.id));
    toast("Note removed", { action: { label: "Undo", onClick: () => save(before) } });
  };

  return (
    <>
    <Sheet open={open} onClose={onClose} title="Istikhara" description="Seeking Allah's guidance for a decision." size="lg">
      <ol className="space-y-3">
        {STEPS.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="numerals flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sunken font-display text-base text-ink">{i + 1}</span>
            <p className="pt-0.5 text-[0.9375rem] leading-relaxed text-ink">{s}</p>
          </li>
        ))}
      </ol>

      {d && (
        <section className="mt-6 space-y-4 border-t border-line pt-6" aria-label="The du'a">
          <p dir="rtl" lang="ar" className="text-center font-arabic text-[1.75rem] leading-[2] text-ink">
            {d.arabic}
          </p>
          <p className="font-display text-lg leading-relaxed italic text-ink">{d.tr}</p>
          {showMeaning && <p className="text-[0.9375rem] leading-relaxed text-muted">{d.en}</p>}
          <p className="text-sm leading-relaxed text-muted">{d.hadith}</p>
          <div className="flex flex-wrap gap-2">
            {onBegin && (
              <Button variant="tonal" size="sm" onClick={onBegin}>
                Open in the counter
              </Button>
            )}
            <Button variant="tonal" size="sm" icon={Share2} onClick={() => setSharing(true)}>
              Share as image
            </Button>
          </div>
        </section>
      )}

      <section className="mt-6 border-t border-line pt-6" aria-labelledby="istikhara-notes-h">
        <h3 id="istikhara-notes-h" className="font-display text-xl text-ink">
          What you are weighing
        </h3>
        <p className="mt-1 text-sm text-muted">Kept on this device only.</p>
        <form onSubmit={add} className="mt-3 space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Taking the job in Leeds, or staying where I am…"
            aria-label="The decision you are weighing"
            className="field-input h-auto min-h-24 resize-y py-3 leading-relaxed"
          />
          <Button type="submit" size="sm" disabled={!text.trim()}>
            Save note
          </Button>
        </form>
        {notes.length > 0 && (
          <ul className="mt-4 divide-y divide-line rounded-2xl border border-line">
            {notes.map((n) => (
              <li key={n.id} className="flex items-start gap-3 py-3 pl-4 pr-2">
                <div className="min-w-0 flex-1">
                  <p className="whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-ink [overflow-wrap:anywhere]">{n.text}</p>
                  <p className="mt-0.5 text-[0.8125rem] text-muted">
                    {new Date(n.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <IconButton icon={Trash2} label={`Remove note: ${n.text}`} size="sm" onClick={() => remove(n)} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </Sheet>
    <ShareSheet open={open && sharing} onClose={() => setSharing(false)} card={card} />
    </>
  );
};

export default IstikharaSheet;
