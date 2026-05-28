const { BasePage } = require('./BasePage');

/**
 * LoginPage — encapsulates the Sauce Demo login page.
 *
 * This class knows:
 *   - how to find every element on the login page
 *   - how to perform every action a user can do
 *
 * Tests should NOT touch page elements directly. They use this class.
 */
class LoginPage extends BasePage {

  constructor(page) {
    super(page);

    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async open() {
    await this.goto('/');
  }

  async enterUsername(username) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}

module.exports = { LoginPage };