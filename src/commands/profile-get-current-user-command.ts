/**
 * Command: rws profile
 * Gets the current user's profile
 */

import { Command } from 'commander';
import { apiGet, createApiClient } from '../lib/api-client-http-requests.js';
import { resolveApiKey } from '../lib/auth-api-key-resolver.js';
import { handleCliError } from '../lib/error-handling-utilities.js';
import { printOutput, type OutputOptions } from '../lib/output-formatter-display.js';
import { withSpinner } from '../lib/spinner-progress-indicator.js';
import type { ProfileResponse } from '../types/api-response-types.js';

interface ProfileOptions extends OutputOptions {
  apiKey?: string;
}

export const profileCommand = new Command('profile')
  .description('Get current user profile and usage')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: ProfileOptions) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const result = await withSpinner(
        'Fetching profile...',
        () => apiGet<ProfileResponse>('/profile'),
        'Profile fetched'
      );

      printOutput(result, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });
