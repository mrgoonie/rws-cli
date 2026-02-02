/**
 * Command: rws review update <id>
 * Updates an existing review
 */

import { Command } from 'commander';
import { apiPatch, createApiClient } from '../../lib/api-client-http-requests.js';
import { resolveApiKey } from '../../lib/auth-api-key-resolver.js';
import { handleCliError } from '../../lib/error-handling-utilities.js';
import { printOutput, type OutputOptions } from '../../lib/output-formatter-display.js';
import { withSpinner } from '../../lib/spinner-progress-indicator.js';
import type { Review } from '../../types/api-response-types.js';

interface UpdateReviewOptions extends OutputOptions {
  apiKey?: string;
  url?: string;
  instructions?: string;
}

export const updateReviewCommand = new Command('update')
  .description('Update an existing review')
  .argument('<id>', 'Review ID')
  .option('--url <url>', 'Updated website URL')
  .option('--instructions <text>', 'Updated review instructions')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (id: string, options: UpdateReviewOptions) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const requestBody: Record<string, unknown> = {};
      if (options.url) requestBody.url = options.url;
      if (options.instructions) requestBody.instructions = options.instructions;

      const result = await withSpinner(
        `Updating review ${id}...`,
        () => apiPatch<Review>(`/review/${id}`, requestBody),
        'Review updated successfully'
      );

      printOutput(result, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });
