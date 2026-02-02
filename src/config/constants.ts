/**
 * CLI constants for ReviewWeb.site CLI
 */

export const API_BASE_URL = 'https://reviewweb.site/api/v1';
export const CONFIG_FILE_NAME = 'rws-config';
export const ENV_API_KEY = 'RWEB_API_KEY';
export const DEFAULT_OUTPUT_FORMAT = 'json';

export const EXIT_CODES = {
  SUCCESS: 0,
  ERROR: 1,
  AUTH_ERROR: 2,
} as const;

export const OUTPUT_FORMATS = ['json', 'table', 'raw'] as const;
export type OutputFormat = (typeof OUTPUT_FORMATS)[number];
