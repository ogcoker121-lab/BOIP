import { CatalogEntry } from "../models/catalog-entry";
import { Relationship } from "../models/relationship";
import { buildFrameworkCatalogEntries } from "../builders/framework-builder";
import { buildRecommendationCatalogEntries } from "../builders/recommendation-builder";
import { buildOpportunityCatalogEntries } from "../builders/opportunity-builder";
import { buildRuleCatalogEntries } from "../builders/rule-builder";

// No domain should look up another domain directly - everything goes
// through the catalog. Built once (builders are pure, read static
// knowledge - nothing to recompute per lookup), kept module-private:
// resolveCatalogEntry()/resolveCatalogEntries() are the only way in, by
// design. This is identity resolution, not search - it answers "what is
// FW-011", not "which frameworks match X" (out of scope this release).
let catalog: CatalogEntry[] | null = null;

function getCatalog(): CatalogEntry[] {
  if (!catalog) {
    catalog = [
      ...buildFrameworkCatalogEntries(),
      ...buildRecommendationCatalogEntries(),
      ...buildOpportunityCatalogEntries(),
      ...buildRuleCatalogEntries(),
    ];
  }
  return catalog;
}

export function resolveCatalogEntry(id: string): CatalogEntry | null {
  return getCatalog().find((entry) => entry.id === id) ?? null;
}

export function resolveCatalogEntries(ids: string[]): CatalogEntry[] {
  return ids.map(resolveCatalogEntry).filter((entry): entry is CatalogEntry => entry !== null);
}

// The one reverse lookup the catalog exposes: which relationships point
// AT this id (e.g. every REC-xxx/OPP-xxx that USES a given FW-xxx).
// Still flat id-based filtering, not traversal or a graph engine - a
// consumer that wants a related framework's own relationships still
// calls resolveCatalogEntry() again for that id, one hop at a time.
export function resolveRelationshipsTargeting(targetId: string): Relationship[] {
  return getCatalog()
    .flatMap((entry) => entry.relationships)
    .filter((relationship) => relationship.targetId === targetId);
}
