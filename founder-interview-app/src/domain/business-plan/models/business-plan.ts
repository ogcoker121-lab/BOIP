import { NextMoveType } from "@/src/domain/shared/next-move-type";

// A framework a section points at - id + title only, resolved through
// the Knowledge Catalog. Never a second copy of framework guidance;
// "Learn More" always links to the existing Framework Explorer
// (app/frameworks/[id]/), never re-renders its content here.
export interface BusinessPlanFrameworkReference {
  id: string;
  title: string;
}

// Canonical section ids/titles - use exactly these everywhere a section
// is created or referenced.
export type BusinessPlanSectionId =
  | "executive-summary"
  | "business-opportunity"
  | "target-customer"
  | "revenue-model"
  | "go-to-market-strategy"
  | "first-90-day-action-plan"
  | "key-risks"
  | "recommended-frameworks";

// Every section is its own object - content is a list of already-rendered
// sentences/items (paragraphs for narrative sections, bullet items for
// list-shaped ones), assembled by templates/ from structured knowledge.
// No component ever holds a hard-coded paragraph; if a section has
// nothing to say, content is empty and the UI skips it.
export interface BusinessPlanSection {
  id: BusinessPlanSectionId;
  title: string;
  content: string[];
  recommendedFrameworks: BusinessPlanFrameworkReference[];
}

export interface BusinessPlanMetadata {
  generatedAt: string;
  route: NextMoveType;
  opportunityId: string | null;
  // The Decision this plan was assembled from - traceability back to
  // signals/evaluations/rules, same runtime id decision-mapper.ts mints.
  decisionId: string;
}

// The top-level object this domain produces. Not persisted, not part of
// the permanent ontology (id is a runtime BP-xxx, same convention as
// Decision's DEC-xxx) - a founder's plan is recomputed fresh from the
// same deterministic inputs, never hand-edited or migrated.
export interface BusinessPlan {
  id: string;
  title: string;
  sections: BusinessPlanSection[];
  metadata: BusinessPlanMetadata;
}
