/**
 * Tests for auth API key resolver
 * Verifies API key resolution priority: flag > env > config
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { resolveApiKey } from '../src/lib/auth-api-key-resolver.js';
import { setConfigValue, deleteConfigValue } from '../src/config/config-manager.js';
import { ENV_API_KEY } from '../src/config/constants.js';

describe('Auth API Key Resolver', () => {
  const originalEnv = process.env[ENV_API_KEY];

  beforeEach(() => {
    // Clear config and env before each test
    try {
      deleteConfigValue('apiKey');
    } catch {
      // Ignore
    }
    delete process.env[ENV_API_KEY];
  });

  afterEach(() => {
    // Restore original env
    if (originalEnv) {
      process.env[ENV_API_KEY] = originalEnv;
    }
  });

  it('should use flag value when provided', () => {
    const flagKey = 'flag-api-key';
    process.env[ENV_API_KEY] = 'env-api-key';
    setConfigValue('apiKey', 'config-api-key');

    const result = resolveApiKey({ apiKey: flagKey });

    expect(result).toBe(flagKey);

    // Cleanup
    deleteConfigValue('apiKey');
  });

  it('should use env variable when flag not provided', () => {
    const envKey = 'env-api-key';
    process.env[ENV_API_KEY] = envKey;
    setConfigValue('apiKey', 'config-api-key');

    const result = resolveApiKey({});

    expect(result).toBe(envKey);

    // Cleanup
    deleteConfigValue('apiKey');
  });

  it('should use config value when flag and env not provided', () => {
    const configKey = 'config-api-key';
    setConfigValue('apiKey', configKey);

    const result = resolveApiKey({});

    expect(result).toBe(configKey);

    // Cleanup
    deleteConfigValue('apiKey');
  });

  it('should throw error when no API key available', () => {
    expect(() => resolveApiKey({})).toThrow();
  });

  it('should prioritize flag over env', () => {
    const flagKey = 'flag-key';
    process.env[ENV_API_KEY] = 'env-key';

    const result = resolveApiKey({ apiKey: flagKey });

    expect(result).toBe(flagKey);
  });

  it('should prioritize env over config', () => {
    const envKey = 'env-key';
    process.env[ENV_API_KEY] = envKey;
    setConfigValue('apiKey', 'config-key');

    const result = resolveApiKey({});

    expect(result).toBe(envKey);

    // Cleanup
    deleteConfigValue('apiKey');
  });
});
