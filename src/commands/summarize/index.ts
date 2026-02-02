/**
 * Summarize commands group
 * rws summarize <subcommand>
 */

import { Command } from 'commander';
import { summarizeUrlCommand } from './summarize-single-url-command.js';
import { summarizeWebsiteCommand } from './summarize-entire-website-command.js';

export const summarizeCommand = new Command('summarize')
  .description('Summarize web content using AI')
  .addCommand(summarizeUrlCommand)
  .addCommand(summarizeWebsiteCommand);
