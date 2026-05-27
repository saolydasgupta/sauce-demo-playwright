const { test, expect } = require('@playwright/test');

/**
 * Sauce Demo - Login tests
 *
 * Validates login behaviour for different user types:
 *  - Happy path: a valid user can log in
 *  - Negative: a locked-out user is rejected
 *  - Negative: empty credentials show a validation error
 */
test.describe('Login', () => {

  // Runs before every test in this file
  test.beforeEach(async ({ page }) => {
    // baseURL is set in playwright.config.js, so '/' = homepage
    await page.goto('/');
  });

  test('a standard user can log in successfully', async ({ page }) => {
    // Fill in credentials using data-test attributes (stable locators)
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    // Assertion 1: URL changed to the inventory page
    await expect(page).toHaveURL(/.*inventory.html/);

    // Assertion 2: The Products heading is visible
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('a locked-out user sees an error message', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('locked_out_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    // The error banner should appear with a clear message
    const errorBanner = page.locator('[data-test="error"]');
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText('locked out');
  });

  test('empty credentials show a validation error', async ({ page }) => {
    // Click login without typing anything
    await page.getByRole('button', { name: 'Login' }).click();

    const errorBanner = page.locator('[data-test="error"]');
    await expect(errorBanner).toContainText('Username is required');
  });

});