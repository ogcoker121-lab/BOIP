import { Roadmap } from "@/src/domain/roadmap";

// Renders whatever roadmap it's given - bucketing is the roadmap
// domain's job (src/domain/roadmap/), not this template's. Business
// Plan consumes a Roadmap, it doesn't build one.
export function renderFirst90DayPlan(roadmap: Roadmap): string[] {
  return roadmap.buckets
    .filter((bucket) => bucket.items.length > 0)
    .flatMap((bucket) => [`${bucket.label}:`, ...bucket.items.map((item) => `- ${item}`)]);
}
