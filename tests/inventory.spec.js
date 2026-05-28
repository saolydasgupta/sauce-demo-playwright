
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../src/pages/LoginPage');
const { InventoryPage } = require('../src/pages/InventoryPage');

/**
 * Sauce Demo - Inventory page tests
 *
 * Covers:
 *   - Page loads with expected content
 *   - Sort dropdown changes product order
 *   - Adding/removing products updates the cart badge
 */
test.describe('Inventory', () => {

  let loginPage;
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('inventory page displays exactly 6 products', async () => {
    await expect(inventoryPage.pageTitle).toHaveText('Products');
    expect(await inventoryPage.getProductCount()).toBe(6);
  });

  test('products are sorted A to Z by default', async () => {
    const names = await inventoryPage.getProductNames();
    const sortedNames = [...names].sort();   // a copy, sorted
    expect(names).toEqual(sortedNames);
  });

  test('sorting by price low-to-high reorders products', async () => {
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getProductPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  test('sorting by price high-to-low reorders products', async () => {
    await inventoryPage.sortBy('hilo');

    const prices = await inventoryPage.getProductPrices();
    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  });

  test('adding a product updates the cart badge', async () => {
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('adding multiple products updates the cart badge correctly', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');

    expect(await inventoryPage.getCartBadgeCount()).toBe(3);
  });

  test('removing a product decreases the cart badge', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    await inventoryPage.removeProductFromCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

});
