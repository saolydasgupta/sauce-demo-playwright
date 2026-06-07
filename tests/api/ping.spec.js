const { test, expect } = require('@playwright/test');

/**
 * Restful-Booker API tests — health check
 *
 * The /ping endpoint is a sanity check the API team provides to
 * confirm the service is up. We test that it returns 201.
 */
test.describe('Restful-Booker API - Health Check', () => {

  test('GET /ping returns 201 Created', async ({ request }) => {
    // Send a GET request to the ping endpoint
    const response = await request.get('https://restful-booker.herokuapp.com/ping');

    // Assert the status code is 201 (Created)
    expect(response.status()).toBe(201);
    expect(response.ok()).toBeTruthy();
  });

  test('GET /booking/1 returns booking details', async ({ request }) => {
    const response = await request.get('https://restful-booker.herokuapp.com/booking/1');

    // Status check
    expect(response.ok()).toBeTruthy();

    // Parse the JSON body
    const booking = await response.json();

    // Assert the shape of the data
    expect(booking).toHaveProperty('firstname');
    expect(booking).toHaveProperty('lastname');
    expect(booking).toHaveProperty('totalprice');
    expect(booking).toHaveProperty('depositpaid');
    expect(booking).toHaveProperty('bookingdates');

    // Assert types
    expect(typeof booking.firstname).toBe('string');
    expect(typeof booking.totalprice).toBe('number');
    expect(typeof booking.depositpaid).toBe('boolean');

    // Assert nested object exists
    expect(booking.bookingdates).toHaveProperty('checkin');
    expect(booking.bookingdates).toHaveProperty('checkout');
  });

});