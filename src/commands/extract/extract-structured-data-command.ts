/**
 * Command: rws extract data
 * Extracts structured data from a URL using AI
 */

import { Command } from 'commander';
import { apiPost, createApiClient } from '../../lib/api-client-http-requests.js';
import { resolveApiKey } from '../../lib/auth-api-key-resolver.js';
import { handleCliError } from '../../lib/error-handling-utilities.js';
import { printOutput, type OutputOptions } from '../../lib/output-formatter-display.js';
import { withSpinner } from '../../lib/spinner-progress-indicator.js';
import type { ExtractedData } from '../../types/api-response-types.js';

interface ExtractDataOptions extends OutputOptions {
  apiKey?: string;
  instructions: string;
  template: string;
  systemPrompt?: string;
  model?: string;
  delayAfterLoad?: string;
  recursive?: boolean;
}

export const extractDataCommand = new Command('data')
  .description('Extract structured data from a URL using AI')
  .requiredOption('--url <url>', 'URL to extract data from')
  .requiredOption('--instructions <text>', 'Instructions for extraction')
  .requiredOption('--template <json>', 'JSON template for output structure')
  .option('--system-prompt <text>', 'System prompt for AI')
  .option('--model <model>', 'AI model to use')
  .option('--delay-after-load <ms>', 'Delay after page load (ms)')
  .option('--recursive', 'Recursively scrape internal links')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: ExtractDataOptions & { url: string }) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const requestBody = {
        url: options.url,
        options: {
          instructions: options.instructions,
          jsonTemplate: options.template,
          systemPrompt: options.systemPrompt,
          model: options.model,
          delayAfterLoad: options.delayAfterLoad
            ? parseInt(options.delayAfterLoad, 10)
            : undefined,
          recursive: options.recursive,
        },
      };

      const result = await withSpinner(
        `Extracting data from ${options.url}...`,
        () => apiPost<ExtractedData>('/extract', requestBody),
        'Extraction complete'
      );

      printOutput(result, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });
