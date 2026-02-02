/**
 * Command: rws scrape extract
 * Extracts links from a URL
 */

import { Command } from 'commander';
import { apiPost, createApiClient } from '../../lib/api-client-http-requests.js';
import { resolveApiKey } from '../../lib/auth-api-key-resolver.js';
import { handleCliError } from '../../lib/error-handling-utilities.js';
import { printOutput, type OutputOptions } from '../../lib/output-formatter-display.js';
import { withSpinner } from '../../lib/spinner-progress-indicator.js';
import type { ExtractedLinks } from '../../types/api-response-types.js';

interface ExtractLinksOptions extends OutputOptions {
  apiKey?: string;
  type?: string;
  maxLinks?: string;
  delayAfterLoad?: string;
  getStatusCode?: boolean;
  autoScrapeInternalLinks?: boolean;
}

export const scrapeExtractLinksCommand = new Command('extract')
  .description('Extract links from a URL')
  .requiredOption('--url <url>', 'URL to extract links from')
  .option('--type <type>', 'Type of links: web, image, file, all', 'all')
  .option('--max-links <number>', 'Maximum links to return')
  .option('--delay-after-load <ms>', 'Delay after page load (ms)')
  .option('--get-status-code', 'Get HTTP status codes for each link')
  .option('--auto-scrape-internal-links', 'Auto scrape internal links')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: ExtractLinksOptions & { url: string }) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const params = new URLSearchParams();
      params.append('url', options.url);

      const requestBody = {
        type: options.type,
        maxLinks: options.maxLinks ? parseInt(options.maxLinks, 10) : undefined,
        delayAfterLoad: options.delayAfterLoad
          ? parseInt(options.delayAfterLoad, 10)
          : undefined,
        getStatusCode: options.getStatusCode,
        autoScrapeInternalLinks: options.autoScrapeInternalLinks,
      };

      const result = await withSpinner(
        `Extracting links from ${options.url}...`,
        () => apiPost<ExtractedLinks>(`/scrape/links-map?${params.toString()}`, requestBody),
        'Link extraction complete'
      );

      printOutput(result, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });
