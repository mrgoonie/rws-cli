/**
 * Test helper utilities for API client testing
 * Provides reusable functions for test setup and assertions
 */

import { createApiClient } from '../src/lib/api-client-http-requests.js';

/**
 * Get API key from environment variable
 */
export function getTestApiKey(): string {
  const apiKey = process.env.RWEB_API_KEY;
  if (!apiKey) {
    throw new Error('RWEB_API_KEY environment variable is required for tests');
  }
  return apiKey;
}

/**
 * Initialize API client with test API key
 */
export function initTestApiClient(): void {
  const apiKey = getTestApiKey();
  createApiClient(apiKey);
}

/**
 * Test URL constants for consistent testing
 */
export const TEST_URLS = {
  SIMPLE: 'https://example.com',
  GOOGLE: 'https://google.com',
  GITHUB: 'https://github.com',
} as const;

/**
 * Test domain constants for SEO testing
 */
export const TEST_DOMAINS = {
  EXAMPLE: 'example.com',
  GOOGLE: 'google.com',
} as const;

/**
 * Test keywords for SEO testing
 */
export const TEST_KEYWORDS = {
  SIMPLE: 'web development',
  MARKETING: 'digital marketing',
} as const;
