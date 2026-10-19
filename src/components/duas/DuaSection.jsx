import { useState } from "react";
import { HandHeart } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useNow } from "../../hooks/useNow";
import { acceptanceWindow, nextAcceptance } from "../../utils/duaTimes";
import { fmtTime } from "../../utils/prayerTimes";
import { ListGroup, Panel, SectionHeader } from "../common/Layout";
import { Button } from "../common/Button";
import DuaSheet from "./DuaSheet";

/* Today's du'a list. During a time when du'a is answered it says so and
   leads with "Make du'a"; otherwise it previews the list and the next time. */
export const DuaSection = ({ quietMoment = false }) => {
  const { settings } = useApp();
  const now = new Date(useNow(60000));
  const [open, setOpen] = useState(false);
  const asking = (settings.duaList || []).filter((d) => !d.answeredAt);
  const moment = acceptanceWindow(settings.prayer, now);
  const showMoment = moment && !quietMoment;
  const next = moment ? null : nextAcceptance(settings.prayer, now);
  const at = (d) => fmtTime(d, settings.prayer?.hour12 ?? true);

  return (
    <>
      <section aria-labelledby="duas-h" className="space-y-4">
        <SectionHeader
          id="duas-h"
          title="Your du'a list"
          count={asking.length || null}
          action={
            <Button variant="link" size="sm" onClick={() => setOpen(true)}>
              {asking.length ? "Open" : "Add"}
            </Button>
          }
        />
        {showMoment ? (
          <Panel className="flex items-center gap-4 border-[color-mix(in_srgb,var(--gold)_45%,var(--line))] p-4">
            <div className="min-w-0 flex-1">
              <p className="eyebrow flex items-center gap-2 text-gold">
                <HandHeart size={14} strokeWidth={2} className="shrink-0" aria-hidden="true" />
                Until {at(moment.end)}
              </p>
              <p className="mt-1 text-[0.9375rem] font-medium leading-snug text-ink">{moment.label}</p>
            </div>
            <Button size="sm" className="shrink-0" onClick={() => setOpen(true)}>
              Make du'a
            </Button>
          </Panel>
        ) : asking.length > 0 ? (
          <ListGroup>
            {asking.slice(0, 3).map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setOpen(true)}
                className="row-interactive block w-full px-4 py-3 text-left text-[0.9375rem] text-ink"
              >
                <span className="line-clamp-1 [overflow-wrap:anywhere]">{d.text}</span>
              </button>
            ))}
            {next && (
              <p className="px-4 py-3 text-[0.8125rem] text-muted">
                Next time of acceptance: {next.label.charAt(0).toLowerCase() + next.label.slice(1)}, {at(next.start)}
              </p>
            )}
          </ListGroup>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="row-interactive flex min-h-14 w-full items-center gap-3 rounded-2xl border border-dashed border-line px-4 py-3 text-left"
          >
            <HandHeart size={18} strokeWidth={1.75} className="shrink-0 text-accent" aria-hidden="true" />
            <span className="min-w-0 flex-1 text-[0.9375rem] leading-snug text-muted">Keep a list of what you want to ask Allah for.</span>
            <span className="shrink-0 text-sm font-medium text-accent">Add</span>
          </button>
        )}
      </section>
      <DuaSheet open={open} onClose={() => setOpen(false)} moment={moment} />
    </>
  );
};

export default DuaSection;
