const { test, expect } = require('../src/fixtures/pages.fixture');

/**
 * Sauce Demo - Inventory page tests
 *
 * Uses the custom `inventoryPage` fixture, which logs in as standard_user
 * and lands on the inventory page before each test.
 */
test.describe('Inventory', () => {

  test('inventory page displays exactly 6 products', async ({ inventoryPage }) => {
    await expect(inventoryPage.pageTitle).toHaveText('Products');
    expect(await inventoryPage.getProductCount()).toBe(6);
  });

  test('products are sorted A to Z by default', async ({ inventoryPage }) => {
    const names = await inventoryPage.getProductNames();
    const sortedNames = [...names].sort();
    expect(names).toEqual(sortedNames);
  });

  test('sorting by price low-to-high reorders products', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getProductPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  test('sorting by price high-to-low reorders products', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');

    const prices = await inventoryPage.getProductPrices();
    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  });

  test('adding a product updates the cart badge', async ({ inventoryPage }) => {
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('adding multiple products updates the cart badge correctly', async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');

    expect(await inventoryPage.getCartBadgeCount()).toBe(3);
  });

  test('removing a product decreases the cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    await inventoryPage.removeProductFromCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

});