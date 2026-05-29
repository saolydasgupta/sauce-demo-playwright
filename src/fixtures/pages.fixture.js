const base = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');

/**
 * Custom Playwright fixtures.
 *
 * Each fixture below makes a page object available to any test
 * that asks for it by name. Playwright creates a fresh one per test.
 *
 * Two flavours:
 *   - "page object" fixtures (loginPage, cartPage, etc.) — just a fresh
 *     instance, you decide whether to log in.
 *   - "loggedIn" fixtures (inventoryPage, etc.) — already logged in as
 *     standard_user and on the right page.
 *
 * Usage in a test:
 *
 *   const { test, expect } = require('../src/fixtures/pages.fixture');
 *
 *   test('something', async ({ inventoryPage }) => {
 *     // inventoryPage is ready: logged in, on /inventory.html
 *     await inventoryPage.addProductToCart('Sauce Labs Backpack');
 *   });
 */
const test = base.test.extend({

  // ── Plain page-object fixtures ─────────────────────────────────────

  /**
   * A fresh LoginPage on the login screen, not logged in.
   * Use this for login-specific tests (positive and negative cases).
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await use(loginPage);
  },

  // ── Authenticated fixtures ─────────────────────────────────────────

  /**
   * An InventoryPage with the user already logged in as standard_user.
   * Saves every inventory test from repeating login steps.
   */
  inventoryPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');

    await use(inventoryPage);
  },

  /**
   * A CartPage with the user already logged in.
   * Note: the cart will be empty unless the test adds items first.
   */
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  /**
   * A CheckoutPage instance (no automatic navigation).
   * Combine with cartPage / inventoryPage to drive checkout flows.
   */
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

});

// Re-export Playwright's expect so test files only need ONE import.
const expect = base.expect;

module.exports = { test, expect };