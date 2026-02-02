/**
 * Command: rws convert markdown
 * Converts a URL to markdown using AI
 */

import { Command } from 'commander';
import { apiPost, createApiClient } from '../../lib/api-client-http-requests.js';
import { resolveApiKey } from '../../lib/auth-api-key-resolver.js';
import { handleCliError } from '../../lib/error-handling-utilities.js';
import { printOutput, type OutputOptions } from '../../lib/output-formatter-display.js';
import { withSpinner } from '../../lib/spinner-progress-indicator.js';
import type { MarkdownConversionResponse } from '../../types/api-response-types.js';

interface ConvertMarkdownOptions extends OutputOptions {
  apiKey?: string;
  model?: string;
  instructions?: string;
  delayAfterLoad?: string;
}

export const convertMarkdownCommand = new Command('markdown')
  .description('Convert a URL to markdown using AI')
  .requiredOption('--url <url>', 'URL to convert')
  .option('--model <model>', 'AI model to use')
  .option('--instructions <text>', 'Custom conversion instructions')
  .option('--delay-after-load <ms>', 'Delay after page load (ms)')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: ConvertMarkdownOptions & { url: string }) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const requestBody = {
        url: options.url,
        options: {
          model: options.model,
          instructions: options.instructions,
          delayAfterLoad: options.delayAfterLoad
            ? parseInt(options.delayAfterLoad, 10)
            : undefined,
        },
      };

      const result = await withSpinner(
        `Converting ${options.url} to markdown...`,
        () => apiPost<MarkdownConversionResponse>('/convert/markdown', requestBody),
        'Conversion complete'
      );

      printOutput(result, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });
