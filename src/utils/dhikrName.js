// A dhikr's name in lists: its opening phrase, ended at the first natural pause.
export function shortTr(d) {
  const t = (d?.tr || "").trim();
  const cut = t.search(/[,;:.—]/);
  return cut >= 12 ? t.slice(0, cut).trim() : t;
}
