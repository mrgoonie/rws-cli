/**
 * Command: rws seo keyword-difficulty
 * Gets keyword difficulty score for a keyword
 */

import { Command } from 'commander';
import { apiPost, createApiClient } from '../../lib/api-client-http-requests.js';
import { resolveApiKey } from '../../lib/auth-api-key-resolver.js';
import { handleCliError } from '../../lib/error-handling-utilities.js';
import { printOutput, type OutputOptions } from '../../lib/output-formatter-display.js';
import { withSpinner } from '../../lib/spinner-progress-indicator.js';
import type { KeywordDifficultyResponse } from '../../types/api-response-types.js';

interface KeywordDifficultyOptions extends OutputOptions {
  apiKey?: string;
  country?: string;
}

export const seoKeywordDifficultyCommand = new Command('keyword-difficulty')
  .description('Get keyword difficulty score')
  .requiredOption('--keyword <keyword>', 'Keyword to analyze')
  .option('--country <code>', 'Country code (e.g., us, uk)', 'us')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: KeywordDifficultyOptions & { keyword: string }) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const requestBody = {
        keyword: options.keyword,
        country: options.country,
      };

      const result = await withSpinner(
        `Analyzing keyword difficulty for "${options.keyword}"...`,
        () => apiPost<KeywordDifficultyResponse>('/seo-insights/keyword-difficulty', requestBody),
        'Keyword difficulty analyzed'
      );

      printOutput(result, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });
