import { existsSync } from "fs";
import { defineConfig, devices } from "@playwright/test";

// Some sandboxed environments (this one included) pre-install a Chromium
// build under a fixed path instead of letting Playwright download its own
// pinned revision. When that path exists, use it rather than requiring a
// network fetch; everywhere else (a normal dev machine, standard CI) this
// is a no-op and Playwright resolves its browser the usual way.
const preinstalledChromium = "/opt/pw-browsers/chromium";

// Integration/E2E: the founder workflow this suite exercises is
// Landing -> Interview -> Opportunity Snapshot -> Recommendations ->
// Framework Explorer -> Business Plan - the same path verified manually
// every release so far, now committed and repeatable.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    ...(existsSync(preinstalledChromium) ? { launchOptions: { executablePath: preinstalledChromium } } : {}),
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
