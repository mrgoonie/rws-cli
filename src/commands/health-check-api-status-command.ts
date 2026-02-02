/**
 * Command: rws health
 * Checks the API health status
 */

import { Command } from 'commander';
import axios from 'axios';
import { API_BASE_URL } from '../config/constants.js';
import { handleCliError } from '../lib/error-handling-utilities.js';
import { printOutput, printSuccess, type OutputOptions } from '../lib/output-formatter-display.js';
import { withSpinner } from '../lib/spinner-progress-indicator.js';
import type { HealthResponse } from '../types/api-response-types.js';

interface HealthOptions extends OutputOptions {
  baseUrl?: string;
}

export const healthCommand = new Command('health')
  .description('Check API health status')
  .option('--base-url <url>', 'API base URL')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: HealthOptions) => {
    try {
      const baseUrl = options.baseUrl || API_BASE_URL;

      const result = await withSpinner(
        'Checking API health...',
        async () => {
          const response = await axios.get<HealthResponse>(`${baseUrl}/healthz`);
          return response.data;
        },
        'API is healthy'
      );

      printOutput(result, { format: options.format });
      printSuccess('API is operational');
    } catch (error) {
      handleCliError(error);
    }
  });
