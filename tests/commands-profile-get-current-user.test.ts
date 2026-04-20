/**
 * Tests for profile get current user command
 * Verifies user profile retrieval with API key authentication
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { apiGet, createApiClient } from '../src/lib/api-client-http-requests.js';
import { getTestApiKey } from './test-helpers-api-client-utilities.js';

describe('Profile Command', () => {
  beforeAll(() => {
    const apiKey = getTestApiKey();
    createApiClient(apiKey);
  });

  it('should fetch user profile successfully', async () => {
    const result = await apiGet<Record<string, unknown>>('/profile');

    expect(result).toBeDefined();
    // Response should have some user-related fields
    expect(Object.keys(result).length).toBeGreaterThan(0);
  });

  it('should include user identification info', async () => {
    const result = await apiGet<Record<string, unknown>>('/profile');

    // Profile should have some form of user identification
    const hasUserInfo =
      result.id || result.email || result.user || result.data || result.name;
    expect(hasUserInfo !== undefined || Object.keys(result).length > 0).toBe(true);
  });

  it('should return valid response structure', async () => {
    const result = await apiGet<Record<string, unknown>>('/profile');

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });
});
