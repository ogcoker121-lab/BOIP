import { CatalogStatus } from "../models/catalog-entry";

// Recommendation already has its own `category` (Customer Discovery,
// Business Model, ...) - that's the catalog capability, sourced directly
// in recommendation-builder.ts rather than duplicated here. owner/
// version/status don't exist on Recommendation today and are uniform
// across every REC-xxx in this initial catalog release, so a single
// shared default is more honest than a 8-row table repeating the same
// three values.
export const recommendationCatalogDefaults: { owner: string; version: string; status: CatalogStatus } = {
  owner: "Recommendation Domain",
  version: "1.0",
  status: "Active",
};
