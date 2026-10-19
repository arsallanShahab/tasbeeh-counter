import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Pin } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { shelfOfItem } from "../../constants/shelves";
import ShelfArt from "../common/ShelfArt";
import { fmt } from "../../utils/stats";
import { shortTr } from "../../utils/dhikrName";
import { ListGroup, ListRow, SectionHeader } from "../common/Layout";
import { Button } from "../common/Button";
import Seg from "../common/Seg";

const PEEK = 7; // rows on Today; everything else is one tap away in the Library
const setTotal = (l) => l.steps.reduce((a, s) => a + (Number(s.target) || 0), 0);

/* Your shortcuts on Today: what you pinned, or what you finish most. Today
   only ever shows a few; the full, searchable, reorderable list lives in
   the Library under Yours. */
export const YourDhikr = () => {
  const { pinned, lists, dhikrs, stats, startList, startDhikr } = useApp();
  const navigate = useNavigate();

  const find = (id) => {
    const l = lists.find((x) => x.id === id);
    if (l) return { type: "list", data: l };
    const d = dhikrs.find((x) => x.id === id);
    return d ? { type: "dhikr", data: d } : null;
  };
  const pins = pinned.map(find).filter(Boolean);
  const done = stats.completed || {};
  const most = Object.entries(done)
    .filter(([, v]) => v?.n > 0)
    .sort((a, b) => b[1].n - a[1].n || (b[1].last || 0) - (a[1].last || 0))
    .map(([id, v]) => ({ ...find(id), n: v.n }))
    .filter((x) => x.data);

  const [view, setView] = useState(pins.length || !most.length ? "pinned" : "most");
  const items = view === "pinned" ? pins : most;
  const more = items.length - PEEK;

  const row = ({ type, data, n }) => {
    const isList = type === "list";
    const name = isList ? data.name : shortTr(data);
    // A set says how many dhikrs it holds; a single dhikr needs no second line.
    const steps = isList ? data.steps.length : 0;
    const sub = !isList ? undefined : steps === 0 ? "No dhikr yet" : `${steps} ${steps === 1 ? "dhikr" : "dhikrs"}`;
    return (
      <ListRow
        key={data.id}
        leading={<ShelfArt shelf={shelfOfItem(type, data)} size={40} />}
        title={name}
        subtitle={view === "most" ? `Completed ${fmt(n)} ${n === 1 ? "time" : "times"}` : sub}
        meta={`×${fmt(isList ? setTotal(data) : data.target)}`}
        onClick={() => (isList ? startList(data) : startDhikr(data))}
        ariaLabel={`Begin ${name}`}
      />
    );
  };

  return (
    <section aria-labelledby="yours-h" className="space-y-4">
      <SectionHeader
        id="yours-h"
        title="Your dhikr"
        action={
          <Button variant="link" size="sm" onClick={() => navigate("/library?shelf=yours")}>
            Manage
          </Button>
        }
      />
      {(pins.length > 0 || most.length > 0) && (
        <Seg
          label="Show"
          size="sm"
          value={view}
          onChange={setView}
          options={[
            { v: "pinned", l: `Pinned${pins.length ? ` · ${pins.length}` : ""}` },
            { v: "most", l: "Most recited" },
          ]}
        />
      )}
      {items.length === 0 ? (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-line px-5 py-5 sm:flex-row sm:items-center">
          <Pin size={18} className="hidden shrink-0 text-muted sm:block" aria-hidden="true" />
          <p className="flex-1 text-[0.9375rem] leading-relaxed text-muted">
            {view === "pinned"
              ? "Pin the sets you recite every day, with the pin on any row in the Library, and they wait for you here."
              : "Finish a set and it appears here, ranked by how often you complete it."}
          </p>
          {view === "pinned" && (
            <Button variant="tonal" size="sm" onClick={() => navigate("/library?shelf=routine")}>
              Browse the routine
            </Button>
          )}
        </div>
      ) : (
        <ListGroup>
          {items.slice(0, PEEK).map(row)}
          {more > 0 && (
            <button
              type="button"
              onClick={() => navigate("/library?shelf=yours")}
              className="row-interactive flex min-h-12 w-full items-center justify-center gap-1.5 px-4 text-sm font-medium text-accent"
            >
              See all {fmt(items.length)} in the Library
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          )}
        </ListGroup>
      )}
    </section>
  );
};

export default YourDhikr;
