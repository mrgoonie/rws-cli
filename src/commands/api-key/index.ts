/**
 * API key commands group
 * rws api-key <subcommand>
 */

import { Command } from 'commander';
import { createApiKeyCommand } from './api-key-create-new-command.js';
import { listApiKeysCommand } from './api-key-list-all-command.js';
import { deleteApiKeyCommand } from './api-key-delete-by-id-command.js';

export const apiKeyCommand = new Command('api-key')
  .description('Manage API keys')
  .addCommand(createApiKeyCommand)
  .addCommand(listApiKeysCommand)
  .addCommand(deleteApiKeyCommand);
