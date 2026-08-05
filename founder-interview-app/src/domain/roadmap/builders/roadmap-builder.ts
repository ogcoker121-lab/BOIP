import { Recommendation } from "@/src/domain/recommendation";
import { Roadmap } from "../models/roadmap";

// Buckets the recommendation engine's own priority ordering (v0.4) into
// day ranges - Critical/High first, then Medium, then Low. A structural
// translation of an existing enum into a day range, not a new
// prioritization or re-sort; recommendations are never re-scored here.
//
// Originally built inside the Business Plan domain (v0.9); extracted
// out to src/domain/roadmap/ so any future consumer can reuse the same
// roadmap without duplicating this bucketing.
export function buildRoadmap(recommendations: Recommendation[]): Roadmap {
  return {
    buckets: [
      {
        label: "Days 1-30",
        items: recommendations.filter((r) => r.priority === "Critical" || r.priority === "High").map((r) => r.title),
      },
      {
        label: "Days 31-60",
        items: recommendations.filter((r) => r.priority === "Medium").map((r) => r.title),
      },
      {
        label: "Days 61-90",
        items: recommendations.filter((r) => r.priority === "Low").map((r) => r.title),
      },
    ],
  };
}
