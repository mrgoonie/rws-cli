/**
 * Command: rws seo keyword-ideas
 * Gets keyword ideas for a seed keyword
 */

import { Command } from 'commander';
import { apiPost, createApiClient } from '../../lib/api-client-http-requests.js';
import { resolveApiKey } from '../../lib/auth-api-key-resolver.js';
import { handleCliError } from '../../lib/error-handling-utilities.js';
import { printOutput, type OutputOptions } from '../../lib/output-formatter-display.js';
import { withSpinner } from '../../lib/spinner-progress-indicator.js';
import type { KeywordIdeasResponse } from '../../types/api-response-types.js';

interface KeywordIdeasOptions extends OutputOptions {
  apiKey?: string;
  country?: string;
  searchEngine?: string;
}

export const seoKeywordIdeasCommand = new Command('keyword-ideas')
  .description('Get keyword ideas for a seed keyword')
  .requiredOption('--keyword <keyword>', 'Seed keyword')
  .option('--country <code>', 'Country code (e.g., us, uk)', 'us')
  .option('--search-engine <engine>', 'Search engine (e.g., Google)', 'Google')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: KeywordIdeasOptions & { keyword: string }) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const requestBody = {
        keyword: options.keyword,
        country: options.country,
        searchEngine: options.searchEngine,
      };

      const result = await withSpinner(
        `Fetching keyword ideas for "${options.keyword}"...`,
        () => apiPost<KeywordIdeasResponse>('/seo-insights/keyword-ideas', requestBody),
        'Keyword ideas fetched successfully'
      );

      printOutput(result, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });
