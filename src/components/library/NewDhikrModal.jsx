import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Sheet } from "../common/Modal";
import { Button } from "../common/Button";
import { Field, TextInput } from "../common/Field";
import { useToast } from "../common/toastContext";

const PRESETS = [33, 100, 300, 1000];
const EMPTY = { tr: "", arabic: "", en: "", ur: "", target: 33 };

/* Create or edit a dhikr of your own. Opened with ?modal=dhikr, plus
   &edit=<id> to change an existing custom one. Errors appear only after a
   save attempt, beside the field they belong to. */
export const DhikrEditor = ({ isOpen, onClose }) => {
  const { editId, dById, createDhikr, updateDhikr, startDhikr } = useApp();
  const toast = useToast();

  const editing = isOpen && editId ? dById(editId) : null;
  const [form, setForm] = useState(EMPTY);
  const [tried, setTried] = useState(false);

  // Reset the form each time the sheet opens, prefilled when editing.
  const sessionKey = isOpen ? editId || "new" : null;
  const [loadedKey, setLoadedKey] = useState(null);
  if (sessionKey !== loadedKey) {
    setLoadedKey(sessionKey);
    if (sessionKey) {
      setForm(editing ? { tr: editing.tr, arabic: editing.arabic, en: editing.en || "", ur: editing.ur || "", target: editing.target } : EMPTY);
      setTried(false);
    }
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const errors = {
    arabic: !form.arabic.trim() ? "Add the Arabic text. This is what you'll read while counting." : null,
    tr: !form.tr.trim() ? "Add a transliteration, so you can find this dhikr by name." : null,
    target: !(Number(form.target) >= 1) ? "Enter a count of 1 or more." : null,
  };
  const valid = !errors.arabic && !errors.tr && !errors.target;

  const save = (e) => {
    e?.preventDefault();
    setTried(true);
    if (!valid) return;
    if (editing) {
      updateDhikr(editing.id, {
        tr: form.tr.trim(),
        arabic: form.arabic.trim(),
        en: form.en.trim(),
        ur: form.ur.trim(),
        target: form.target,
      });
      toast("Changes saved");
    } else {
      const id = createDhikr(form);
      const label = form.tr.trim();
      toast(`Added “${label}” to your library`, {
        action: { label: "Begin", onClick: () => startDhikr({ id, tr: label, target: Math.max(1, Math.round(Number(form.target))) }) },
      });
    }
    onClose();
  };

  const show = (k) => (tried ? errors[k] : null);

  return (
    <Sheet
      open={isOpen}
      onClose={onClose}
      title={editing ? "Edit dhikr" : "New dhikr"}
      description={editing ? undefined : "Add a dhikr or du‘a that isn't in the library."}
      initialFocus="textarea"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="dhikr-form">
            {editing ? "Save changes" : "Add dhikr"}
          </Button>
        </div>
      }
    >
      <form id="dhikr-form" onSubmit={save} className="space-y-5" noValidate>
        <Field label="Arabic" error={show("arabic")}>
          <textarea
            dir="rtl"
            lang="ar"
            rows={2}
            value={form.arabic}
            onChange={set("arabic")}
            placeholder="سُبْحَانَ اللّٰهِ"
            className="field-input h-auto min-h-22 py-3 text-center font-arabic text-[1.75rem] leading-[1.8]"
          />
        </Field>
        <Field label="Transliteration" error={show("tr")}>
          <TextInput value={form.tr} onChange={set("tr")} placeholder="SubhanAllah" autoComplete="off" />
        </Field>
        <Field label="English meaning" optional>
          <TextInput value={form.en} onChange={set("en")} placeholder="Glory be to Allah" autoComplete="off" />
        </Field>
        <Field label="Urdu meaning" optional>
          <TextInput dir="rtl" lang="ur" value={form.ur} onChange={set("ur")} placeholder="اللہ پاک ہے" className="font-urdu text-lg" />
        </Field>
        <Field label="Count" hint="How many times to recite it in one sitting." error={show("target")}>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Common counts">
              {PRESETS.map((v) => (
                <button
                  key={v}
                  type="button"
                  className="chip numerals"
                  aria-pressed={Number(form.target) === v}
                  onClick={() => setForm((f) => ({ ...f, target: v }))}
                >
                  {v}
                </button>
              ))}
            </div>
            <TextInput
              type="number"
              inputMode="numeric"
              min={1}
              value={form.target}
              onChange={set("target")}
              aria-label="Custom count"
              className="numerals h-9 w-24 text-center text-[0.9375rem]"
            />
          </div>
        </Field>
      </form>
    </Sheet>
  );
};

export default DhikrEditor;
