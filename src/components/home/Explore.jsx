import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { SHELVES } from "../../constants/shelves";
import { SectionHeader } from "../common/Layout";
import { Button } from "../common/Button";
import ShelfArt from "../common/ShelfArt";

/* The Library's shelves, in the same words, as the way into everything not
   on Today. Six tiles that never grow, however large the library gets. */
export const Explore = () => {
  const { setSearchQuery } = useApp();
  const navigate = useNavigate();
  const go = (path) => {
    setSearchQuery("");
    navigate(path);
  };
  return (
    <section aria-labelledby="explore-h" className="space-y-4">
      <SectionHeader
        id="explore-h"
        title="Explore"
        action={
          <Button variant="link" size="sm" onClick={() => go("/library")}>
            Library
          </Button>
        }
      />
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {SHELVES.filter((s) => s.key !== "yours").map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.key} className="min-w-0">
              <button
                type="button"
                onClick={() => go(`/library?shelf=${s.key}`)}
                aria-label={`${s.title}: ${s.desc}`}
                className="row-interactive flex h-full min-h-14 w-full items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-left sm:flex-col sm:items-start sm:justify-between sm:p-4"
              >
                <ShelfArt
                  shelf={s.key}
                  size={36}
                  className="sm:h-12 sm:w-12"
                  fallback={<Icon size={18} strokeWidth={1.75} className="shrink-0 text-accent" aria-hidden="true" />}
                />
                <span className="min-w-0">
                  <span className="block text-[0.9375rem] leading-snug font-medium text-ink sm:font-display sm:text-[1.0625rem] sm:font-normal">{s.title}</span>
                  <span className="mt-0.5 hidden text-[0.8125rem] leading-snug text-muted sm:line-clamp-2">{s.desc}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Explore;
