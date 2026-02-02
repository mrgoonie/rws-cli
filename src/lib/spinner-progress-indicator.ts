/**
 * Spinner and progress indicator for long-running operations
 */

import ora, { type Ora } from 'ora';

let currentSpinner: Ora | null = null;

/**
 * Start a spinner with a message
 */
export function startSpinner(message: string): Ora {
  stopSpinner(); // Stop any existing spinner
  currentSpinner = ora(message).start();
  return currentSpinner;
}

/**
 * Update the spinner text
 */
export function updateSpinner(message: string): void {
  if (currentSpinner) {
    currentSpinner.text = message;
  }
}

/**
 * Stop the spinner with success
 */
export function succeedSpinner(message?: string): void {
  if (currentSpinner) {
    currentSpinner.succeed(message);
    currentSpinner = null;
  }
}

/**
 * Stop the spinner with failure
 */
export function failSpinner(message?: string): void {
  if (currentSpinner) {
    currentSpinner.fail(message);
    currentSpinner = null;
  }
}

/**
 * Stop the spinner without changing state
 */
export function stopSpinner(): void {
  if (currentSpinner) {
    currentSpinner.stop();
    currentSpinner = null;
  }
}

/**
 * Run an async function with a spinner
 */
export async function withSpinner<T>(
  message: string,
  fn: () => Promise<T>,
  successMessage?: string
): Promise<T> {
  const spinner = startSpinner(message);
  try {
    const result = await fn();
    spinner.succeed(successMessage || message);
    return result;
  } catch (error) {
    spinner.fail();
    throw error;
  }
}
