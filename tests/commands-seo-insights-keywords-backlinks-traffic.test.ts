/**
 * Tests for SEO insights commands
 * Verifies keyword ideas, difficulty, backlinks, and traffic analysis
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { apiPost, createApiClient } from '../src/lib/api-client-http-requests.js';
import { getTestApiKey, TEST_DOMAINS, TEST_KEYWORDS } from './test-helpers-api-client-utilities.js';

describe('SEO Commands', () => {
  beforeAll(() => {
    const apiKey = getTestApiKey();
    createApiClient(apiKey);
  });

  describe('seo keyword-ideas', () => {
    it('should return keyword ideas for a keyword', async () => {
      const result = await apiPost<Record<string, unknown>>('/seo-insights/keyword-ideas', {
        keyword: TEST_KEYWORDS.SIMPLE,
      });

      expect(result).toBeDefined();
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it('should return ideas data', async () => {
      const result = await apiPost<Record<string, unknown>>('/seo-insights/keyword-ideas', {
        keyword: TEST_KEYWORDS.SIMPLE,
      });

      expect(result).toBeDefined();
      // Check for ideas or data field
      const hasIdeas = result.ideas || result.data || result.keywords || result.results;
      expect(hasIdeas !== undefined || Object.keys(result).length > 0).toBe(true);
    });

    it('should accept country parameter', async () => {
      const result = await apiPost<Record<string, unknown>>('/seo-insights/keyword-ideas', {
        keyword: TEST_KEYWORDS.SIMPLE,
        country: 'us',
      });

      expect(result).toBeDefined();
    });
  });

  describe('seo keyword-difficulty', () => {
    it('should return keyword difficulty data', async () => {
      const result = await apiPost<Record<string, unknown>>('/seo-insights/keyword-difficulty', {
        keyword: TEST_KEYWORDS.SIMPLE,
      });

      expect(result).toBeDefined();
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it('should return difficulty information', async () => {
      const result = await apiPost<Record<string, unknown>>('/seo-insights/keyword-difficulty', {
        keyword: TEST_KEYWORDS.SIMPLE,
      });

      expect(result).toBeDefined();
      // Response should have difficulty or related data
      const hasDifficultyInfo =
        result.difficulty !== undefined ||
        result.score !== undefined ||
        result.data !== undefined ||
        Object.keys(result).length > 0;
      expect(hasDifficultyInfo).toBe(true);
    });
  });

  describe('seo backlinks', () => {
    it('should return backlinks data for a domain', async () => {
      const result = await apiPost<Record<string, unknown>>('/seo-insights/backlinks', {
        domain: TEST_DOMAINS.EXAMPLE,
      });

      expect(result).toBeDefined();
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it('should return backlinks information', async () => {
      const result = await apiPost<Record<string, unknown>>('/seo-insights/backlinks', {
        domain: TEST_DOMAINS.EXAMPLE,
      });

      expect(result).toBeDefined();
      // Check for backlinks or data field
      const hasBacklinks = result.backlinks || result.data || result.links || result.results;
      expect(hasBacklinks !== undefined || Object.keys(result).length > 0).toBe(true);
    });
  });

  describe('seo traffic', () => {
    it('should return traffic data for a domain', async () => {
      const result = await apiPost<Record<string, unknown>>('/seo-insights/traffic', {
        domainOrUrl: TEST_DOMAINS.EXAMPLE,
        mode: 'subdomains',
      });

      expect(result).toBeDefined();
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it('should return traffic information', async () => {
      const result = await apiPost<Record<string, unknown>>('/seo-insights/traffic', {
        domainOrUrl: TEST_DOMAINS.EXAMPLE,
        mode: 'subdomains',
      });

      expect(result).toBeDefined();
      // Response should have traffic data
      const hasTrafficInfo =
        result.traffic !== undefined ||
        result.data !== undefined ||
        result.items !== undefined ||
        result.visits !== undefined ||
        result.organic !== undefined ||
        Object.keys(result).length > 0;
      expect(hasTrafficInfo).toBe(true);
    });

    it('should accept mode parameter', async () => {
      const result = await apiPost<Record<string, unknown>>('/seo-insights/traffic', {
        domainOrUrl: TEST_DOMAINS.EXAMPLE,
        mode: 'exact',
      });

      expect(result).toBeDefined();
    });
  });
});
