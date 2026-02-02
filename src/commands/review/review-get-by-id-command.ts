/**
 * Command: rws review get <id>
 * Gets a specific review by ID
 */

import { Command } from 'commander';
import { apiGet, createApiClient } from '../../lib/api-client-http-requests.js';
import { resolveApiKey } from '../../lib/auth-api-key-resolver.js';
import { handleCliError } from '../../lib/error-handling-utilities.js';
import { printOutput, type OutputOptions } from '../../lib/output-formatter-display.js';
import { withSpinner } from '../../lib/spinner-progress-indicator.js';
import type { Review } from '../../types/api-response-types.js';

interface GetReviewOptions extends OutputOptions {
  apiKey?: string;
}

export const getReviewCommand = new Command('get')
  .description('Get a review by ID')
  .argument('<id>', 'Review ID')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (id: string, options: GetReviewOptions) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const result = await withSpinner(
        `Fetching review ${id}...`,
        () => apiGet<Review>(`/review/${id}`),
        'Review fetched successfully'
      );

      printOutput(result, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });
