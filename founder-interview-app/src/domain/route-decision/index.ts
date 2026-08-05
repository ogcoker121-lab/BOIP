// The public surface of src/domain/route-decision/.
export type {
  RouteContext,
  PreferredPath,
  RiskBand,
  UrgencyBand,
  CapitalBand,
  TimeBand,
  ReadinessBand,
  EmploymentStatus,
} from "./models/route-context";
export { buildRouteContext, parseSkills } from "./models/route-context";
export { decideRoute } from "./engine/route-decision-engine";
export type { RouteDecision } from "./mapper/route-decision-mapper";
export { buildRouteDecision } from "./mapper/route-decision-mapper";
export type { NextMove, OpportunityDiscoveryResult } from "./mapper/next-move-mapper";
export { buildOpportunityDiscovery } from "./mapper/next-move-mapper";

// Raw knowledge - intentionally exposed here for domains that trace or
// catalog evaluation itself (decision/, catalog/), not for recomputing a
// route a second time. Everyone else should use
// decideRoute()/buildOpportunityDiscovery().
export type { RouteWeightContribution } from "./knowledge/route-weights";
export { routeWeightRules } from "./knowledge/route-weights";
