/**
 * Command: rws config
 * Manages CLI configuration settings
 */

import { Command } from 'commander';
import {
  getConfigValue,
  setConfigValue,
  deleteConfigValue,
  getConfigPath,
  getAllConfig,
} from '../config/config-manager.js';
import { type OutputFormat, OUTPUT_FORMATS } from '../config/constants.js';
import { handleCliError, ValidationError } from '../lib/error-handling-utilities.js';
import { printOutput, printSuccess, printInfo } from '../lib/output-formatter-display.js';

const configCommand = new Command('config').description('Manage CLI configuration');

configCommand
  .command('set')
  .description('Set a configuration value')
  .argument('<key>', 'Configuration key (api-key, base-url, default-format)')
  .argument('<value>', 'Value to set')
  .action((key: string, value: string) => {
    try {
      switch (key) {
        case 'api-key':
          setConfigValue('apiKey', value);
          printSuccess('API key saved');
          break;
        case 'base-url':
          setConfigValue('baseUrl', value);
          printSuccess(`Base URL set to ${value}`);
          break;
        case 'default-format':
          if (!OUTPUT_FORMATS.includes(value as OutputFormat)) {
            throw new ValidationError(
              `Invalid format. Use: ${OUTPUT_FORMATS.join(', ')}`,
              'default-format'
            );
          }
          setConfigValue('defaultFormat', value as OutputFormat);
          printSuccess(`Default format set to ${value}`);
          break;
        default:
          throw new ValidationError(
            `Unknown key: ${key}. Valid keys: api-key, base-url, default-format`,
            key
          );
      }
    } catch (error) {
      handleCliError(error);
    }
  });

configCommand
  .command('get')
  .description('Get a configuration value')
  .argument('<key>', 'Configuration key (api-key, base-url, default-format)')
  .action((key: string) => {
    try {
      let value: string | undefined;
      switch (key) {
        case 'api-key':
          value = getConfigValue('apiKey');
          if (value) {
            // Mask the API key for security
            const masked = value.slice(0, 8) + '...' + value.slice(-4);
            console.log(masked);
          } else {
            printInfo('API key not set');
          }
          break;
        case 'base-url':
          value = getConfigValue('baseUrl');
          console.log(value || '(default: https://reviewweb.site/api/v1)');
          break;
        case 'default-format':
          value = getConfigValue('defaultFormat');
          console.log(value || 'json');
          break;
        default:
          throw new ValidationError(
            `Unknown key: ${key}. Valid keys: api-key, base-url, default-format`,
            key
          );
      }
    } catch (error) {
      handleCliError(error);
    }
  });

configCommand
  .command('delete')
  .description('Delete a configuration value')
  .argument('<key>', 'Configuration key to delete')
  .action((key: string) => {
    try {
      switch (key) {
        case 'api-key':
          deleteConfigValue('apiKey');
          printSuccess('API key deleted');
          break;
        case 'base-url':
          deleteConfigValue('baseUrl');
          printSuccess('Base URL reset to default');
          break;
        case 'default-format':
          deleteConfigValue('defaultFormat');
          printSuccess('Default format reset');
          break;
        default:
          throw new ValidationError(
            `Unknown key: ${key}. Valid keys: api-key, base-url, default-format`,
            key
          );
      }
    } catch (error) {
      handleCliError(error);
    }
  });

configCommand
  .command('list')
  .description('List all configuration values')
  .option('--format <format>', 'Output format: json, table, raw')
  .action((options: { format?: OutputFormat }) => {
    try {
      const config = getAllConfig();
      // Mask API key in output
      const safeConfig = {
        ...config,
        apiKey: config.apiKey
          ? config.apiKey.slice(0, 8) + '...' + config.apiKey.slice(-4)
          : undefined,
      };
      printOutput(safeConfig, { format: options.format });
    } catch (error) {
      handleCliError(error);
    }
  });

configCommand
  .command('path')
  .description('Show configuration file path')
  .action(() => {
    console.log(getConfigPath());
  });

export { configCommand };
