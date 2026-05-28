const { BasePage } = require('./BasePage');

/**
 * InventoryPage — the product listing page (after login).
 *
 * Encapsulates:
 *   - Product grid interactions (add to cart, remove)
 *   - Sorting
 *   - Cart badge state
 *   - Navigation to cart
 */
class InventoryPage extends BasePage {

  constructor(page) {
    super(page);

    // Page-level locators
    this.pageTitle = page.locator('[data-test="title"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');

    // Locators for product list (used by helper methods)
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
  }

  /**
   * Returns true if the inventory page is currently displayed.
   * Used by tests to confirm successful navigation.
   */
  async isDisplayed() {
    return await this.pageTitle.isVisible();
  }

  /**
   * Returns the total number of products shown.
   */
  async getProductCount() {
    return await this.inventoryItems.count();
  }

  /**
   * Returns an array of all product names in the order they appear.
   * @returns {Promise<string[]>}
   */
  async getProductNames() {
    return await this.itemNames.allTextContents();
  }

  /**
   * Returns an array of all product prices as numbers (in display order).
   * Strips the leading '$'.
   * @returns {Promise<number[]>}
   */
  async getProductPrices() {
    const priceTexts = await this.itemPrices.allTextContents();
    return priceTexts.map(text => parseFloat(text.replace('$', '')));
  }

  /**
   * Change the sort order.
   * @param {'az'|'za'|'lohi'|'hilo'} option
   *   az    = Name (A to Z)
   *   za    = Name (Z to A)
   *   lohi  = Price low to high
   *   hilo  = Price high to low
   */
  async sortBy(option) {
    await this.sortDropdown.selectOption(option);
  }

  /**
   * Add a specific product to the cart by its display name.
   * @param {string} productName  e.g. 'Sauce Labs Backpack'
   */
  async addProductToCart(productName) {
    // Convert "Sauce Labs Backpack" -> "sauce-labs-backpack"
    const productSlug = productName.toLowerCase().replace(/\s+/g, '-');
    const addButton = this.page.locator(`[data-test="add-to-cart-${productSlug}"]`);
    await addButton.click();
  }

  /**
   * Remove a specific product from the cart by its display name.
   * @param {string} productName
   */
  async removeProductFromCart(productName) {
    const productSlug = productName.toLowerCase().replace(/\s+/g, '-');
    const removeButton = this.page.locator(`[data-test="remove-${productSlug}"]`);
    await removeButton.click();
  }

  /**
   * Returns the number shown on the cart badge, or 0 if the badge is hidden.
   */
  async getCartBadgeCount() {
    if (await this.shoppingCartBadge.isVisible()) {
      const text = await this.shoppingCartBadge.textContent();
      return parseInt(text, 10);
    }
    return 0;
  }

  /**
   * Click the cart icon to navigate to the cart page.
   */
  async goToCart() {
    await this.shoppingCartLink.click();
  }
}

module.exports = { InventoryPage };