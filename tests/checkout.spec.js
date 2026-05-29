const { test, expect } = require('../src/fixtures/pages.fixture');
const { createCustomer } = require('../src/data/customer.factory');
const { createTrickyCustomer } = require('../src/data/customer.factory');

/**
 * Sauce Demo - End-to-end checkout flow
 *
 * Uses the `inventoryPage`, `cartPage`, and `checkoutPage` fixtures.
 * The user is already logged in when each test starts (handled by the
 * inventoryPage fixture), so tests focus on the business journey itself.
 */
test.describe('Checkout', () => {

  test('checkout handles names with apostrophes and accented characters', async ({ inventoryPage, cartPage, checkoutPage, page }) => {
  
    const { firstName, lastName, postalCode } = createTrickyCustomer();

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillCustomerInformation(firstName, lastName, postalCode);
    await checkoutPage.continueToOverview();
    await checkoutPage.finishOrder();

    await expect(page).toHaveURL(/.*checkout-complete/);
    await expect(checkoutPage.confirmationHeader).toHaveText('Thank you for your order!');
  });

  test('a user can complete a purchase end-to-end', async ({ inventoryPage, cartPage, checkoutPage, page }) => {
    // Step 1: Add two products to the cart
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    // Step 2: Go to the cart and verify items
    await inventoryPage.goToCart();
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
    expect(await cartPage.getItemCount()).toBe(2);

    const itemNames = await cartPage.getItemNames();
    expect(itemNames).toContain('Sauce Labs Backpack');
    expect(itemNames).toContain('Sauce Labs Bike Light');

    // Step 3: Proceed to checkout
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one/);

    // Step 4: Fill in customer info and continue
    const customer = createCustomer();
    await checkoutPage.fillCustomerInformation(customer.firstName, customer.lastName, customer.postalCode);
    await checkoutPage.continueToOverview();
    await expect(page).toHaveURL(/.*checkout-step-two/);

    // Step 5: Verify the order total looks correct, then finish
    const total = await checkoutPage.getTotal();
    expect(total).toBeGreaterThan(0);
    await checkoutPage.finishOrder();

    // Step 6: Confirmation
    await expect(page).toHaveURL(/.*checkout-complete/);
    await expect(checkoutPage.confirmationHeader).toHaveText('Thank you for your order!');
  });

  test('checkout fails if first name is missing', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    // Skip first name on purpose
    await checkoutPage.fillCustomerInformation('', 'Doe', '12345');
    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('user can remove an item from the cart before checkout', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();

    expect(await cartPage.getItemCount()).toBe(2);

    await cartPage.removeItem('Sauce Labs Backpack');

    expect(await cartPage.getItemCount()).toBe(1);
    const remainingItems = await cartPage.getItemNames();
    expect(remainingItems).toEqual(['Sauce Labs Bike Light']);
  });

});