# Sauce Demo — Playwright Test Automation Framework

[![Playwright Tests](https://github.com/saolydasgupta/sauce-demo-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/saolydasgupta/sauce-demo-playwright/actions/workflows/playwright.yml)

> A portfolio-grade end-to-end test automation framework built with **Playwright** and **JavaScript**, testing the [Sauce Demo](https://www.saucedemo.com) e-commerce site.
> Demonstrates Page Object Model, custom fixtures, test data factories, and code quality enforcement — the patterns I'd use in a real production test suite.

---

## 📋 Overview

This project is my hands-on demonstration of how I'd architect a Playwright-based UI test framework for a real e-commerce application. It's deliberately built to **production standards**, not tutorial standards — every choice (folder structure, locator strategy, fixture design, lint rules) is one I'd be comfortable defending in a code review.

The framework currently covers **login, product browsing, cart management, and the complete checkout flow** across multiple users and edge cases.

## 🧰 Tech Stack

| Layer | Tool |
|---|---|
| Test runner & browser automation | [Playwright](https://playwright.dev) |
| Language | JavaScript (Node.js) |
| Test data generation | [@faker-js/faker](https://fakerjs.dev) |
| Code quality | ESLint + [eslint-plugin-playwright](https://github.com/playwright-community/eslint-plugin-playwright) |
| Version control | Git + GitHub |

## ✨ Key Features

- **Page Object Model** with a shared `BasePage` parent class
- **Custom Playwright fixtures** for clean, declarative test setup
- **Test data factories** powered by faker.js — every run uses unique data
- **Stable locator strategy** built on `data-test` attributes and user-facing roles — no `nth()` or CSS selectors
- **Web-first assertions only** — zero `waitForTimeout` calls in the codebase
- **Network-resilient configuration** tuned for variable connection quality
- **ESLint enforcement** of Playwright best practices (`no-wait-for-timeout`, `no-focused-test`, etc.)
- **Multi-browser support** — Chromium, Firefox, WebKit
- **Test categories**: happy path, negative tests, edge cases (e.g. names with apostrophes, accents)

## 📁 Project Structure
```text
sauce-demo-playwright/
├── src/
│   ├── pages/              # Page Object Model classes
│   │   ├── BasePage.js     # Parent class — shared navigation helpers
│   │   ├── LoginPage.js
│   │   ├── InventoryPage.js
│   │   ├── CartPage.js
│   │   └── CheckoutPage.js
│   ├── fixtures/           # Custom Playwright fixtures
│   │   └── pages.fixture.js
│   └── data/               # Test data factories
│       └── customer.factory.js
├── tests/                  # Test files (*.spec.js)
│   ├── login.spec.js
│   ├── inventory.spec.js
│   └── checkout.spec.js
├── eslint.config.js        # Linting rules
├── playwright.config.js    # Playwright configuration
└── package.json
```

## 🏛 Architectural Decisions

### Why a `BasePage` parent class?
Every page object inherits from `BasePage`, which centralises common helpers like `goto()` and `getCurrentUrl()`. This means navigation logic (such as `waitUntil: 'domcontentloaded'`) lives in one place. If I need to change how pages load, I edit one file, not five.

### Why custom fixtures instead of `beforeEach`?
Custom fixtures (`src/fixtures/pages.fixture.js`) let tests *declare what they need* rather than performing setup. Compare:

```javascript
// Without fixtures
let inventoryPage;
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  inventoryPage = new InventoryPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
});
test('add to cart', async () => { ... });

// With fixtures
test('add to cart', async ({ inventoryPage }) => {
  // logged in, on inventory page, ready to go
});
```

This makes tests dramatically more readable and removes shared mutable state between tests.

### Why faker.js for test data?
Hardcoded test data ("John Doe / 12345") misses bugs that real-world names ("Marie-Claire O'Sullivan-Müller") catch. Factories also enable parallel test execution — each test gets unique data, preventing collisions on shared state.

### Locator strategy
Locators follow Playwright's recommended priority order:

1. **`getByRole`** — for buttons, links, and labelled inputs (most resilient)
2. **`getByLabel` / `getByPlaceholder`** — for form fields without ARIA roles
3. **`getByTestId` / `[data-test="..."]`** — for elements without semantic locators
4. **CSS selectors** — last resort only

The codebase contains **zero `nth()` calls** and **zero index-based locators**. This means form changes — adding a new field, reordering inputs — don't break tests.

### Why no `waitForTimeout`?
`page.waitForTimeout(2000)` is the most common Playwright anti-pattern. It's slow when the app is fast, and unreliable when the app is slow. Playwright's web-first assertions (`expect(locator).toBeVisible()`) auto-retry until the condition is met or the timeout expires — fast when fast, patient when slow.

This codebase contains **zero `waitForTimeout` calls**, enforced by ESLint:
```javascript
'playwright/no-wait-for-timeout': 'error'
```

##  Getting Started

### Prerequisites
- Node.js 18 or later
- npm (comes with Node.js)

### Installation

```bash
git clone https://github.com/saolydasgupta/sauce-demo-playwright.git
cd sauce-demo-playwright
npm install
npx playwright install
```

### Run the tests

```bash
# Run all tests across Chromium, Firefox, and WebKit
npm test

# Run only on Chromium (fastest, useful during development)
npm run test:chromium

# Run with browser windows visible
npm run test:headed

# Step through tests in the Playwright Inspector
npm run test:debug

# Open Playwright UI mode (interactive test runner)
npm run test:ui

# View the HTML report of the last test run
npm run report
```

### Code quality

```bash
# Check for lint issues
npm run lint

# Auto-fix lint issues
npm run lint:fix
```

##  Test Coverage

Current coverage spans three main areas:

| Suite | Tests | Description |
|---|---|---|
| **Login** | 3 | Happy path, locked-out user, validation errors |
| **Inventory** | 7 | Product display, sorting, cart badge updates |
| **Checkout** | 4 | End-to-end purchase, validation, item removal, edge cases |

**Total: 14 tests** running in **~5 seconds** on a single browser.

## 🛣 Roadmap

Planned additions to deepen this portfolio:

- [ ] **API testing layer** — combine UI + API for faster setup
- [ ] **Visual regression** with screenshot comparisons
- [ ] **Accessibility checks** via `@axe-core/playwright`
- [x ] **GitHub Actions CI/CD** pipeline ✅
- [ ] **Dockerised test runs** for environment consistency
- [ ] **Allure reporting** for richer test analytics

##  About this Project

Built as a portfolio piece to demonstrate the architectural choices and engineering discipline I'd bring to a real automation role. Open to feedback, suggestions, and conversation about anything in here — feel free to open an issue or get in touch.

---

*Built with ☕ and an unreasonable amount of attention to locator strategy.*