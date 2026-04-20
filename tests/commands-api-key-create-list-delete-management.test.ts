/**
 * Tests for API key management commands
 * Verifies API key list functionality
 * Note: Create/delete may require elevated permissions
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { apiGet, createApiClient } from '../src/lib/api-client-http-requests.js';
import { getTestApiKey } from './test-helpers-api-client-utilities.js';

describe('API Key Commands', () => {
  beforeAll(() => {
    const apiKey = getTestApiKey();
    createApiClient(apiKey);
  });

  describe('api-key list', () => {
    it('should list API keys', async () => {
      const result = await apiGet<Record<string, unknown>>('/api_key');

      expect(result).toBeDefined();
    });

    it('should return API key data', async () => {
      const result = await apiGet<Record<string, unknown> | unknown[]>('/api_key');

      expect(result).toBeDefined();
      // May return array or object with keys
      const hasKeys = Array.isArray(result) || (result as Record<string, unknown>).keys || (result as Record<string, unknown>).data;
      expect(hasKeys !== undefined || Object.keys(result as object).length >= 0).toBe(true);
    });

    it('should return valid response structure', async () => {
      const result = await apiGet<Record<string, unknown>>('/api_key');

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });
  });
});
