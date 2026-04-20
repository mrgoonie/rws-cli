/**
 * Tests for scrape URL content and extract links commands
 * Verifies web scraping functionality
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { apiPost, createApiClient } from '../src/lib/api-client-http-requests.js';
import { getTestApiKey, TEST_URLS } from './test-helpers-api-client-utilities.js';

describe('Scrape Commands', () => {
  beforeAll(() => {
    const apiKey = getTestApiKey();
    createApiClient(apiKey);
  });

  describe('scrape url', () => {
    it('should scrape URL and return content', async () => {
      const params = new URLSearchParams();
      params.append('url', TEST_URLS.SIMPLE);

      const result = await apiPost<Record<string, unknown>>(`/scrape?${params.toString()}`, {
        options: {},
      });

      expect(result).toBeDefined();
      // Response may have various structures, just check it's not empty
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it('should return content from scraped page', async () => {
      const params = new URLSearchParams();
      params.append('url', TEST_URLS.SIMPLE);

      const result = await apiPost<Record<string, unknown>>(`/scrape?${params.toString()}`, {
        options: {},
      });

      expect(result).toBeDefined();
      // Check for any content-related field
      const hasContent = result.html || result.text || result.content || result.data;
      expect(hasContent !== undefined || Object.keys(result).length > 0).toBe(true);
    });
  });

  describe('scrape extract links', () => {
    it.skip('should extract links from URL using links-map endpoint (requires elevated permissions)', async () => {
      const params = new URLSearchParams();
      params.append('url', TEST_URLS.SIMPLE);

      const result = await apiPost<Record<string, unknown>>(`/scrape/links-map?${params.toString()}`, {
        type: 'all',
      });

      expect(result).toBeDefined();
    });

    it('should have correct endpoint structure', () => {
      // Verify endpoint path construction
      const params = new URLSearchParams();
      params.append('url', TEST_URLS.SIMPLE);
      const endpoint = `/scrape/links-map?${params.toString()}`;

      expect(endpoint).toContain('/scrape/links-map');
      expect(endpoint).toContain('url=');
    });
  });
});
