// watchList is reused verbatim from the Opportunity Snapshot (v0.3);
// mainLimitation, when present, comes straight from the matched
// Opportunity Library entry (v0.5). Nothing here is a new risk assessment
// - it's the same watch-list/limitation knowledge already surfaced
// elsewhere, gathered into one section.
export function renderRisks(watchList: string[], mainLimitation?: string): string[] {
  const items = [...watchList];
  if (mainLimitation) items.push(mainLimitation);
  return items;
}
