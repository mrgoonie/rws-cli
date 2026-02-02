/**
 * Command: rws api-key create
 * Creates a new API key
 */

import { Command } from 'commander';
import { apiPost, createApiClient } from '../../lib/api-client-http-requests.js';
import { resolveApiKey } from '../../lib/auth-api-key-resolver.js';
import { handleCliError } from '../../lib/error-handling-utilities.js';
import { printOutput, type OutputOptions } from '../../lib/output-formatter-display.js';
import { withSpinner } from '../../lib/spinner-progress-indicator.js';
import type { ApiKeyInfo } from '../../types/api-response-types.js';

interface CreateApiKeyOptions extends OutputOptions {
  apiKey?: string;
  expires?: string;
}

export const createApiKeyCommand = new Command('create')
  .description('Create a new API key')
  .requiredOption('--name <name>', 'Name for the API key')
  .option('--expires <date>', 'Expiration date (ISO format)')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: CreateApiKeyOptions & { name: string }) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const requestBody = {
        name: options.name,
        expiresAt: options.expires,
      };

      const result = await withSpinner(
        `Creating API key "${options.name}"...`,
        () => apiPost<ApiKeyInfo>('/api_key', requestBody),
        'API key created successfully'
      );

      printOutput(result, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });
