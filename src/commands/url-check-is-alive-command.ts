/**
 * Command: rws url-check
 * Checks if a URL is alive
 */

import { Command } from 'commander';
import { apiGet, createApiClient } from '../lib/api-client-http-requests.js';
import { resolveApiKey } from '../lib/auth-api-key-resolver.js';
import { handleCliError } from '../lib/error-handling-utilities.js';
import { printOutput, type OutputOptions } from '../lib/output-formatter-display.js';
import { withSpinner } from '../lib/spinner-progress-indicator.js';
import type { UrlCheckResponse } from '../types/api-response-types.js';

interface UrlCheckOptions extends OutputOptions {
  apiKey?: string;
  timeout?: string;
  proxyUrl?: string;
}

export const urlCheckCommand = new Command('url-check')
  .description('Check if a URL is alive')
  .requiredOption('--url <url>', 'URL to check')
  .option('--timeout <ms>', 'Request timeout (ms)', '10000')
  .option('--proxy-url <url>', 'Proxy URL to use')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: UrlCheckOptions & { url: string }) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const params = new URLSearchParams();
      params.append('url', options.url);
      if (options.timeout) params.append('timeout', options.timeout);
      if (options.proxyUrl) params.append('proxyUrl', options.proxyUrl);

      const result = await withSpinner(
        `Checking ${options.url}...`,
        () => apiGet<UrlCheckResponse>(`/url/is-alive?${params.toString()}`),
        'URL check complete'
      );

      printOutput(result, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });
