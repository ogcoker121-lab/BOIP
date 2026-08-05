// A time-bucketed view of recommended actions - not specific to the
// Business Plan. Any consumer that needs "what to do, in what order,
// over what timeframe" (Founder Report, an Executive Dashboard, the
// mobile app, a future AI Coach) reuses this instead of rebuilding its
// own bucketing.
export interface RoadmapBucket {
  label: string;
  items: string[];
}

export interface Roadmap {
  buckets: RoadmapBucket[];
}
