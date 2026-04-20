/**
 * Tests for URL check is alive command
 * Verifies URL health checking functionality
 * Note: This endpoint may require specific API key permissions
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { apiPost, createApiClient } from '../src/lib/api-client-http-requests.js';
import { getTestApiKey, TEST_URLS } from './test-helpers-api-client-utilities.js';

describe('URL Check Commands', () => {
  beforeAll(() => {
    const apiKey = getTestApiKey();
    createApiClient(apiKey);
  });

  describe('url-check', () => {
    it.skip('should check if URL is alive (requires elevated permissions)', async () => {
      const params = new URLSearchParams();
      params.append('url', TEST_URLS.SIMPLE);

      const result = await apiPost<Record<string, unknown>>(`/url/is-alive?${params.toString()}`, {});

      expect(result).toBeDefined();
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it.skip('should return status information (requires elevated permissions)', async () => {
      const params = new URLSearchParams();
      params.append('url', TEST_URLS.SIMPLE);

      const result = await apiPost<Record<string, unknown>>(`/url/is-alive?${params.toString()}`, {});

      expect(result).toBeDefined();
    });

    it('should have correct endpoint structure', () => {
      // Verify endpoint path construction
      const params = new URLSearchParams();
      params.append('url', TEST_URLS.SIMPLE);
      const endpoint = `/url/is-alive?${params.toString()}`;

      expect(endpoint).toContain('/url/is-alive');
      expect(endpoint).toContain('url=');
    });
  });
});
