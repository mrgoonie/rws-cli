/**
 * Command: rws scrape url
 * Scrapes a URL and returns its content
 */

import { Command } from 'commander';
import { apiPost, createApiClient } from '../../lib/api-client-http-requests.js';
import { resolveApiKey } from '../../lib/auth-api-key-resolver.js';
import { handleCliError } from '../../lib/error-handling-utilities.js';
import { printOutput, type OutputOptions } from '../../lib/output-formatter-display.js';
import { withSpinner } from '../../lib/spinner-progress-indicator.js';
import type { ScrapedContent } from '../../types/api-response-types.js';

interface ScrapeUrlOptions extends OutputOptions {
  apiKey?: string;
  delayAfterLoad?: string;
}

export const scrapeUrlCommand = new Command('url')
  .description('Scrape a URL and return its content')
  .requiredOption('--url <url>', 'URL to scrape')
  .option('--delay-after-load <ms>', 'Delay after page load (ms)')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: ScrapeUrlOptions & { url: string }) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const params = new URLSearchParams();
      params.append('url', options.url);

      const requestBody = {
        options: {
          delayAfterLoad: options.delayAfterLoad
            ? parseInt(options.delayAfterLoad, 10)
            : undefined,
        },
      };

      const result = await withSpinner(
        `Scraping ${options.url}...`,
        () => apiPost<ScrapedContent>(`/scrape?${params.toString()}`, requestBody),
        'Scraping complete'
      );

      printOutput(result, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });
