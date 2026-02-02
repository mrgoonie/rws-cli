/**
 * Extract commands group
 * rws extract <subcommand>
 */

import { Command } from 'commander';
import { extractDataCommand } from './extract-structured-data-command.js';

export const extractCommand = new Command('extract')
  .description('Extract structured data from web content')
  .addCommand(extractDataCommand);
