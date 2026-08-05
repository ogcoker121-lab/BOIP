import { Recommendation } from "@/src/domain/recommendation/models/recommendation";
import { buildRoadmap } from "@/src/domain/roadmap/builders/roadmap-builder";
import { renderFirst90DayPlan } from "../templates/first-90-day-template";
import { BusinessPlanSection } from "../models/business-plan";
import { resolveFrameworkReferences } from "./shared";

// Bucketing itself lives in src/domain/roadmap/ (extracted so Founder
// Report, an Executive Dashboard, the mobile app, or a future AI Coach
// can reuse the same roadmap) - this section only renders it and adds
// its own framework references.
export function buildFirst90DayActionPlanSection(recommendations: Recommendation[]): BusinessPlanSection {
  const roadmap = buildRoadmap(recommendations);
  const content = renderFirst90DayPlan(roadmap);
  const frameworkIds = recommendations.flatMap((recommendation) => recommendation.frameworkReferences);

  return {
    id: "first-90-day-action-plan",
    title: "First 90-Day Action Plan",
    content,
    recommendedFrameworks: resolveFrameworkReferences(frameworkIds),
  };
}
