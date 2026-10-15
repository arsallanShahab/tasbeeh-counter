import { cloneElement, isValidElement, useId } from "react";
import { CircleAlert, Minus, Plus } from "lucide-react";

/* Label + control + hint + error. The control receives id, aria-describedby
   and aria-invalid automatically so every input is announced properly. */
export const Field = ({ label, hint, error, optional, children, className = "" }) => {
  const id = useId();
  const hintId = `${id}-hint`;
  const errId = `${id}-err`;
  const describedBy = [hint && hintId, error && errId].filter(Boolean).join(" ") || undefined;

  const control = isValidElement(children)
    ? cloneElement(children, {
        id: children.props.id || id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? "true" : undefined,
      })
    : children;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={children?.props?.id || id} className="flex items-baseline justify-between text-sm font-medium text-ink">
          {label}
          {optional && <span className="text-[0.8125rem] font-normal text-muted">Optional</span>}
        </label>
      )}
      {control}
      {hint && !error && (
        <p id={hintId} className="text-[0.8125rem] leading-snug text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} className="flex items-start gap-1.5 text-[0.8125rem] leading-snug text-danger">
          <CircleAlert size={15} className="mt-px shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
};

export const TextInput = ({ className = "", ...props }) => (
  <input className={`field-input ${className}`} {...props} />
);

export const Select = ({ className = "", children, ...props }) => (
  <select className={`field-input cursor-pointer ${className}`} {...props}>
    {children}
  </select>
);

/* Small minus / plus stepper for offsets and counts. */
export const Stepper = ({ value, onDec, onInc, min, max, display, label }) => (
  <div className="flex items-center gap-1" role="group" aria-label={label}>
    <button
      type="button"
      onClick={onDec}
      disabled={min != null && value <= min}
      className="icon-btn h-9 w-9 border border-line-strong"
      aria-label={`Decrease${label ? ` ${label}` : ""}`}
    >
      <Minus size={15} aria-hidden="true" />
    </button>
    <span className="numerals w-16 text-center text-sm font-medium text-ink" aria-live="polite">
      {display}
    </span>
    <button
      type="button"
      onClick={onInc}
      disabled={max != null && value >= max}
      className="icon-btn h-9 w-9 border border-line-strong"
      aria-label={`Increase${label ? ` ${label}` : ""}`}
    >
      <Plus size={15} aria-hidden="true" />
    </button>
  </div>
);

export default Field;
