/**
 * API key authentication resolver
 * Resolves API key from flag, environment variable, or config file
 */

import { getConfigValue } from '../config/config-manager.js';
import { ENV_API_KEY } from '../config/constants.js';
import { AuthError } from './error-handling-utilities.js';

export interface AuthOptions {
  apiKey?: string;
}

/**
 * Resolve API key from multiple sources with priority:
 * 1. --api-key flag (highest priority)
 * 2. RWEB_API_KEY environment variable
 * 3. Config file ~/.config/rws/config.json (lowest priority)
 */
export function resolveApiKey(options?: AuthOptions): string {
  // Priority 1: Command line flag
  if (options?.apiKey) {
    return options.apiKey;
  }

  // Priority 2: Environment variable
  const envKey = process.env[ENV_API_KEY];
  if (envKey) {
    return envKey;
  }

  // Priority 3: Config file
  const configKey = getConfigValue('apiKey');
  if (configKey) {
    return configKey;
  }

  throw new AuthError(
    `API key not found. Set it using one of:\n` +
      `  1. --api-key flag\n` +
      `  2. ${ENV_API_KEY} environment variable\n` +
      `  3. rws config set api-key <your-key>`
  );
}

/**
 * Check if API key is available without throwing
 */
export function hasApiKey(options?: AuthOptions): boolean {
  try {
    resolveApiKey(options);
    return true;
  } catch {
    return false;
  }
}
