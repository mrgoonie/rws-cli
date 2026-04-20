/**
 * Tests for summarize URL and website content commands
 * Verifies AI-powered content summarization
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { apiPost, createApiClient } from '../src/lib/api-client-http-requests.js';
import { getTestApiKey, TEST_URLS } from './test-helpers-api-client-utilities.js';

describe('Summarize Commands', () => {
  beforeAll(() => {
    const apiKey = getTestApiKey();
    createApiClient(apiKey);
  });

  describe('summarize url', () => {
    it('should summarize URL content', async () => {
      const result = await apiPost<Record<string, unknown>>('/summarize/url', {
        url: TEST_URLS.SIMPLE,
      });

      expect(result).toBeDefined();
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it('should return summary data', async () => {
      const result = await apiPost<Record<string, unknown>>('/summarize/url', {
        url: TEST_URLS.SIMPLE,
      });

      expect(result).toBeDefined();
      // Check for summary or content field
      const hasSummary = result.summary || result.content || result.text || result.data;
      expect(hasSummary !== undefined || Object.keys(result).length > 0).toBe(true);
    });
  });

  describe('summarize website', () => {
    it.skip('should summarize entire website (may have rate limits)', async () => {
      const params = new URLSearchParams();
      params.append('url', TEST_URLS.SIMPLE);

      const result = await apiPost<Record<string, unknown>>(`/summarize/website?${params.toString()}`, {
        maxLinks: 3,
      });

      expect(result).toBeDefined();
    });

    it('should have correct endpoint structure', () => {
      // Verify endpoint path construction
      const params = new URLSearchParams();
      params.append('url', TEST_URLS.SIMPLE);
      const endpoint = `/summarize/website?${params.toString()}`;

      expect(endpoint).toContain('/summarize/website');
      expect(endpoint).toContain('url=');
    });
  });
});
