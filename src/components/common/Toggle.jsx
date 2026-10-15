/* Switch. Off is an outlined track with a 3:1 border so the control is
   visible without relying on colour; on fills with the accent. */
export const Toggle = ({ on, onClick, label, labelledBy, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={!!on}
    aria-label={labelledBy ? undefined : label}
    aria-labelledby={labelledBy}
    disabled={disabled}
    onClick={onClick}
    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors duration-200 disabled:opacity-50 ${
      on ? "border-accent bg-accent" : "border-line-strong bg-surface"
    }`}
  >
    <span
      aria-hidden="true"
      className={`absolute h-5 w-5 rounded-full transition-transform duration-200 ease-out ${
        on ? "translate-x-[1.375rem] bg-on-accent" : "translate-x-[0.1875rem] bg-muted"
      }`}
    />
  </button>
);

export default Toggle;
