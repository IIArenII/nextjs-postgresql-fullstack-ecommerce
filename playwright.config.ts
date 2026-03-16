import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load test credentials from .env.test
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,  // Run tests sequentially to avoid DB conflicts
  timeout: 30_000,       // 30 seconds per test
  retries: 1,            // Retry once on failure

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,  // Reuse if already running
    timeout: 120_000,
  },

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',  // Record trace only when retrying
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* Test against mobile viewports. */
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
