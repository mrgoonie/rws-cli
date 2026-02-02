/**
 * Command: rws review list
 * Lists all reviews with pagination
 */

import { Command } from 'commander';
import { apiGet, createApiClient } from '../../lib/api-client-http-requests.js';
import { resolveApiKey } from '../../lib/auth-api-key-resolver.js';
import { handleCliError } from '../../lib/error-handling-utilities.js';
import { printOutput, type OutputOptions } from '../../lib/output-formatter-display.js';
import { withSpinner } from '../../lib/spinner-progress-indicator.js';
import type { ReviewListResponse } from '../../types/api-response-types.js';

interface ListReviewsOptions extends OutputOptions {
  apiKey?: string;
  page?: string;
  limit?: string;
}

export const listReviewsCommand = new Command('list')
  .description('List all reviews')
  .option('--page <number>', 'Page number', '1')
  .option('--limit <number>', 'Items per page', '10')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: ListReviewsOptions) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);

      const result = await withSpinner(
        'Fetching reviews...',
        () => apiGet<ReviewListResponse>(`/review?${params.toString()}`),
        'Reviews fetched successfully'
      );

      printOutput(result, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });
