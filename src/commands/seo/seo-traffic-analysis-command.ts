/**
 * Command: rws seo traffic
 * Gets traffic analysis for a domain
 */

import { Command } from 'commander';
import { apiPost, createApiClient } from '../../lib/api-client-http-requests.js';
import { resolveApiKey } from '../../lib/auth-api-key-resolver.js';
import { handleCliError } from '../../lib/error-handling-utilities.js';
import { printOutput, type OutputOptions } from '../../lib/output-formatter-display.js';
import { withSpinner } from '../../lib/spinner-progress-indicator.js';
import type { TrafficResponse } from '../../types/api-response-types.js';

interface TrafficOptions extends OutputOptions {
  apiKey?: string;
  mode?: string;
  country?: string;
}

export const seoTrafficCommand = new Command('traffic')
  .description('Get traffic analysis for a domain')
  .requiredOption('--domain <domain>', 'Domain or URL to analyze')
  .option('--mode <mode>', 'Mode: subdomains, exact', 'subdomains')
  .option('--country <code>', 'Country code (e.g., us, uk)')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: TrafficOptions & { domain: string }) => {
    try {
      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const requestBody = {
        domainOrUrl: options.domain,
        mode: options.mode as 'subdomains' | 'exact',
        country: options.country,
      };

      const result = await withSpinner(
        `Analyzing traffic for ${options.domain}...`,
        () => apiPost<TrafficResponse>('/seo-insights/traffic', requestBody),
        'Traffic analysis complete'
      );

      printOutput(result, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });
