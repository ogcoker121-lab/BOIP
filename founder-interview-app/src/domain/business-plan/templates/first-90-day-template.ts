// Buckets are assembled by sections/first-90-day-plan-section.ts from
// the recommendation engine's own priority ordering (recommendation
// domain, v0.4) - this template only renders whatever buckets it's
// given, it doesn't decide what goes in them.
export interface NinetyDayBucket {
  label: string;
  items: string[];
}

export function renderFirst90DayPlan(buckets: NinetyDayBucket[]): string[] {
  return buckets
    .filter((bucket) => bucket.items.length > 0)
    .flatMap((bucket) => [`${bucket.label}:`, ...bucket.items.map((item) => `- ${item}`)]);
}
