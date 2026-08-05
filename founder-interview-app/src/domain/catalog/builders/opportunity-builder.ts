import { opportunityLibrary } from "@/src/domain/opportunity/library/catalog";
import { CatalogEntry, createCatalogEntry } from "../models/catalog-entry";
import { opportunityCatalogDefaults } from "../metadata/opportunity-metadata";

// Reads the Opportunity Library's own catalog (opportunityLibrary) rather
// than maintaining a second copy - the same 16 OPP-xxx entries the
// matching engine scores against. Relationships (USES a framework) come
// from relationships/opportunity-relationships.ts.
export function buildOpportunityCatalogEntries(): CatalogEntry[] {
  return opportunityLibrary.map((opportunity) =>
    createCatalogEntry({
      id: opportunity.id,
      type: "Opportunity",
      title: opportunity.title,
      description: opportunity.description,
      owner: opportunityCatalogDefaults.owner,
      capability: opportunityCatalogDefaults.capability,
      version: opportunityCatalogDefaults.version,
      status: opportunityCatalogDefaults.status,
      relationships: [],
    }),
  );
}
