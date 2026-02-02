/**
 * Command: rws convert markdown-batch
 * Converts multiple URLs to markdown using AI
 */

import { Command } from 'commander';
import { apiPost, createApiClient } from '../../lib/api-client-http-requests.js';
import { resolveApiKey } from '../../lib/auth-api-key-resolver.js';
import { handleCliError } from '../../lib/error-handling-utilities.js';
import { printOutput, type OutputOptions } from '../../lib/output-formatter-display.js';
import { withSpinner } from '../../lib/spinner-progress-indicator.js';
import type { MarkdownConversionResponse } from '../../types/api-response-types.js';

interface ConvertBatchOptions extends OutputOptions {
  apiKey?: string;
  model?: string;
  instructions?: string;
  delayAfterLoad?: string;
  maxLinks?: string;
}

export const convertMarkdownBatchCommand = new Command('markdown-batch')
  .description('Convert multiple URLs to markdown using AI')
  .requiredOption('--urls <urls>', 'Comma-separated URLs to convert')
  .option('--model <model>', 'AI model to use')
  .option('--instructions <text>', 'Custom conversion instructions')
  .option('--delay-after-load <ms>', 'Delay after page load (ms)')
  .option('--max-links <number>', 'Maximum URLs to process')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: ConvertBatchOptions & { urls: string }) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const urls = options.urls.split(',').map((u) => u.trim());

      const requestBody = {
        urls,
        options: {
          model: options.model,
          instructions: options.instructions,
          delayAfterLoad: options.delayAfterLoad
            ? parseInt(options.delayAfterLoad, 10)
            : undefined,
          maxLinks: options.maxLinks ? parseInt(options.maxLinks, 10) : undefined,
        },
      };

      const result = await withSpinner(
        `Converting ${urls.length} URLs to markdown...`,
        () => apiPost<MarkdownConversionResponse[]>('/convert/markdown/urls', requestBody),
        'Conversion complete'
      );

      printOutput(result, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });
