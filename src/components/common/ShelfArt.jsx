/* Illustrated icons from the app's icon set (assets/icons). Each comes in a
   light and a dark drawing; CSS shows the one for the theme it sits in (see
   .set-icon in index.css), so only that file is fetched. Decorative: the text
   beside it names it. By default the drawing sits small on a soft tile, so it
   weighs the same as the line icons around it. */
export const SetIcon = ({ name, size = 48, tile = true, className = "" }) => {
  const art = { "--set-light": `url(/icons/set/${name}.svg)`, "--set-dark": `url(/icons/set/${name}-dark.svg)` };
  if (!tile)
    return <span aria-hidden="true" className={`set-icon inline-block h-(--set-size) w-(--set-size) shrink-0 ${className}`} style={{ ...art, "--set-size": `${size}px` }} />;
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-(--set-size) w-(--set-size) shrink-0 items-center justify-center rounded-[30%] bg-[color-mix(in_srgb,var(--primary)_11%,var(--surface))] ${className}`}
      style={{ "--set-size": `${size}px` }}
    >
      <span className="set-icon size-[62%]" style={art} />
    </span>
  );
};

// The icon for each Library shelf.
const SHELF_ICONS = {
  yours: "tasbeeh",
  routine: "daily-routine",
  moments: "life",
  heart: "patience",
  seasons: "occasions",
  names: "faith",
  more: "dua",
};

// `fallback` renders for shelves that have no icon yet.
export const ShelfArt = ({ shelf, size = 48, className = "", fallback = null }) =>
  SHELF_ICONS[shelf] ? <SetIcon name={SHELF_ICONS[shelf]} size={size} className={className} /> : fallback;

export default ShelfArt;
