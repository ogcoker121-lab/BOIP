import { routeWeightRules } from "@/src/domain/route-decision/knowledge/route-weights";
import { customerDiscoveryRecommendations } from "@/src/domain/recommendation/knowledge/customer-discovery";
import { businessModelRecommendations } from "@/src/domain/recommendation/knowledge/business-model";
import { marketValidationRecommendations } from "@/src/domain/recommendation/knowledge/market-validation";
import { pricingRecommendations } from "@/src/domain/recommendation/knowledge/pricing";
import { competitionRecommendations } from "@/src/domain/recommendation/knowledge/competition";
import { mvpRecommendations } from "@/src/domain/recommendation/knowledge/mvp";
import {
  customerValidationStrengths,
  customerValidationWatchItems,
} from "@/src/domain/opportunity/knowledge/customer-validation";
import { pricingWatchItems as opportunityPricingWatchItems } from "@/src/domain/opportunity/knowledge/pricing";
import { CatalogEntry, createCatalogEntry } from "../models/catalog-entry";
import { ruleCatalogMetadataBySource } from "../metadata/rule-metadata";

const RECOMMENDATION_KNOWLEDGE = [
  customerDiscoveryRecommendations,
  businessModelRecommendations,
  marketValidationRecommendations,
  pricingRecommendations,
  competitionRecommendations,
  mvpRecommendations,
];

const OPPORTUNITY_SIGNAL_KNOWLEDGE = [
  customerValidationStrengths,
  customerValidationWatchItems,
  opportunityPricingWatchItems,
];

// A Rule's title/description is the reason it exists - reused verbatim
// from its own `then`, the same "reuse existing reason strings, don't
// invent new ones" rule the v0.6 explanation generator follows. Each
// source shapes `then` differently, so extraction is source-specific:
// route weights carry {reason}, recommendation rules carry a full
// Recommendation (with its own .reason), opportunity-signal rules are
// bare strings.
function routeRuleEntries(): CatalogEntry[] {
  const metadata = ruleCatalogMetadataBySource.route;
  return routeWeightRules.map((rule) => {
    const reason = rule.then[0]?.reason ?? "";
    return createCatalogEntry({
      id: rule.id,
      type: "Rule",
      title: reason,
      description: reason,
      owner: metadata.owner,
      capability: metadata.capability,
      version: metadata.version,
      status: metadata.status,
      relationships: [],
    });
  });
}

function recommendationRuleEntries(): CatalogEntry[] {
  const metadata = ruleCatalogMetadataBySource.recommendation;
  return RECOMMENDATION_KNOWLEDGE.flatMap((rules) =>
    rules.map((rule) => {
      const reason = rule.then[0]?.reason ?? "";
      return createCatalogEntry({
        id: rule.id,
        type: "Rule",
        title: reason,
        description: reason,
        owner: metadata.owner,
        capability: metadata.capability,
        version: metadata.version,
        status: metadata.status,
        relationships: [],
      });
    }),
  );
}

function opportunitySignalRuleEntries(): CatalogEntry[] {
  const metadata = ruleCatalogMetadataBySource.opportunitySignal;
  return OPPORTUNITY_SIGNAL_KNOWLEDGE.flatMap((rules) =>
    rules.map((rule) => {
      const reason = rule.then[0] ?? "";
      return createCatalogEntry({
        id: rule.id,
        type: "Rule",
        title: reason,
        description: reason,
        owner: metadata.owner,
        capability: metadata.capability,
        version: metadata.version,
        status: metadata.status,
        relationships: [],
      });
    }),
  );
}

// Every RULE-xxx that exists (route weights, recommendation knowledge,
// opportunity signals) becomes a catalog entry - same three knowledge
// groups decision-engine.ts already evaluates. Relationships (a
// recommendation rule GENERATES its REC-xxx) come from
// relationships/rule-relationships.ts; route and opportunity-signal
// rules have none today (see that file for why).
export function buildRuleCatalogEntries(): CatalogEntry[] {
  return [...routeRuleEntries(), ...recommendationRuleEntries(), ...opportunitySignalRuleEntries()];
}
