/**
 * Command: rws api-key delete <id>
 * Deletes an API key by ID
 */

import { Command } from 'commander';
import { apiDelete, createApiClient } from '../../lib/api-client-http-requests.js';
import { resolveApiKey } from '../../lib/auth-api-key-resolver.js';
import { handleCliError } from '../../lib/error-handling-utilities.js';
import { printSuccess, type OutputOptions } from '../../lib/output-formatter-display.js';
import { withSpinner } from '../../lib/spinner-progress-indicator.js';

interface DeleteApiKeyOptions extends OutputOptions {
  apiKey?: string;
}

export const deleteApiKeyCommand = new Command('delete')
  .description('Delete an API key by ID')
  .argument('<id>', 'API key ID')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .action(async (id: string, options: DeleteApiKeyOptions) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      await withSpinner(
        `Deleting API key ${id}...`,
        () => apiDelete(`/api_key/${id}`),
        'API key deleted successfully'
      );

      printSuccess(`API key ${id} deleted`);
    } catch (error) {
      handleCliError(error);
    }
  });
