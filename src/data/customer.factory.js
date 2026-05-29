const { faker } = require('@faker-js/faker');

/**
 * Customer factory — produces realistic customer data for checkout tests.
 *
 * Usage:
 *   const customer = createCustomer();
 *   // customer = { firstName, lastName, postalCode }
 *
 *   const overridden = createCustomer({ firstName: 'BugCheck' });
 *   // useful when a specific field matters to the test
 */

/**
 * Generate a single random customer.
 * Any field can be overridden by passing it explicitly.
 *
 * @param {Partial<{ firstName: string, lastName: string, postalCode: string }>} overrides
 */
function createCustomer(overrides = {}) {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode(),
    ...overrides,   // any values passed in win over the defaults
  };
}

/**
 * Convenience — a customer with deliberately edge-case data.
 * Tests interesting names, apostrophes, unicode, long fields.
 */
function createTrickyCustomer(overrides = {}) {
  return {
    firstName: `Marie-Claire`,
    lastName: `O'Sullivan-Müller`,
    postalCode: faker.location.zipCode(),
    ...overrides,
  };
}

module.exports = {
  createCustomer,
  createTrickyCustomer,
};