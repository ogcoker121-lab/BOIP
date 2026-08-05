import { CatalogStatus } from "../models/catalog-entry";

export interface FrameworkCatalogMetadata {
  capability: string;
  owner: string;
  version: string;
  status: CatalogStatus;
}

// Frameworks don't carry a "capability" concept of their own (unlike
// Recommendation, which already has `category`) - this is genuinely new
// catalog-only metadata, so it's hand-declared here rather than derived.
// Keyed by FW-xxx so a missing entry fails loudly (framework-builder.ts
// throws) instead of silently shipping an incomplete catalog entry.
export const frameworkCatalogMetadata: Record<string, FrameworkCatalogMetadata> = {
  "FW-001": { capability: "Product Validation", owner: "Framework Domain", version: "1.0", status: "Active" },
  "FW-002": { capability: "Idea Generation", owner: "Framework Domain", version: "1.0", status: "Active" },
  "FW-003": { capability: "Problem Definition", owner: "Framework Domain", version: "1.0", status: "Active" },
  "FW-004": { capability: "Market Validation", owner: "Framework Domain", version: "1.0", status: "Active" },
  "FW-005": { capability: "Customer Discovery", owner: "Framework Domain", version: "1.0", status: "Active" },
  "FW-007": { capability: "Competitive Analysis", owner: "Framework Domain", version: "1.0", status: "Active" },
  "FW-011": { capability: "Business Design", owner: "Framework Domain", version: "1.0", status: "Active" },
  "FW-013": { capability: "Pricing", owner: "Framework Domain", version: "1.0", status: "Active" },
  "FW-021": { capability: "Product Development", owner: "Framework Domain", version: "1.0", status: "Active" },
};
