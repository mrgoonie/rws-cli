/**
 * Error handling utilities for CLI
 * Custom error classes and error formatting
 */

import chalk from 'chalk';
import { EXIT_CODES } from '../config/constants.js';

export class ApiError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;

  constructor(message: string, code: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class AuthError extends ApiError {
  constructor(message = 'Authentication required. Please set your API key.') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthError';
  }
}

export class ValidationError extends Error {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export function formatErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const statusText = error.statusCode ? ` (HTTP ${error.statusCode})` : '';
    return `${chalk.red('Error')}: ${error.message}${statusText}`;
  }

  if (error instanceof ValidationError) {
    const fieldText = error.field ? ` [${error.field}]` : '';
    return `${chalk.red('Validation Error')}${fieldText}: ${error.message}`;
  }

  if (error instanceof Error) {
    return `${chalk.red('Error')}: ${error.message}`;
  }

  return `${chalk.red('Error')}: An unknown error occurred`;
}

export function getExitCode(error: unknown): number {
  if (error instanceof AuthError) {
    return EXIT_CODES.AUTH_ERROR;
  }
  if (error instanceof ApiError && error.code === 'AUTH_ERROR') {
    return EXIT_CODES.AUTH_ERROR;
  }
  return EXIT_CODES.ERROR;
}

export function handleCliError(error: unknown): never {
  console.error(formatErrorMessage(error));
  process.exit(getExitCode(error));
}
