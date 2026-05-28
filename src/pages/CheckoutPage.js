const { BasePage } = require('./BasePage');

/**
 * CheckoutPage — covers the three checkout steps:
 *   1. Information (first name, last name, postal code)
 *   2. Overview (review order)
 *   3. Confirmation ("Thank you for your order!")
 *
 * Kept as one class because these are a single logical flow.
 */
class CheckoutPage extends BasePage {

  constructor(page) {
    super(page);

    // Step 1: Information form
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    // Step 2: Overview
    this.summaryTotal = page.locator('[data-test="total-label"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.finishButton = page.locator('[data-test="finish"]');

    // Step 3: Confirmation
    this.confirmationHeader = page.locator('[data-test="complete-header"]');
    this.confirmationText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  /**
   * Fill in the customer information form.
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} postalCode
   */
  async fillCustomerInformation(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  /**
   * Click Continue to move from Information → Overview.
   */
  async continueToOverview() {
    await this.continueButton.click();
  }

  /**
   * Click Finish to complete the order.
   */
  async finishOrder() {
    await this.finishButton.click();
  }

  /**
   * Convenience: complete the entire checkout in one call.
   * Assumes you're already on the Information step.
   */
  async completeCheckout(firstName, lastName, postalCode) {
    await this.fillCustomerInformation(firstName, lastName, postalCode);
    await this.continueToOverview();
    await this.finishOrder();
  }

  /**
   * Returns the order total as a number (without currency).
   * Example: "Total: $43.18" -> 43.18
   */
  async getTotal() {
    const text = await this.summaryTotal.textContent();
    const match = text.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Returns the confirmation header text (or empty string if not visible).
   */
  async getConfirmationHeader() {
    return await this.confirmationHeader.textContent();
  }
}

module.exports = { CheckoutPage };