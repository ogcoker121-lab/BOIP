import { frameworkRegistry } from "@/src/domain/framework/registry";
import { CatalogEntry, createCatalogEntry } from "../models/catalog-entry";
import { frameworkCatalogMetadata } from "../metadata/framework-metadata";

// Reads the framework domain's own registry rather than maintaining a
// second copy of framework names/summaries - the catalog builds itself
// from what each domain already knows, per the v0.7 spec. No outgoing
// relationships: nothing in the framework domain today references
// another permanent id from a Framework.
export function buildFrameworkCatalogEntries(): CatalogEntry[] {
  return Object.values(frameworkRegistry).map((framework) => {
    const metadata = frameworkCatalogMetadata[framework.id];
    if (!metadata) {
      throw new Error(`No catalog metadata declared for ${framework.id} - add it to framework-metadata.ts`);
    }
    return createCatalogEntry({
      id: framework.id,
      type: "Framework",
      title: framework.name,
      description: framework.summary,
      owner: metadata.owner,
      capability: metadata.capability,
      version: metadata.version,
      status: metadata.status,
      relationships: [],
    });
  });
}
