const { BasePage } = require('./BasePage');

/**
 * CartPage — the shopping cart page (/cart.html).
 *
 * Encapsulates:
 *   - Viewing items in the cart
 *   - Removing items from the cart
 *   - Proceeding to checkout
 *   - Continuing to shop
 */
class CartPage extends BasePage {

  constructor(page) {
    super(page);

    this.pageTitle = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.cartItemNames = page.locator('[data-test="inventory-item-name"]');
    this.cartItemPrices = page.locator('[data-test="inventory-item-price"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  /**
   * Returns true if the cart page is currently displayed.
   */
  async isDisplayed() {
    return await this.pageTitle.isVisible();
  }

  /**
   * Returns the number of items in the cart.
   */
  async getItemCount() {
    return await this.cartItems.count();
  }

  /**
   * Returns an array of all item names in the cart.
   * @returns {Promise<string[]>}
   */
  async getItemNames() {
    return await this.cartItemNames.allTextContents();
  }

  /**
   * Remove an item from the cart by name.
   * @param {string} productName e.g. 'Sauce Labs Backpack'
   */
  async removeItem(productName) {
    const productSlug = productName.toLowerCase().replace(/\s+/g, '-');
    const removeButton = this.page.locator(`[data-test="remove-${productSlug}"]`);
    await removeButton.click();
  }

  /**
   * Click the Checkout button to proceed.
   */
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  /**
   * Click Continue Shopping to go back to the inventory page.
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}

module.exports = { CartPage };