import { defineConfig } from "@playwright/test";

const port = 3107;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${port}`,
    permissions: ["clipboard-read", "clipboard-write"],
    launchOptions: process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : undefined,
  },
  webServer: {
    command: `pnpm build && pnpm start -p ${port}`,
    port,
    timeout: 240_000,
    reuseExistingServer: true,
    env: { MOLDES_TOKEN: process.env.MOLDES_TOKEN ?? "e2e-local-token", INSECURE_COOKIE: "1" },
  },
});
