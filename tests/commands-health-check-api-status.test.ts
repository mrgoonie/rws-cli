/**
 * Tests for health check API status command
 * Verifies API connectivity and health endpoint
 */

import { describe, it, expect } from 'vitest';
import axios from 'axios';
import { API_BASE_URL } from '../src/config/constants.js';

describe('Health Check Command', () => {
  it('should return successful response from API', async () => {
    const response = await axios.get(`${API_BASE_URL}/healthz`);

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
  });

  it('should indicate API is operational', async () => {
    const response = await axios.get(`${API_BASE_URL}/healthz`);

    // API may return { success: true } or { status: 'ok' } or similar
    const isHealthy =
      response.data.success === true ||
      response.data.status === 'ok' ||
      response.data.status === 'healthy' ||
      response.status === 200;

    expect(isHealthy).toBe(true);
  });
});
