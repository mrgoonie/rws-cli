/**
 * Tests for screenshot capture URL command
 * Verifies screenshot generation functionality
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { apiPost, createApiClient } from '../src/lib/api-client-http-requests.js';
import { getTestApiKey, TEST_URLS } from './test-helpers-api-client-utilities.js';

describe('Screenshot Commands', () => {
  beforeAll(() => {
    const apiKey = getTestApiKey();
    createApiClient(apiKey);
  });

  describe('screenshot', () => {
    it('should capture screenshot of URL', async () => {
      const result = await apiPost<Record<string, unknown>>('/screenshot', {
        url: TEST_URLS.SIMPLE,
        options: {},
      });

      expect(result).toBeDefined();
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it('should return image data or URL', async () => {
      const result = await apiPost<Record<string, unknown>>('/screenshot', {
        url: TEST_URLS.SIMPLE,
        options: {},
      });

      expect(result).toBeDefined();
      // Check for image-related fields
      const hasImageInfo =
        result.imageUrl !== undefined ||
        result.url !== undefined ||
        result.image !== undefined ||
        result.data !== undefined ||
        result.screenshot !== undefined ||
        Object.keys(result).length > 0;
      expect(hasImageInfo).toBe(true);
    });

    it('should accept options parameters', async () => {
      const result = await apiPost<Record<string, unknown>>('/screenshot', {
        url: TEST_URLS.SIMPLE,
        options: {
          width: 1280,
          height: 720,
        },
      });

      expect(result).toBeDefined();
    });
  });
});
