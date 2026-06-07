const { test, expect } = require('@playwright/test');
const { BookingApiClient } = require('../../src/api/BookingApiClient');

/**
 * Restful-Booker API - Full CRUD lifecycle
 *
 * Demonstrates the four core operations against the booking API:
 *   Create  → POST    /booking
 *   Read    → GET     /booking/{id}
 *   Update  → PATCH   /booking/{id}   (requires auth)
 *   Delete  → DELETE  /booking/{id}   (requires auth)
 *
 * Each test is independent — it creates its own booking before
 * doing anything else, so they can run in any order or in parallel.
 */
test.describe('Booking CRUD', () => {

  /**
   * A reusable booking payload. Tests can pass overrides if they
   * care about specific fields.
   */
  const sampleBooking = {
    firstname: 'Test',
    lastname: 'Customer',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-06-01',
      checkout: '2026-06-07',
    },
    additionalneeds: 'Breakfast',
  };

  test('CREATE — POST /booking returns the new booking with an ID', async ({ request }) => {
    const api = new BookingApiClient(request);

    const response = await api.createBooking(sampleBooking);

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toHaveProperty('bookingid');
    expect(typeof body.bookingid).toBe('number');
    expect(body.booking.firstname).toBe('Test');
    expect(body.booking.totalprice).toBe(150);
  });

  test('READ — GET /booking/{id} returns the booking we created', async ({ request }) => {
    const api = new BookingApiClient(request);

    // First create a booking so we have one to read
    const createResponse = await api.createBooking(sampleBooking);
    const { bookingid } = await createResponse.json();

    // Now read it back
    const readResponse = await api.getBookingById(bookingid);
    expect(readResponse.ok()).toBeTruthy();

    const booking = await readResponse.json();
    expect(booking.firstname).toBe('Test');
    expect(booking.lastname).toBe('Customer');
    expect(booking.totalprice).toBe(150);
  });

  test('UPDATE — PATCH /booking/{id} updates the booking', async ({ request }) => {
    const api = new BookingApiClient(request);
    await api.authenticate();

    // Create a booking to update
    const createResponse = await api.createBooking(sampleBooking);
    const { bookingid } = await createResponse.json();

    // Update just the firstname
    const updateResponse = await api.updateBooking(bookingid, {
      firstname: 'Updated',
    });

    expect(updateResponse.ok()).toBeTruthy();
    const updated = await updateResponse.json();
    expect(updated.firstname).toBe('Updated');
    expect(updated.lastname).toBe('Customer');   // unchanged
  });

  test('DELETE — DELETE /booking/{id} removes the booking', async ({ request }) => {
    const api = new BookingApiClient(request);
    await api.authenticate();

    // Create a booking to delete
    const createResponse = await api.createBooking(sampleBooking);
    const { bookingid } = await createResponse.json();

    // Delete it
    const deleteResponse = await api.deleteBooking(bookingid);
    expect(deleteResponse.status()).toBe(201);   // Restful-Booker returns 201 on delete

    // Verify it's gone — the read should now 404
    const verifyResponse = await api.getBookingById(bookingid);
    expect(verifyResponse.status()).toBe(404);
  });

});