import { Recommendation } from "@/src/domain/recommendation/models/recommendation";
import { renderFirst90DayPlan, NinetyDayBucket } from "../templates/first-90-day-template";
import { BusinessPlanSection } from "../models/business-plan";
import { resolveFrameworkReferences } from "./shared";

// Buckets the recommendation engine's own priority ordering (v0.4) into
// day ranges - Critical/High first, then Medium, then Low. A structural
// translation of an existing enum into a day range, not a new
// prioritization; the recommendations themselves are already sorted by
// recommendation-engine.ts, this doesn't re-sort or re-score them.
export function buildFirst90DayPlanSection(recommendations: Recommendation[]): BusinessPlanSection {
  const buckets: NinetyDayBucket[] = [
    {
      label: "Days 1-30",
      items: recommendations.filter((r) => r.priority === "Critical" || r.priority === "High").map((r) => r.title),
    },
    { label: "Days 31-60", items: recommendations.filter((r) => r.priority === "Medium").map((r) => r.title) },
    { label: "Days 61-90", items: recommendations.filter((r) => r.priority === "Low").map((r) => r.title) },
  ];

  const content = renderFirst90DayPlan(buckets);
  const frameworkIds = recommendations.flatMap((recommendation) => recommendation.frameworkReferences);

  return {
    id: "first-90-day-plan",
    title: "First 90-Day Plan",
    content,
    recommendedFrameworks: resolveFrameworkReferences(frameworkIds),
  };
}
