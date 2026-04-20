/**
 * Tests for error handling utilities
 * Verifies custom error classes and error handling functions
 */

import { describe, it, expect } from 'vitest';
import {
  ApiError,
  AuthError,
  ValidationError,
} from '../src/lib/error-handling-utilities.js';

describe('Error Handling Utilities', () => {
  describe('ApiError', () => {
    it('should create ApiError with message and code', () => {
      const error = new ApiError('API request failed', 'API_ERROR');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe('API request failed');
      expect(error.code).toBe('API_ERROR');
    });

    it('should include status code when provided', () => {
      const error = new ApiError('Not found', 'NOT_FOUND', 404);

      expect(error.statusCode).toBe(404);
    });

    it('should have correct name property', () => {
      const error = new ApiError('Test error', 'TEST');

      expect(error.name).toBe('ApiError');
    });
  });

  describe('AuthError', () => {
    it('should create AuthError with message', () => {
      const error = new AuthError('Authentication failed');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AuthError);
      expect(error.message).toBe('Authentication failed');
    });

    it('should have correct name property', () => {
      const error = new AuthError('Test auth error');

      expect(error.name).toBe('AuthError');
    });
  });

  describe('ValidationError', () => {
    it('should create ValidationError with message and field', () => {
      const error = new ValidationError('Invalid URL format', 'url');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Invalid URL format');
      expect(error.field).toBe('url');
    });

    it('should have correct name property', () => {
      const error = new ValidationError('Test validation', 'testField');

      expect(error.name).toBe('ValidationError');
    });

    it('should work without field parameter', () => {
      const error = new ValidationError('General validation error');

      expect(error.message).toBe('General validation error');
      expect(error.field).toBeUndefined();
    });
  });
});
