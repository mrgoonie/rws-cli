/**
 * Command: rws summarize website
 * Summarizes an entire website (multiple pages) using AI
 */

import { Command } from 'commander';
import { apiPost, createApiClient } from '../../lib/api-client-http-requests.js';
import { resolveApiKey } from '../../lib/auth-api-key-resolver.js';
import { handleCliError } from '../../lib/error-handling-utilities.js';
import { printOutput, type OutputOptions } from '../../lib/output-formatter-display.js';
import { withSpinner } from '../../lib/spinner-progress-indicator.js';
import type { SummaryResponse } from '../../types/api-response-types.js';

interface SummarizeWebsiteOptions extends OutputOptions {
  apiKey?: string;
  instructions?: string;
  systemPrompt?: string;
  model?: string;
  delayAfterLoad?: string;
  maxLinks?: string;
  maxLength?: string;
  summaryFormat?: string;
}

export const summarizeWebsiteCommand = new Command('website')
  .description('Summarize an entire website using AI')
  .requiredOption('--url <url>', 'Main URL of the website')
  .option('--instructions <text>', 'Custom summarization instructions')
  .option('--system-prompt <text>', 'System prompt for AI')
  .option('--model <model>', 'AI model to use')
  .option('--delay-after-load <ms>', 'Delay after page load (ms)')
  .option('--max-links <number>', 'Maximum pages to process')
  .option('--max-length <words>', 'Maximum summary length in words')
  .option('--summary-format <format>', 'Summary format: bullet, paragraph')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: SummarizeWebsiteOptions & { url: string }) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const requestBody = {
        url: options.url,
        options: {
          instructions: options.instructions,
          systemPrompt: options.systemPrompt,
          model: options.model,
          delayAfterLoad: options.delayAfterLoad
            ? parseInt(options.delayAfterLoad, 10)
            : undefined,
          maxLinks: options.maxLinks ? parseInt(options.maxLinks, 10) : undefined,
          maxLength: options.maxLength ? parseInt(options.maxLength, 10) : undefined,
          format: options.summaryFormat as 'bullet' | 'paragraph' | undefined,
        },
      };

      const result = await withSpinner(
        `Summarizing website ${options.url}...`,
        () => apiPost<SummaryResponse>('/summarize/website', requestBody),
        'Website summarization complete'
      );

      printOutput(result, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });
