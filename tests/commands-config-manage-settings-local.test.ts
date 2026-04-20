/**
 * Tests for config management commands
 * Verifies local config file operations (set, get, delete, list)
 */

import { describe, it, expect, afterEach } from 'vitest';
import {
  getConfigValue,
  setConfigValue,
  deleteConfigValue,
  getAllConfig,
  getConfigPath,
} from '../src/config/config-manager.js';
import type { OutputFormat } from '../src/config/constants.js';

describe('Config Commands', () => {
  // Clean up test values after each test
  afterEach(() => {
    try {
      deleteConfigValue('apiKey');
    } catch {
      // Ignore if not set
    }
  });

  describe('config path', () => {
    it('should return config file path', () => {
      const path = getConfigPath();

      expect(path).toBeDefined();
      expect(typeof path).toBe('string');
      expect(path.length).toBeGreaterThan(0);
    });
  });

  describe('config set/get', () => {
    it('should set and get API key', () => {
      const testKey = 'test-api-key-12345';
      setConfigValue('apiKey', testKey);

      const result = getConfigValue('apiKey');
      expect(result).toBe(testKey);
    });

    it('should set and get base URL', () => {
      const testUrl = 'https://test.example.com/api';
      setConfigValue('baseUrl', testUrl);

      const result = getConfigValue('baseUrl');
      expect(result).toBe(testUrl);

      // Cleanup
      deleteConfigValue('baseUrl');
    });

    it('should set and get default format', () => {
      const testFormat: OutputFormat = 'table';
      setConfigValue('defaultFormat', testFormat);

      const result = getConfigValue('defaultFormat');
      expect(result).toBe(testFormat);

      // Cleanup
      deleteConfigValue('defaultFormat');
    });
  });

  describe('config delete', () => {
    it('should delete config value', () => {
      const testKey = 'test-key-to-delete';
      setConfigValue('apiKey', testKey);

      // Verify it was set
      expect(getConfigValue('apiKey')).toBe(testKey);

      // Delete it
      deleteConfigValue('apiKey');

      // Verify it's gone
      expect(getConfigValue('apiKey')).toBeUndefined();
    });
  });

  describe('config list', () => {
    it('should list all config values', () => {
      // Set some test values
      setConfigValue('apiKey', 'list-test-key');
      setConfigValue('defaultFormat', 'json');

      const config = getAllConfig();

      expect(config).toBeDefined();
      expect(typeof config).toBe('object');
      expect(config.apiKey).toBe('list-test-key');
      expect(config.defaultFormat).toBe('json');

      // Cleanup
      deleteConfigValue('defaultFormat');
    });

    it('should return empty values for unset config', () => {
      // Ensure clean state
      deleteConfigValue('apiKey');
      deleteConfigValue('baseUrl');
      deleteConfigValue('defaultFormat');

      const config = getAllConfig();

      expect(config).toBeDefined();
      // Values should be undefined or empty
      expect(config.apiKey).toBeUndefined();
    });
  });
});
