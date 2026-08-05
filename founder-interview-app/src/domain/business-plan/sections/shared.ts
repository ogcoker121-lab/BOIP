import { resolveCatalogEntries } from "@/src/domain/catalog";
import { BusinessPlanFrameworkReference } from "../models/business-plan";

// Every section resolves its framework references through the Knowledge
// Catalog (v0.7), never by reaching into framework/registry.ts or any
// other domain directly - the same rule the Framework Explorer (v0.8)
// follows.
export function resolveFrameworkReferences(ids: string[]): BusinessPlanFrameworkReference[] {
  const uniqueIds = Array.from(new Set(ids));
  return resolveCatalogEntries(uniqueIds)
    .filter((entry) => entry.type === "Framework")
    .map((entry) => ({ id: entry.id, title: entry.title }))
    .sort((a, b) => a.id.localeCompare(b.id));
}
