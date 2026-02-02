/**
 * Configuration manager for CLI settings persistence
 * Handles reading/writing config from ~/.config/rws/config.json
 */

import Conf from 'conf';
import { CONFIG_FILE_NAME, DEFAULT_OUTPUT_FORMAT, type OutputFormat } from './constants.js';

interface ConfigSchema {
  apiKey?: string;
  baseUrl?: string;
  defaultFormat?: OutputFormat;
}

const config = new Conf<ConfigSchema>({
  projectName: CONFIG_FILE_NAME,
  defaults: {
    defaultFormat: DEFAULT_OUTPUT_FORMAT as OutputFormat,
  },
});

export function getConfigValue<K extends keyof ConfigSchema>(key: K): ConfigSchema[K] {
  return config.get(key);
}

export function setConfigValue<K extends keyof ConfigSchema>(
  key: K,
  value: ConfigSchema[K]
): void {
  config.set(key, value);
}

export function deleteConfigValue(key: keyof ConfigSchema): void {
  config.delete(key);
}

export function getConfigPath(): string {
  return config.path;
}

export function getAllConfig(): ConfigSchema {
  return config.store;
}

export function clearConfig(): void {
  config.clear();
}

export default config;
