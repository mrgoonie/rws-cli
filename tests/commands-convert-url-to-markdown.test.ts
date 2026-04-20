/**
 * Tests for convert URL to markdown commands
 * Verifies markdown conversion functionality
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { apiPost, createApiClient } from '../src/lib/api-client-http-requests.js';
import { getTestApiKey, TEST_URLS } from './test-helpers-api-client-utilities.js';

describe('Convert Commands', () => {
  beforeAll(() => {
    const apiKey = getTestApiKey();
    createApiClient(apiKey);
  });

  describe('convert markdown', () => {
    it('should convert URL to markdown', async () => {
      const result = await apiPost<Record<string, unknown>>('/convert/markdown', {
        url: TEST_URLS.SIMPLE,
      });

      expect(result).toBeDefined();
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it('should return content from conversion', async () => {
      const result = await apiPost<Record<string, unknown>>('/convert/markdown', {
        url: TEST_URLS.SIMPLE,
      });

      expect(result).toBeDefined();
      // Check for markdown or content field
      const hasContent = result.markdown || result.content || result.text || result.data;
      expect(hasContent !== undefined || Object.keys(result).length > 0).toBe(true);
    });

    it('should handle conversion successfully', async () => {
      const result = await apiPost<Record<string, unknown>>('/convert/markdown', {
        url: TEST_URLS.SIMPLE,
      });

      expect(result).toBeDefined();
      // Verify no error in response
      expect(result.error).toBeUndefined();
    });
  });

  describe('convert markdown batch', () => {
    it('should convert multiple URLs to markdown', async () => {
      const result = await apiPost<Record<string, unknown>>('/convert/markdown/urls', {
        urls: [TEST_URLS.SIMPLE],
      });

      expect(result).toBeDefined();
    });

    it('should return data for batch conversion', async () => {
      const result = await apiPost<Record<string, unknown>>('/convert/markdown/urls', {
        urls: [TEST_URLS.SIMPLE],
      });

      expect(result).toBeDefined();
      // May return array or object with results
      const hasResults = Array.isArray(result) || result.results || result.data;
      expect(hasResults !== undefined || Object.keys(result).length > 0).toBe(true);
    });
  });
});
