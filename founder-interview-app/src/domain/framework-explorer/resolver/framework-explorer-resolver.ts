import {
  resolveCatalogEntry,
  resolveCatalogEntries,
  resolveRelationshipsTargeting,
} from "@/src/domain/catalog";
import { frameworkGuidance } from "../knowledge/framework-guidance";
import { FrameworkPage, FrameworkPageReference } from "../models/framework-page";

function toReference(id: string): FrameworkPageReference | null {
  const entry = resolveCatalogEntry(id);
  return entry ? { id: entry.id, title: entry.title } : null;
}

function toReferences(ids: string[]): FrameworkPageReference[] {
  return resolveCatalogEntries(ids)
    .map((entry) => ({ id: entry.id, title: entry.title }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

// Every entry (Recommendation or Opportunity) whose declared USES
// relationship targets this framework - the catalog's own reverse
// lookup, not a scan this domain does itself.
function entriesUsing(frameworkId: string) {
  const sourceIds = resolveRelationshipsTargeting(frameworkId)
    .filter((relationship) => relationship.type === "USES")
    .map((relationship) => relationship.sourceId);
  return resolveCatalogEntries(sourceIds);
}

// "Why BOIP recommended it" is built entirely from the Recommendations
// that actually reference this framework - their own catalog title and
// description, reused verbatim (the same "reuse existing text, don't
// invent new explanations" rule the v0.6 explanation generator follows).
// The catalog's Recommendation entries don't carry the original
// Recommendation.reason field (out of CatalogEntry's shape), so this
// reads what the catalog does expose rather than reaching around it.
function deriveWhyRecommended(frameworkId: string): string {
  const recommendations = entriesUsing(frameworkId).filter((entry) => entry.type === "Recommendation");
  if (recommendations.length === 0) return "";
  return recommendations.map((recommendation) => `${recommendation.title}: ${recommendation.description}`).join(" ");
}

// Two frameworks are "related" if some Recommendation or Opportunity
// references both - a real, already-declared fact (each one's own USES
// relationships), not a guess based on names or categories.
function deriveRelatedFrameworkIds(frameworkId: string): string[] {
  const referencingEntries = entriesUsing(frameworkId);
  const coReferencedIds = referencingEntries.flatMap((entry) =>
    entry.relationships.filter((relationship) => relationship.type === "USES" && relationship.targetId !== frameworkId).map((relationship) => relationship.targetId),
  );
  return Array.from(new Set(coReferencedIds)).sort();
}

// Resolves everything one Framework Explorer page needs, exclusively
// through the Knowledge Catalog (resolveCatalogEntry/resolveCatalogEntries/
// resolveRelationshipsTargeting) plus this domain's own framework
// guidance knowledge. No direct cross-domain lookups - the recommendation,
// opportunity, and rule domains are never imported here.
export function resolveFrameworkPage(id: string): FrameworkPage | null {
  const entry = resolveCatalogEntry(id);
  if (!entry || entry.type !== "Framework") return null;

  const guidance = frameworkGuidance[id];

  const relatedFrameworkIds = deriveRelatedFrameworkIds(id);
  const relatedFrameworks = toReferences(relatedFrameworkIds);
  const nextRecommendedFramework = relatedFrameworkIds.length > 0 ? toReference(relatedFrameworkIds[0]) : null;

  const usedByEntries = entriesUsing(id).sort((a, b) => a.id.localeCompare(b.id));
  const usedBy: FrameworkPageReference[] = usedByEntries.map((usedByEntry) => ({
    id: usedByEntry.id,
    title: usedByEntry.title,
  }));

  const relatedCapability = nextRecommendedFramework
    ? (resolveCatalogEntry(nextRecommendedFramework.id)?.capability ?? null)
    : null;
  const leadsTo = usedByEntries.length > 0 ? usedByEntries[0].capability : null;

  return {
    id: entry.id,
    title: entry.title,
    whatItIs: entry.description,
    whyRecommended: deriveWhyRecommended(id),
    whenToUse: guidance?.whenToUse ?? "",
    expectedOutcome: guidance?.expectedOutcome ?? "",
    commonMistakes: guidance?.commonMistakes ?? [],
    relatedFrameworks,
    nextRecommendedFramework,
    capability: entry.capability,
    relatedCapability: relatedCapability && relatedCapability !== entry.capability ? relatedCapability : null,
    usedBy,
    leadsTo,
  };
}
