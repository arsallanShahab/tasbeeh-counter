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
export const DuaSection = () => {
  const { settings } = useApp();
  const now = new Date(useNow(60000));
  const [open, setOpen] = useState(false);
  const asking = (settings.duaList || []).filter((d) => !d.answeredAt);
  const moment = acceptanceWindow(settings.prayer, now);
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
        {moment ? (
          <Panel className="border-[color-mix(in_srgb,var(--gold)_45%,var(--line))] p-5">
            <p className="eyebrow flex items-center gap-2 text-gold">
              <HandHeart size={14} strokeWidth={2} aria-hidden="true" />
              A time of acceptance · until {at(moment.end)}
            </p>
            <p className="mt-2 font-display text-xl leading-snug text-ink">{moment.label}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{moment.desc}</p>
            <Button className="mt-4 w-full sm:w-auto" onClick={() => setOpen(true)}>
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
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-line px-5 py-5 sm:flex-row sm:items-center">
            <p className="flex-1 text-[0.9375rem] leading-relaxed text-muted">
              Keep a list of what you want to ask Allah for, and read through it at the times du'a is answered.
            </p>
            <Button variant="tonal" size="sm" onClick={() => setOpen(true)}>
              Add a du'a
            </Button>
          </div>
        )}
      </section>
      <DuaSheet open={open} onClose={() => setOpen(false)} moment={moment} />
    </>
  );
};

export default DuaSection;
