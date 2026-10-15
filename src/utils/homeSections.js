import { HOME_SECTIONS, DEFAULT_HOME_SECTIONS } from "../constants/dhikrData";

// Saved layout plus any newer sections, each slotted in after its default neighbour.
export const resolveHomeSections = (saved) => {
  const stored = (Array.isArray(saved) && saved.length ? saved : DEFAULT_HOME_SECTIONS).filter((s) => HOME_SECTIONS[s.key]);
  return DEFAULT_HOME_SECTIONS.reduce((acc, def, i) => {
    if (acc.some((s) => s.key === def.key)) return acc;
    const after = acc.findIndex((s) => s.key === DEFAULT_HOME_SECTIONS[i - 1]?.key);
    return [...acc.slice(0, after + 1), { ...def }, ...acc.slice(after + 1)];
  }, stored);
};
