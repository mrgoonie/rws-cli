/**
 * Command: rws api-key list
 * Lists all API keys
 */

import { Command } from 'commander';
import { apiGet, createApiClient } from '../../lib/api-client-http-requests.js';
import { resolveApiKey } from '../../lib/auth-api-key-resolver.js';
import { handleCliError } from '../../lib/error-handling-utilities.js';
import { printOutput, type OutputOptions } from '../../lib/output-formatter-display.js';
import { withSpinner } from '../../lib/spinner-progress-indicator.js';
import type { ApiKeyInfo } from '../../types/api-response-types.js';

interface ListApiKeysOptions extends OutputOptions {
  apiKey?: string;
}

export const listApiKeysCommand = new Command('list')
  .description('List all API keys')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: ListApiKeysOptions) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const result = await withSpinner(
        'Fetching API keys...',
        () => apiGet<ApiKeyInfo[]>('/api_key'),
        'API keys fetched successfully'
      );

      printOutput(result, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });
