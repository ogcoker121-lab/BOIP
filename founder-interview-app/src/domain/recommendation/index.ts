// The public surface of src/domain/recommendation/.
export type {
  Recommendation,
  RecommendationCategory,
  RecommendationPriority,
  RecommendationEffort,
  RecommendationImpact,
} from "./models/recommendation";
export { buildRecommendations } from "./mapper/recommendation-mapper";

// Raw knowledge - intentionally exposed here for domains that trace or
// catalog evaluation itself (decision/, catalog/), not for recomputing
// recommendations a second time. Everyone else should use
// buildRecommendations().
export { customerDiscoveryRecommendations } from "./knowledge/customer-discovery";
export { businessModelRecommendations } from "./knowledge/business-model";
export { marketValidationRecommendations } from "./knowledge/market-validation";
export { pricingRecommendations } from "./knowledge/pricing";
export { competitionRecommendations } from "./knowledge/competition";
export { mvpRecommendations } from "./knowledge/mvp";
