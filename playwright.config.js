// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright configuration for the Sauce Demo portfolio project.
 *
 * Docs: https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  // Folder where Playwright looks for test files
  testDir: './tests',

  // Run all tests in parallel by default
  fullyParallel: true,

  // Fail the build on CI if someone accidentally committed `test.only`
  forbidOnly: !!process.env.CI,

  // Retry failed tests on CI only.
  // Locally, a failure is a real failure you should debug.
  retries: process.env.CI ? 2 : 0,

  // How many tests run in parallel.
  // Limited on CI to avoid resource contention.
  workers: process.env.CI ? 2 : undefined,

  // Reporters: how results are displayed
  reporter: [
    ['html', { open: 'never' }],   // generates playwright-report/ folder
    ['list'],                      // pretty console output
  ],

  // Global timeout per test (30 seconds is generous for UI tests)
  timeout: 30 * 1000,

  // How long expect() assertions wait before failing
  expect: {
    timeout: 5 * 1000,
  },

  // Settings that apply to every test
  use: {
    // Base URL — all page.goto() calls are relative to this
    baseURL: 'https://www.saucedemo.com',

    // Capture trace on first retry — critical for debugging flaky CI runs
    trace: 'on-first-retry',

    // Screenshot only when a test fails
    screenshot: 'only-on-failure',

    // Record video only when a test fails
    video: 'retain-on-failure',

    // Consistent viewport for predictable screenshots
    viewport: { width: 1280, height: 720 },

    // How long to wait for navigation (page loads)
    navigationTimeout: 10 * 1000,

    // How long to wait for any single action (click, fill, etc.)
    actionTimeout: 5 * 1000,
  },

  // Projects: run the same tests across multiple browsers
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