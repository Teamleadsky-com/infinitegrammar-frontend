import { defineConfig } from "@playwright/test";

// Minimal local-only Playwright config for the Stage 3A1 browser proof-of-life
// harness. Starts the Vite dev server (matches vite.config.ts host/port) and
// runs against it; never targets a production or Deploy Preview URL.
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:8080",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:8080",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
