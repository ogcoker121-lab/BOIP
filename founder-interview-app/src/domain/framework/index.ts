// The public surface of src/domain/framework/ - a founder never sees a
// raw FW-xxx, only what this resolves it to.
export type { Framework } from "./registry";
export { frameworkRegistry, resolveFramework, resolveFrameworks } from "./registry";
