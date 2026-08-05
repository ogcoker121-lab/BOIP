import { CatalogStatus } from "../models/catalog-entry";

// Every Opportunity exists for the same catalog reason (it's what the
// Opportunity Matching capability recommends), so capability/owner/
// version/status are uniform defaults rather than a 16-row table
// repeating the same four values per OPP-xxx.
export const opportunityCatalogDefaults: {
  capability: string;
  owner: string;
  version: string;
  status: CatalogStatus;
} = {
  capability: "Opportunity Matching",
  owner: "Opportunity Domain",
  version: "1.0",
  status: "Active",
};
