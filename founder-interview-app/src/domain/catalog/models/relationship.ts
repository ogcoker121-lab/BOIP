// Every relationship between permanent BOIP objects is explicit - nothing
// is inferred at query time. USES: a recommendation or opportunity draws
// on a framework. GENERATES: a rule produces a recommendation.
// RECOMMENDS / RECOMMENDED_BY are reserved for when an opportunity <->
// recommendation link becomes a real, declared fact in some domain (see
// relationships/ - none exists yet, so neither type is populated today).
export type RelationshipType = "USES" | "GENERATES" | "RECOMMENDS" | "RECOMMENDED_BY";

export interface Relationship {
  sourceId: string;
  targetId: string;
  type: RelationshipType;
}
