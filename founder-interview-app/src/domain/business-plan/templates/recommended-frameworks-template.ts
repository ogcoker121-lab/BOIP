// The frameworks themselves are never re-described here - each one links
// to its existing Framework Explorer page (v0.8) through the Knowledge
// Catalog. This template only renders the section's one-line intro.
export function renderRecommendedFrameworksIntro(count: number): string[] {
  return count > 0 ? ["These frameworks support the plan above - use Learn More to see when and how to apply each one."] : [];
}
