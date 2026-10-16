import { useState } from "react";
import { Play, Pin, PinOff, Pencil, Copy, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Sheet } from "../common/Modal";
import { Button } from "../common/Button";
import { useToast } from "../common/toastContext";
import { OCCASIONS } from "../../constants/dhikrData";
import { fmt } from "../../utils/stats";

const isCustom = (id) => typeof id === "string" && id.startsWith("c_");
const minutes = (n) => Math.max(1, Math.round((n * 1.3) / 60));

const Prose = ({ label, children }) => (
  <div>
    <h3 className="eyebrow mb-2">{label}</h3>
    <p className="max-w-[65ch] text-[0.9375rem] leading-relaxed text-ink">{children}</p>
  </div>
);

/* Detail sheet for one set or one dhikr: what is in it, and everything you
   can do with it (begin, pin, edit or customise, delete) in one place. */
export const ItemSheet = ({ item, onClose }) => {
  const {
    dById,
    lists,
    dhikrs,
    pinned,
    togglePin,
    startList,
    startDhikr,
    openEditor,
    duplicateList,
    deleteList,
    deleteDhikr,
    settings,
  } = useApp();
  const toast = useToast();

  // `item` is { kind, id }. Data is looked up live so edits show at once, and
  // the last value is kept so the sheet can animate out after a delete.
  const live = item ? (item.kind === "list" ? lists : dhikrs).find((x) => x.id === item.id) || null : null;
  const [last, setLast] = useState(null);
  if (live && last?.data !== live) setLast({ kind: item.kind, data: live });
  const open = !!live;
  const kind = live ? item.kind : last?.kind;
  const data = live || last?.data;
  const custom = data && isCustom(data.id);
  const isPinned = data && pinned.includes(data.id);
  const lang = settings.lang;

  const onPin = () => {
    togglePin(data.id);
    toast(isPinned ? "Removed from Today" : "Pinned to Today");
  };

  const onDelete = () => {
    const undo = kind === "list" ? deleteList(data.id) : deleteDhikr(data.id);
    const name = kind === "list" ? data.name : data.tr;
    onClose();
    if (undo) toast(`Deleted “${name}”`, { action: { label: "Undo", onClick: undo } });
  };

  const onCustomise = () => {
    const id = duplicateList(data.id);
    if (!id) return;
    toast(`Made an editable copy of “${data.name}”`);
    openEditor("list", id);
  };

  // replace: the counter takes over this sheet history entry, so Back from
  // the counter returns to the library rather than to a closed sheet.
  const begin = () => (kind === "list" ? startList(data, { replace: true }) : startDhikr(data, { replace: true }));

  if (!data) return <Sheet open={false} onClose={onClose} title="" />;

  const total = kind === "list" ? data.steps.reduce((a, s) => a + (Number(s.target) || 0), 0) : data.target;
  // Each part stays whole ("about 2 min"); lines break only between parts.
  const keep = (t) => t.replace(/ /g, " ");
  const description = (
    kind === "list"
      ? [OCCASIONS[data.occasion] || "Custom", `${data.steps.length} ${data.steps.length === 1 ? "dhikr" : "dhikrs"}`, `${fmt(total)} counts`, total >= 20 && `about ${minutes(total)} min`]
      : [custom ? "Your dhikr" : "Dhikr", `${fmt(data.target)} times`, data.target >= 20 && `about ${minutes(data.target)} min`]
  )
    .filter(Boolean)
    .map(keep)
    .join(" · ");

  const footer = (
    <div className="flex flex-col gap-3">
      <Button size="lg" icon={Play} block onClick={begin} disabled={kind === "list" && data.steps.length === 0}>
        Begin
      </Button>
      <div className="flex flex-wrap gap-2">
        <Button variant="tonal" size="sm" icon={isPinned ? PinOff : Pin} onClick={onPin} aria-pressed={isPinned}>
          {isPinned ? "Unpin" : "Pin to Today"}
        </Button>
        {custom ? (
          <Button variant="tonal" size="sm" icon={Pencil} onClick={() => openEditor(kind, data.id)}>
            Edit
          </Button>
        ) : (
          kind === "list" && (
            <Button variant="tonal" size="sm" icon={Copy} onClick={onCustomise}>
              Customise a copy
            </Button>
          )
        )}
        {custom && (
          <Button variant="danger" size="sm" icon={Trash2} onClick={onDelete} className="ml-auto">
            Delete
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Sheet open={open} onClose={onClose} title={kind === "list" ? data.name : data.tr} description={description} footer={footer}>
      {kind === "list" ? (
        data.steps.length === 0 ? (
          <p className="text-[0.9375rem] text-muted">This set has no dhikr yet. Edit it to add some.</p>
        ) : (
          // One block per step: its place and count on top, then the text.
          <ol className="divide-y divide-line border-y border-line">
            {data.steps.map((s, i) => {
              const d = dById(s.dhikr);
              return (
                <li key={`${s.dhikr}-${i}`} className="py-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="eyebrow numerals">{data.steps.length > 1 ? `Step ${i + 1} of ${data.steps.length}` : "Recite"}</span>
                    <span className="numerals rounded-full bg-sunken px-2.5 py-0.5 text-sm font-semibold text-ink">×{fmt(s.target)}</span>
                  </div>
                  {d ? (
                    <>
                      <p dir="rtl" lang="ar" className="mt-2 text-right font-arabic text-2xl leading-[1.9] text-ink">
                        {d.arabic}
                      </p>
                      <p className="mt-1 text-[0.9375rem] font-medium text-ink">{d.tr}</p>
                      {d.en && <p className="mt-0.5 text-sm leading-relaxed text-muted">{d.en}</p>}
                    </>
                  ) : (
                    <p className="mt-2 text-[0.9375rem] text-muted">This dhikr was removed.</p>
                  )}
                </li>
              );
            })}
          </ol>
        )
      ) : (
        <div className="space-y-6">
          <p dir="rtl" lang="ar" className="rounded-2xl bg-sunken px-5 py-6 text-center font-arabic text-[2rem] leading-[1.9] text-ink">
            {data.arabic}
          </p>
          {(lang === "en" || lang === "both") && data.en && <Prose label="Meaning">{data.en}</Prose>}
          {(lang === "ur" || lang === "both") && data.ur && (
            <div>
              <h3 className="eyebrow mb-2">Urdu</h3>
              <p dir="rtl" lang="ur" className="font-urdu text-lg text-ink">
                {data.ur}
              </p>
            </div>
          )}
          {data.hadith && <Prose label="Hadith">{data.hadith}</Prose>}
          {data.benefits && <Prose label="Virtue">{data.benefits}</Prose>}
          {data.story && <Prose label="Background">{data.story}</Prose>}
        </div>
      )}
    </Sheet>
  );
};

export default ItemSheet;
