#!/usr/bin/env node
/**
 * rws - ReviewWeb.site CLI
 * Command-line interface for ReviewWeb.site API
 */

import { Command } from 'commander';
import { reviewCommand } from './commands/review/index.js';
import { convertCommand } from './commands/convert/index.js';
import { extractCommand } from './commands/extract/index.js';
import { scrapeCommand } from './commands/scrape/index.js';
import { summarizeCommand } from './commands/summarize/index.js';
import { seoCommand } from './commands/seo/index.js';
import { apiKeyCommand } from './commands/api-key/index.js';
import { screenshotCommand } from './commands/screenshot-capture-url-command.js';
import { urlCheckCommand } from './commands/url-check-is-alive-command.js';
import { profileCommand } from './commands/profile-get-current-user-command.js';
import { healthCommand } from './commands/health-check-api-status-command.js';
import { configCommand } from './commands/config-manage-settings-command.js';
import { completionCommand } from './commands/completion-shell-autocomplete-command.js';

const program = new Command();

program
  .name('rws')
  .description('CLI tool for ReviewWeb.site API - website reviews, scraping, SEO insights')
  .version('1.0.0')
  .addCommand(reviewCommand)
  .addCommand(convertCommand)
  .addCommand(extractCommand)
  .addCommand(scrapeCommand)
  .addCommand(summarizeCommand)
  .addCommand(seoCommand)
  .addCommand(apiKeyCommand)
  .addCommand(screenshotCommand)
  .addCommand(urlCheckCommand)
  .addCommand(profileCommand)
  .addCommand(healthCommand)
  .addCommand(configCommand)
  .addCommand(completionCommand);

program.parse();
