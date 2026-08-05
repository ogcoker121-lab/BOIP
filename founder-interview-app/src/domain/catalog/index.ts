// The catalog's public surface. Every future consumer (a report
// generator, an AI enrichment step, a Framework Explorer, a knowledge
// graph) imports from here, not from resolver/builders/metadata
// directly - those are the catalog's own internals.
//
// framework/registry.ts's resolveFramework() and friends are untouched -
// this release only builds the canonical identity layer itself, per
// spec. The Framework Explorer (v0.8) is the first real consumer:
// src/domain/framework-explorer/ resolves everything it shows through
// this file, never by reaching into resolver/builders/metadata or
// another domain directly.
export type { CatalogEntry, CatalogEntryType, CatalogStatus } from "./models/catalog-entry";
export type { Relationship, RelationshipType } from "./models/relationship";
export {
  resolveCatalogEntry,
  resolveCatalogEntries,
  resolveRelationshipsTargeting,
} from "./resolver/catalog-resolver";
