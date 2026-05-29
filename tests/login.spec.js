const { test, expect } = require('../src/fixtures/pages.fixture');

/**
 * Sauce Demo - Login tests
 *
 * Uses the `loginPage` fixture, which lands us on the login screen
 * (not logged in). Each test drives login itself to verify the flow.
 */
test.describe('Login', () => {

  test('a standard user can log in successfully', async ({ loginPage, page }) => {
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('a locked-out user sees an error message', async ({ loginPage }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('empty credentials show a validation error', async ({ loginPage }) => {
    await loginPage.clickLogin();

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

});