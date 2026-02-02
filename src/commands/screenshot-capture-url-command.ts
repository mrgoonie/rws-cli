/**
 * Command: rws screenshot
 * Takes a screenshot of a URL
 */

import { Command } from 'commander';
import { apiPost, createApiClient } from '../lib/api-client-http-requests.js';
import { resolveApiKey } from '../lib/auth-api-key-resolver.js';
import { handleCliError } from '../lib/error-handling-utilities.js';
import { printOutput, type OutputOptions } from '../lib/output-formatter-display.js';
import { withSpinner } from '../lib/spinner-progress-indicator.js';
import type { ScreenshotResponse } from '../types/api-response-types.js';

interface ScreenshotOptions extends OutputOptions {
  apiKey?: string;
  width?: string;
  height?: string;
  fullPage?: boolean;
  delay?: string;
}

export const screenshotCommand = new Command('screenshot')
  .description('Take a screenshot of a URL')
  .requiredOption('--url <url>', 'URL to screenshot')
  .option('--width <pixels>', 'Viewport width')
  .option('--height <pixels>', 'Viewport height')
  .option('--full-page', 'Capture full page')
  .option('--delay <ms>', 'Delay before capture (ms)')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: ScreenshotOptions & { url: string }) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const requestBody = {
        url: options.url,
        options: {
          width: options.width ? parseInt(options.width, 10) : undefined,
          height: options.height ? parseInt(options.height, 10) : undefined,
          fullPage: options.fullPage,
          delay: options.delay ? parseInt(options.delay, 10) : undefined,
        },
      };

      const result = await withSpinner(
        `Taking screenshot of ${options.url}...`,
        () => apiPost<ScreenshotResponse>('/screenshot', requestBody),
        'Screenshot captured'
      );

      printOutput(result, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });
