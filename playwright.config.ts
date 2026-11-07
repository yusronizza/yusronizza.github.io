import { defineConfig, devices } from "@playwright/test";

// Smoke tests against a running site + API (see README "Testing"):
//
//   E2E_BASE_URL=http://localhost:3000 npm run test:e2e
//
// The tests only read, except the contact-form check, which submits an
// invalid form (rejected by the API, nothing stored).
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] }, testIgnore: /mobile\.spec\.ts/ },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /mobile\.spec\.ts/ },
  ],
});
