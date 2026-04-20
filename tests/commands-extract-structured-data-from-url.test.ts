/**
 * Tests for extract structured data from URL command
 * Verifies data extraction functionality with instructions and templates
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { apiPost, createApiClient } from '../src/lib/api-client-http-requests.js';
import { getTestApiKey, TEST_URLS } from './test-helpers-api-client-utilities.js';

describe('Extract Commands', () => {
  beforeAll(() => {
    const apiKey = getTestApiKey();
    createApiClient(apiKey);
  });

  describe('extract data', () => {
    it('should extract data from URL with instructions', async () => {
      const result = await apiPost<Record<string, unknown>>('/extract', {
        url: TEST_URLS.SIMPLE,
        options: {
          instructions: 'Extract the page title and main heading',
          jsonTemplate: '{"title": "string"}',
        },
      });

      expect(result).toBeDefined();
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it('should return extracted data', async () => {
      const result = await apiPost<Record<string, unknown>>('/extract', {
        url: TEST_URLS.SIMPLE,
        options: {
          instructions: 'Extract the page title',
          jsonTemplate: '{"title": "string"}',
        },
      });

      expect(result).toBeDefined();
      // Check for data field
      const hasExtractedData =
        result.data !== undefined ||
        result.extracted !== undefined ||
        result.result !== undefined ||
        Object.keys(result).length > 0;
      expect(hasExtractedData).toBe(true);
    });

    it('should handle extraction with template schema', async () => {
      const template = JSON.stringify({
        title: 'string',
        description: 'string',
      });

      const result = await apiPost<Record<string, unknown>>('/extract', {
        url: TEST_URLS.SIMPLE,
        options: {
          instructions: 'Extract the page title and description',
          jsonTemplate: template,
        },
      });

      expect(result).toBeDefined();
    });
  });
});
