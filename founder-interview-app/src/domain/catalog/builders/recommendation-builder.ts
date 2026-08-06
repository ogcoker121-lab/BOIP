import {
  Recommendation,
  customerDiscoveryRecommendations,
  businessModelRecommendations,
  marketValidationRecommendations,
  pricingRecommendations,
  competitionRecommendations,
  mvpRecommendations,
} from "@/src/domain/recommendation";
import { CatalogEntry, createCatalogEntry } from "../models/catalog-entry";
import { recommendationCatalogDefaults } from "../metadata/recommendation-metadata";
import { deriveRecommendationRelationships } from "../relationships/recommendation-relationships";

// The same six knowledge files decision-engine.ts already reads, for the
// same reason: there's no exported flat list of every Recommendation
// elsewhere, and this is the actual set of REC-xxx that exist.
const RECOMMENDATION_KNOWLEDGE = [
  customerDiscoveryRecommendations,
  businessModelRecommendations,
  marketValidationRecommendations,
  pricingRecommendations,
  competitionRecommendations,
  mvpRecommendations,
];

// Exported for relationships/rule-relationships.ts, which needs to map a
// recommendation rule's RULE-xxx to the REC-xxx it generates.
export function allRecommendations(): Recommendation[] {
  return RECOMMENDATION_KNOWLEDGE.flatMap((rules) => rules.flatMap((rule) => rule.then));
}

// Recommendation already has its own category (the catalog capability)
// and title/description - sourced directly rather than duplicated in
// metadata/.
export function buildRecommendationCatalogEntries(): CatalogEntry[] {
  return allRecommendations().map((recommendation) =>
    createCatalogEntry({
      id: recommendation.id,
      type: "Recommendation",
      title: recommendation.title,
      description: recommendation.description,
      owner: recommendationCatalogDefaults.owner,
      capability: recommendation.category,
      version: recommendationCatalogDefaults.version,
      status: recommendationCatalogDefaults.status,
      relationships: deriveRecommendationRelationships(recommendation),
    }),
  );
}
