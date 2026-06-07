/**
 * BookingApiClient — wraps all interactions with the Restful-Booker API.
 *
 * This is the API equivalent of a Page Object: it encapsulates HOW
 * to talk to the API, so tests can describe WHAT they want.
 *
 * Tests use this client; they don't construct URLs or set headers themselves.
 */
class BookingApiClient {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   *   The Playwright `request` fixture, passed in by the test.
   */
  constructor(request) {
    this.request = request;
    this.baseUrl = 'https://restful-booker.herokuapp.com';
    this.authToken = null;   // populated after authenticate() is called
  }

  // ───────────────────────────────────────────────────────────────
  //  Authentication
  // ───────────────────────────────────────────────────────────────

  /**
   * Authenticate and store the token for later requests.
   * Uses the default admin credentials documented on Restful-Booker.
   */
  async authenticate(username = 'admin', password = 'password123') {
    const response = await this.request.post(`${this.baseUrl}/auth`, {
      data: { username, password },
    });

    const body = await response.json();
    this.authToken = body.token;
    return this.authToken;
  }

  /**
   * Internal helper: returns the cookie header for authenticated requests.
   * Restful-Booker expects the token as a Cookie, not a Bearer header — unusual.
   */
  _authHeaders() {
    if (!this.authToken) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }
    return { Cookie: `token=${this.authToken}` };
  }

  // ───────────────────────────────────────────────────────────────
  //  Booking CRUD
  // ───────────────────────────────────────────────────────────────

  /**
   * GET /booking — list all booking IDs.
   */
  async getAllBookingIds() {
    return await this.request.get(`${this.baseUrl}/booking`);
  }

  /**
   * GET /booking/{id} — fetch one booking by ID.
   */
  async getBookingById(id) {
    return await this.request.get(`${this.baseUrl}/booking/${id}`, {
      headers: { Accept: 'application/json' },
    });
  }

  /**
   * POST /booking — create a new booking.
   * @param {object} bookingData  The booking payload.
   */
  async createBooking(bookingData) {
    return await this.request.post(`${this.baseUrl}/booking`, {
      data: bookingData,
      headers: { Accept: 'application/json' },
    });
  }

  /**
   * PATCH /booking/{id} — partially update a booking. Requires auth.
   */
  async updateBooking(id, partialData) {
    return await this.request.patch(`${this.baseUrl}/booking/${id}`, {
      data: partialData,
      headers: {
        Accept: 'application/json',
        ...this._authHeaders(),
      },
    });
  }

  /**
   * DELETE /booking/{id} — delete a booking. Requires auth.
   */
  async deleteBooking(id) {
    return await this.request.delete(`${this.baseUrl}/booking/${id}`, {
      headers: this._authHeaders(),
    });
  }
}

module.exports = { BookingApiClient };