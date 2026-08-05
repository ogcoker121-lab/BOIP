// A related framework or a "used by" reference - just enough to link and
// label, never a second copy of the full CatalogEntry.
export interface FrameworkPageReference {
  id: string;
  title: string;
}

// Everything one Framework Explorer page needs, resolved deterministically
// from the Knowledge Catalog plus this domain's own knowledge/ (see
// framework-guidance.ts) - no AI, nothing invented, nothing duplicated
// from the catalog's own title/description.
export interface FrameworkPage {
  id: string;
  title: string;
  whatItIs: string;
  whyRecommended: string;
  whenToUse: string;
  expectedOutcome: string;
  commonMistakes: string[];
  relatedFrameworks: FrameworkPageReference[];
  nextRecommendedFramework: FrameworkPageReference | null;

  // Capability navigation - exposes relationships the catalog already
  // holds, not a new engine (see resolver/framework-explorer-resolver.ts
  // for exactly which catalog relationships each field reads).
  capability: string;
  relatedCapability: string | null;
  usedBy: FrameworkPageReference[];
  leadsTo: string | null;
}
