/**
 * Convert commands group
 * rws convert <subcommand>
 */

import { Command } from 'commander';
import { convertMarkdownCommand } from './convert-url-to-markdown-command.js';
import { convertMarkdownBatchCommand } from './convert-batch-urls-to-markdown-command.js';

export const convertCommand = new Command('convert')
  .description('Convert web content to different formats')
  .addCommand(convertMarkdownCommand)
  .addCommand(convertMarkdownBatchCommand);
