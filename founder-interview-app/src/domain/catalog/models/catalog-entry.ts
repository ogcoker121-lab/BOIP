import { Relationship } from "./relationship";

// The permanent object types the catalog can resolve today. New types
// (Agent, Workflow, Template, Case Study, Business Model, Decision
// Pattern) get added here as they're built - the catalog doesn't grow by
// guessing, only by a domain declaring a new type of thing it owns.
export type CatalogEntryType = "Framework" | "Recommendation" | "Opportunity" | "Rule";

export type CatalogStatus = "Active" | "Deprecated" | "Draft";

// The catalog's own format version - separate from an entry's `version`
// (that object's business version). Bumping this is how the CatalogEntry
// shape itself evolves later (new fields, new relationship types) without
// breaking entries built against an older shape.
export const CATALOG_SCHEMA_VERSION = "1.0";

// The canonical identity record for one permanent BOIP object (FW-xxx,
// REC-xxx, OPP-xxx, RULE-xxx). Domains own behaviour; the catalog owns
// metadata - this is the shape that ownership takes. Built by a
// type-specific builder (builders/) from each domain's own data, never
// hand-maintained per entry.
export interface CatalogEntry {
  id: string;
  type: CatalogEntryType;
  title: string;
  description: string;
  owner: string;
  capability: string;
  version: string;
  status: CatalogStatus;
  relationships: Relationship[];
  schemaVersion: string;
}
