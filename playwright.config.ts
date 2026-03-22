import 'dotenv/config';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'public',
      testIgnore: /admin-.*\.spec\.ts/,
    },
    {
      name: 'admin',
      testMatch: /admin-.*\.spec\.ts/,
    },
  ],
  webServer: {
    command: 'pnpm preview',
    url: 'http://localhost:4321',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
