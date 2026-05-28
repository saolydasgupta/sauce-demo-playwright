/**
 * BasePage — the parent class for every Page Object.
 *
 * Every page in our framework inherits from this. It holds:
 *   - the Playwright `page` reference
 *   - any helper methods that all pages need (navigation, waits, etc.)
 *
 * If you find yourself writing the same helper in two different page
 * objects, it probably belongs here.
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page  The Playwright page object
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a path on the site.
   * baseURL is set in playwright.config.js, so we pass relative paths.
   *
   * @param {string} path  e.g. '/' or '/inventory.html'
   */
  async goto(path = '/') {
  await this.page.goto(path, { waitUntil: 'domcontentloaded' });
}
  ;

  /**
   * Returns the current page title — useful for assertions.
   */
  async getTitle() {
    return await this.page.title()  };

  /**
   * Returns the current page URL — useful for assertions.
   */
  getCurrentUrl() {
    return this.page.url();
  }
};


module.exports = { BasePage };