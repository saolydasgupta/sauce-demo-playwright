// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright configuration for the Sauce Demo portfolio project.
 *
 * Docs: https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if `test.only` was committed by mistake
  forbidOnly: !!process.env.CI,

  // Retries: 2 on CI, 1 locally (handles transient network blips)
  retries: process.env.CI ? 2 : 1,

  // Workers: limit parallelism so we don't overwhelm slow networks.
  // 4 locally, 2 on CI.
  workers: process.env.CI ? 2 : 4,

  // Reporters: HTML for browsing, list for terminal
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  // Generous global timeout per test
  timeout: 60 * 1000,

  // How long expect() assertions wait before failing
  expect: {
    timeout: 10 * 1000,
  },

  // Settings that apply to every test
  use: {
    baseURL: 'https://www.saucedemo.com',

    // Capture a full trace on first retry — gold for debugging
    trace: 'on-first-retry',

    // Screenshot and video only on failure (saves disk space)
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Consistent viewport for predictable rendering
    viewport: { width: 1280, height: 720 },

    // More generous timeouts for slower networks
    navigationTimeout: 30 * 1000,
    actionTimeout: 15 * 1000,
  },

  // Run the same tests across multiple browsers
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
  ],
});