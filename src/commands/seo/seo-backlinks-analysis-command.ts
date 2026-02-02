/**
 * Command: rws seo backlinks
 * Gets backlinks for a domain
 */

import { Command } from 'commander';
import { apiPost, createApiClient } from '../../lib/api-client-http-requests.js';
import { resolveApiKey } from '../../lib/auth-api-key-resolver.js';
import { handleCliError } from '../../lib/error-handling-utilities.js';
import { printOutput, type OutputOptions } from '../../lib/output-formatter-display.js';
import { withSpinner } from '../../lib/spinner-progress-indicator.js';
import type { BacklinksResponse } from '../../types/api-response-types.js';

interface BacklinksOptions extends OutputOptions {
  apiKey?: string;
}

export const seoBacklinksCommand = new Command('backlinks')
  .description('Get backlinks for a domain')
  .requiredOption('--domain <domain>', 'Domain to analyze')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: BacklinksOptions & { domain: string }) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const result = await withSpinner(
        `Fetching backlinks for ${options.domain}...`,
        () => apiPost<BacklinksResponse>('/seo-insights/backlinks', { domain: options.domain }),
        'Backlinks fetched successfully'
      );

      printOutput(result, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });
