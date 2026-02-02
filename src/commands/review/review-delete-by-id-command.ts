/**
 * Command: rws review delete <id>
 * Deletes a review by ID
 */

import { Command } from 'commander';
import { apiDelete, createApiClient } from '../../lib/api-client-http-requests.js';
import { resolveApiKey } from '../../lib/auth-api-key-resolver.js';
import { handleCliError } from '../../lib/error-handling-utilities.js';
import { printSuccess, type OutputOptions } from '../../lib/output-formatter-display.js';
import { withSpinner } from '../../lib/spinner-progress-indicator.js';

interface DeleteReviewOptions extends OutputOptions {
  apiKey?: string;
}

export const deleteReviewCommand = new Command('delete')
  .description('Delete a review by ID')
  .argument('<id>', 'Review ID')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .action(async (id: string, options: DeleteReviewOptions) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      await withSpinner(
        `Deleting review ${id}...`,
        () => apiDelete(`/review/${id}`),
        'Review deleted successfully'
      );

      printSuccess(`Review ${id} deleted`);
    } catch (error) {
      handleCliError(error);
    }
  });
