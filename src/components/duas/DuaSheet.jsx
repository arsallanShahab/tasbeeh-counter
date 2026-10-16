import { useState } from "react";
import { Check, ChevronDown, RotateCcw, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../common/toastContext";
import { Sheet } from "../common/Modal";
import { Button, IconButton } from "../common/Button";
import { TextInput } from "../common/Field";

const dayLabel = (t) => new Date(t).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

/* Your own list of things to ask Allah for. Opened from Today, after a set,
   and at the times du'a is answered (`moment` describes the open window). */
export const DuaSheet = ({ open, onClose, moment }) => {
  const { settings, setSettings } = useApp();
  const toast = useToast();
  const [text, setText] = useState("");
  const [showAnswered, setShowAnswered] = useState(false);
  const list = settings.duaList || [];
  const asking = list.filter((d) => !d.answeredAt);
  const answered = list.filter((d) => d.answeredAt).sort((a, b) => b.answeredAt - a.answeredAt);
  const save = (next) => setSettings((s) => ({ ...s, duaList: next }));

  const add = (e) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    save([{ id: `du_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`, text: v, createdAt: Date.now() }, ...list]);
    setText("");
  };
  const markAnswered = (id) => {
    save(list.map((d) => (d.id === id ? { ...d, answeredAt: Date.now() } : d)));
    toast("Moved to answered. Alhamdulillah.");
  };
  const reopen = (id) => save(list.map((d) => (d.id === id ? { ...d, answeredAt: undefined } : d)));
  const remove = (d) => {
    const before = list;
    save(list.filter((x) => x.id !== d.id));
    toast("Du'a removed", { action: { label: "Undo", onClick: () => save(before) } });
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={moment ? moment.label : "Your du'a list"}
      description={moment ? moment.desc : "What you want to ask Allah for. Read through it when you make du'a."}
    >
      <p className="mb-4 rounded-xl bg-sunken px-4 py-3 text-sm leading-relaxed text-muted">
        Begin by praising Allah and sending salawat on the Prophet ﷺ, then ask. (Tirmidhi 3477)
      </p>

      <form onSubmit={add} className="flex gap-2">
        <TextInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Health for my mother, a good job…"
          aria-label="Add a du'a"
          maxLength={280}
          className="min-w-0 flex-1"
        />
        <Button type="submit" disabled={!text.trim()} className="h-12 shrink-0">
          Add
        </Button>
      </form>

      {asking.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-line px-5 py-6 text-center text-[0.9375rem] leading-relaxed text-muted">
          Nothing on your list yet. Add the first thing you want to ask for.
        </p>
      ) : (
        <ol className="mt-5 divide-y divide-line rounded-2xl border border-line">
          {asking.map((d, i) => (
            <li key={d.id} className="flex items-start gap-3 py-3 pl-4 pr-2">
              <span className="numerals mt-0.5 w-5 shrink-0 font-display text-base text-muted">{i + 1}</span>
              <p className="min-w-0 flex-1 whitespace-pre-wrap pt-0.5 text-[0.9375rem] leading-relaxed text-ink [overflow-wrap:anywhere]">{d.text}</p>
              <IconButton icon={Check} label={`Mark answered: ${d.text}`} size="sm" onClick={() => markAnswered(d.id)} />
              <IconButton icon={Trash2} label={`Remove: ${d.text}`} size="sm" onClick={() => remove(d)} />
            </li>
          ))}
        </ol>
      )}

      {answered.length > 0 && (
        <div className="mt-5">
          <Button variant="link" size="sm" iconRight={ChevronDown} aria-expanded={showAnswered} className="-ml-2" onClick={() => setShowAnswered((v) => !v)}>
            Answered ({answered.length})
          </Button>
          {showAnswered && (
            <ul className="mt-2 divide-y divide-line rounded-2xl border border-line">
              {answered.map((d) => (
                <li key={d.id} className="flex items-start gap-3 py-3 pl-4 pr-2">
                  <Check size={16} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.9375rem] leading-relaxed text-ink [overflow-wrap:anywhere]">{d.text}</p>
                    <p className="mt-0.5 text-[0.8125rem] text-muted">Answered {dayLabel(d.answeredAt)}</p>
                  </div>
                  <IconButton icon={RotateCcw} label={`Ask again: ${d.text}`} size="sm" onClick={() => reopen(d.id)} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Sheet>
  );
};

export default DuaSheet;
