/**
 * Scrape commands group
 * rws scrape <subcommand>
 */

import { Command } from 'commander';
import { scrapeUrlCommand } from './scrape-url-content-command.js';
import { scrapeExtractLinksCommand } from './scrape-extract-links-command.js';

export const scrapeCommand = new Command('scrape')
  .description('Scrape web content and extract data')
  .addCommand(scrapeUrlCommand)
  .addCommand(scrapeExtractLinksCommand);
