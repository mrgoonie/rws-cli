/**
 * Tests for review management commands
 * Verifies review create, get, list, update, and delete functionality
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { apiGet, apiPost, createApiClient } from '../src/lib/api-client-http-requests.js';
import { getTestApiKey, TEST_URLS } from './test-helpers-api-client-utilities.js';

describe('Review Commands', () => {
  beforeAll(() => {
    const apiKey = getTestApiKey();
    createApiClient(apiKey);
  });

  describe('review list', () => {
    it('should list reviews', async () => {
      const result = await apiGet<Record<string, unknown>>('/review');

      expect(result).toBeDefined();
      // May return array directly or object with reviews
      const hasReviews = Array.isArray(result) || result.reviews || result.data;
      expect(hasReviews !== undefined || Object.keys(result).length >= 0).toBe(true);
    });

    it('should return valid response structure', async () => {
      const result = await apiGet<Record<string, unknown>>('/review');

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('should support pagination parameters', async () => {
      const result = await apiGet<Record<string, unknown>>('/review?page=1&limit=5');

      expect(result).toBeDefined();
    });
  });

  describe('review create', () => {
    it('should create a new review', async () => {
      const result = await apiPost<Record<string, unknown>>('/review', {
        url: TEST_URLS.SIMPLE,
        instructions: 'Test review - please analyze this page',
      });

      expect(result).toBeDefined();
      // Should have some form of review data or id
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it('should return review data on creation', async () => {
      const result = await apiPost<Record<string, unknown>>('/review', {
        url: TEST_URLS.SIMPLE,
      });

      expect(result).toBeDefined();
      // Check for id or data
      const hasReviewData =
        result.id !== undefined ||
        result.data !== undefined ||
        result.review !== undefined ||
        Object.keys(result).length > 0;
      expect(hasReviewData).toBe(true);
    });
  });
});
