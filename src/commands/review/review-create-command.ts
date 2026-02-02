/**
 * Command: rws review create
 * Creates a new website review
 */

import { Command } from 'commander';
import { apiPost, createApiClient } from '../../lib/api-client-http-requests.js';
import { resolveApiKey } from '../../lib/auth-api-key-resolver.js';
import { handleCliError } from '../../lib/error-handling-utilities.js';
import { printOutput, type OutputOptions } from '../../lib/output-formatter-display.js';
import { withSpinner } from '../../lib/spinner-progress-indicator.js';
import type { Review } from '../../types/api-response-types.js';

interface CreateReviewOptions extends OutputOptions {
  apiKey?: string;
  instructions?: string;
  skipImageExtraction?: boolean;
  skipLinkExtraction?: boolean;
  maxExtractedImages?: string;
  maxExtractedLinks?: string;
  textModel?: string;
  visionModel?: string;
}

export const createReviewCommand = new Command('create')
  .description('Create a new website review')
  .requiredOption('--url <url>', 'Website URL to review')
  .option('--instructions <text>', 'Custom review instructions')
  .option('--skip-image-extraction', 'Skip extracting images')
  .option('--skip-link-extraction', 'Skip extracting links')
  .option('--max-extracted-images <number>', 'Maximum images to extract')
  .option('--max-extracted-links <number>', 'Maximum links to extract')
  .option('--text-model <model>', 'Text model for AI analysis')
  .option('--vision-model <model>', 'Vision model for AI analysis')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: CreateReviewOptions & { url: string }) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const requestBody = {
        url: options.url,
        instructions: options.instructions,
        skipImageExtraction: options.skipImageExtraction,
        skipLinkExtraction: options.skipLinkExtraction,
        maxExtractedImages: options.maxExtractedImages
          ? parseInt(options.maxExtractedImages, 10)
          : undefined,
        maxExtractedLinks: options.maxExtractedLinks
          ? parseInt(options.maxExtractedLinks, 10)
          : undefined,
        textModel: options.textModel,
        visionModel: options.visionModel,
      };

      const result = await withSpinner(
        `Creating review for ${options.url}...`,
        () => apiPost<Review>('/review', requestBody),
        'Review created successfully'
      );

      printOutput(result, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });
