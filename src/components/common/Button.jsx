import { forwardRef } from "react";
import { LoaderCircle } from "lucide-react";

const cx = (...parts) => parts.filter(Boolean).join(" ");

/* Button variants map to intent, not to colour:
   primary   the one affirmative action on a surface
   secondary a neutral alternative
   tonal     neutral filled, the second action beside a primary
   ghost     low-emphasis, toolbar-like
   link      inline text action ("Manage", "See all")
   danger    anything destructive, in the trigger and its confirmation alike */
export const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    icon: Icon,
    iconRight: IconRight,
    block = false,
    className = "",
    children,
    disabled,
    type = "button",
    ...props
  },
  ref
) {
  const iconSize = size === "sm" ? 16 : 18;
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx("btn", `btn-${variant}`, `btn-${size}`, block && "w-full", className)}
      {...props}
    >
      {loading ? (
        <LoaderCircle size={iconSize} className="animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon size={iconSize} aria-hidden="true" />
      )}
      {children}
      {IconRight && !loading && <IconRight size={iconSize} aria-hidden="true" />}
    </button>
  );
});

/* Icon-only control. `label` is required: it becomes the accessible name and
   the native tooltip. */
export const IconButton = forwardRef(function IconButton(
  { icon: Icon, label, size = "md", pressed, className = "", iconSize, type = "button", ...props },
  ref
) {
  const dims = size === "sm" ? "h-9 w-9" : size === "lg" ? "h-12 w-12" : "h-11 w-11";
  const glyph = iconSize ?? (size === "sm" ? 17 : size === "lg" ? 22 : 20);
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={cx("icon-btn", dims, className)}
      {...props}
    >
      <Icon size={glyph} aria-hidden="true" />
    </button>
  );
});

export default Button;
