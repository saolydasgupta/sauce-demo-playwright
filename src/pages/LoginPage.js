const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../src/pages/LoginPage');

/**
 * Sauce Demo - Login tests
 *
 * Demonstrates the Page Object Model:
 *   - Tests describe WHAT they do (intent)
 *   - LoginPage describes HOW it's done (implementation)
 */
test.describe('Login', () => {

  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test('a standard user can log in successfully', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('a locked-out user sees an error message', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('empty credentials show a validation error', async () => {
    await loginPage.clickLogin();

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

});