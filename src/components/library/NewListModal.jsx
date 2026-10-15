import { useMemo, useState } from "react";
import { Plus, X, ChevronUp, ChevronDown, Search, Check } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { OCCASIONS, ICONS } from "../../constants/dhikrData";
import { Sheet } from "../common/Modal";
import { Button, IconButton } from "../common/Button";
import { Field, TextInput, Select } from "../common/Field";
import { useToast } from "../common/toastContext";
import { fmt } from "../../utils/stats";

const EMPTY = { name: "", occasion: "custom", icon: "sparkles", steps: [] };

/* Create or edit a set: a named sequence of dhikr, each with its own count.
   Steps can be reordered, recounted and removed in place; dhikr are added
   from a searchable picker rather than one long dropdown. */
export const SetEditor = ({ isOpen, onClose }) => {
  const { editId, lists, dhikrs, dById, createList, updateList, startList } = useApp();
  const toast = useToast();

  const editing = isOpen && editId ? lists.find((l) => l.id === editId) : null;
  const [form, setForm] = useState(EMPTY);
  const [tried, setTried] = useState(false);
  const [picking, setPicking] = useState(false);
  const [query, setQuery] = useState("");
  const [justAdded, setJustAdded] = useState(null);

  // Reset on every open; prefill when editing.
  const sessionKey = isOpen ? editId || "new" : null;
  const [loadedKey, setLoadedKey] = useState(null);
  if (sessionKey !== loadedKey) {
    setLoadedKey(sessionKey);
    if (sessionKey) {
      setForm(
        editing
          ? { name: editing.name, occasion: editing.occasion || "custom", icon: editing.icon || "sparkles", steps: editing.steps.map((s) => ({ ...s })) }
          : EMPTY
      );
      setTried(false);
      setPicking(!editing);
      setQuery("");
    }
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = dhikrs.filter((d) => !d.tags?.includes("names-of-allah") || q);
    if (!q) return pool.slice(0, 40);
    return pool
      .filter(
        (d) =>
          d.tr.toLowerCase().includes(q) ||
          (d.en && d.en.toLowerCase().includes(q)) ||
          d.arabic.includes(query.trim())
      )
      .slice(0, 60);
  }, [dhikrs, query]);

  const errors = {
    name: !form.name.trim() ? "Give the set a name, for example “After Fajr”." : null,
    steps: form.steps.length === 0 ? "Add at least one dhikr to the set." : null,
  };
  const valid = !errors.name && !errors.steps;
  const total = form.steps.reduce((a, s) => a + (Number(s.target) || 0), 0);

  const addStep = (d) => {
    setForm((f) => ({ ...f, steps: [...f.steps, { dhikr: d.id, target: d.target || 33 }] }));
    setJustAdded(d.id);
    setTimeout(() => setJustAdded((x) => (x === d.id ? null : x)), 900);
  };
  const updateStep = (i, target) =>
    setForm((f) => ({ ...f, steps: f.steps.map((s, idx) => (idx === i ? { ...s, target } : s)) }));
  const removeStep = (i) => setForm((f) => ({ ...f, steps: f.steps.filter((_, idx) => idx !== i) }));
  const moveStep = (i, dir) =>
    setForm((f) => {
      const j = i + dir;
      if (j < 0 || j >= f.steps.length) return f;
      const steps = [...f.steps];
      [steps[i], steps[j]] = [steps[j], steps[i]];
      return { ...f, steps };
    });

  const save = (e) => {
    e?.preventDefault();
    setTried(true);
    if (!valid) return;
    const clean = { ...form, name: form.name.trim(), steps: form.steps.map((s) => ({ dhikr: s.dhikr, target: Math.max(1, Math.round(Number(s.target) || 1)) })) };
    if (editing) {
      updateList(editing.id, clean);
      toast("Set saved");
    } else {
      const id = createList(clean);
      toast(`Created “${clean.name}”`, {
        action: { label: "Begin", onClick: () => startList({ ...clean, id }) },
      });
    }
    onClose();
  };

  const show = (k) => (tried ? errors[k] : null);

  return (
    <Sheet
      open={isOpen}
      onClose={onClose}
      size="lg"
      title={editing ? "Edit set" : "New set"}
      description={editing ? undefined : "Chain several dhikr into one session. The counter moves to the next one when each count is done."}
      initialFocus="input"
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="numerals text-sm text-muted">
            {form.steps.length} {form.steps.length === 1 ? "dhikr" : "dhikr"} · {fmt(total)} counts
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" form="set-form">
              {editing ? "Save set" : "Create set"}
            </Button>
          </div>
        </div>
      }
    >
      <form id="set-form" onSubmit={save} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-start">
          <Field label="Name" error={show("name")}>
            <TextInput
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="After Fajr"
              autoComplete="off"
            />
          </Field>
          <Field label="Category">
            <Select value={form.occasion} onChange={(e) => setForm((f) => ({ ...f, occasion: e.target.value }))}>
              {Object.entries(OCCASIONS)
                .filter(([k]) => k !== "names-of-allah")
                .map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
            </Select>
          </Field>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">Icon</legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Icon">
            {Object.entries(ICONS).map(([k, Ico]) => {
              const on = form.icon === k;
              return (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={k}
                  onClick={() => setForm((f) => ({ ...f, icon: k }))}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
                    on ? "border-ink bg-ink text-page" : "border-line text-ink hover:border-line-strong"
                  }`}
                >
                  <Ico size={19} strokeWidth={1.75} aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </fieldset>

        <section aria-labelledby="steps-h" className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h3 id="steps-h" className="text-sm font-medium text-ink">
              Dhikr in this set
            </h3>
            {form.steps.length > 0 && <span className="text-[0.8125rem] text-muted">Recited in this order</span>}
          </div>

          {form.steps.length > 0 && (
            <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
              {form.steps.map((s, i) => {
                const d = dById(s.dhikr);
                const label = d?.tr || "Removed dhikr";
                return (
                  <li key={`${s.dhikr}-${i}`} className="flex items-center gap-2 py-2 pl-4 pr-2">
                    <span className="numerals w-5 shrink-0 font-display text-base text-muted">{i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.9375rem] font-medium text-ink">{label}</span>
                      {d && (
                        <span dir="rtl" lang="ar" className="block truncate font-arabic text-base leading-relaxed text-muted">
                          {d.arabic}
                        </span>
                      )}
                    </span>
                    <label className="sr-only" htmlFor={`step-${i}`}>
                      Count for {label}
                    </label>
                    <input
                      id={`step-${i}`}
                      type="number"
                      inputMode="numeric"
                      min={1}
                      value={s.target}
                      onChange={(e) => updateStep(i, e.target.value)}
                      className="field-input numerals h-10 w-[4.5rem] px-2 text-center text-[0.9375rem]"
                    />
                    <div className="flex">
                      <IconButton icon={ChevronUp} label={`Move ${label} up`} size="sm" disabled={i === 0} onClick={() => moveStep(i, -1)} />
                      <IconButton
                        icon={ChevronDown}
                        label={`Move ${label} down`}
                        size="sm"
                        disabled={i === form.steps.length - 1}
                        onClick={() => moveStep(i, 1)}
                      />
                      <IconButton icon={X} label={`Remove ${label}`} size="sm" className="text-danger" onClick={() => removeStep(i)} />
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {show("steps") && (
            <p className="text-[0.8125rem] text-danger" role="alert">
              {errors.steps}
            </p>
          )}

          {picking ? (
            <div className="rounded-2xl border border-line bg-page-2 p-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Find a dhikr to add"
                    aria-label="Find a dhikr to add"
                    className="field-input h-11 pl-10"
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={() => setPicking(false)}>
                  Done
                </Button>
              </div>
              <ul className="mt-2 max-h-72 divide-y divide-line overflow-y-auto overscroll-contain rounded-xl bg-surface">
                {results.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted">No dhikr matches that search.</li>}
                {results.map((d) => {
                  const added = justAdded === d.id;
                  return (
                    <li key={d.id}>
                      <button
                        type="button"
                        onClick={() => addStep(d)}
                        className="row-interactive flex w-full items-center gap-3 px-4 py-2.5 text-left"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.9375rem] font-medium text-ink">{d.tr}</span>
                          {d.en && <span className="block truncate text-[0.8125rem] text-muted">{d.en}</span>}
                        </span>
                        <span className="numerals text-[0.8125rem] text-muted">×{d.target}</span>
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                            added ? "border-accent bg-accent text-on-accent" : "border-line-strong text-ink"
                          }`}
                          aria-hidden="true"
                        >
                          {added ? <Check size={15} /> : <Plus size={15} />}
                        </span>
                        <span className="sr-only">Add</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <Button variant="secondary" icon={Plus} onClick={() => setPicking(true)}>
              Add dhikr
            </Button>
          )}
        </section>
      </form>
    </Sheet>
  );
};

export default SetEditor;
