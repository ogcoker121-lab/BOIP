// The catalog's public surface. Every future consumer (a report
// generator, an AI enrichment step, a Framework Explorer, a knowledge
// graph) imports from here, not from resolver/builders/metadata
// directly - those are the catalog's own internals.
//
// Nothing outside this domain has been changed to consume it yet
// (framework/registry.ts's resolveFramework() and friends are untouched)
// - this release only builds the canonical identity layer itself, per
// spec. Migrating existing call sites is a deliberate later step, not
// this one.
export type { CatalogEntry, CatalogEntryType, CatalogStatus } from "./models/catalog-entry";
export type { Relationship, RelationshipType } from "./models/relationship";
export { resolveCatalogEntry, resolveCatalogEntries } from "./resolver/catalog-resolver";
