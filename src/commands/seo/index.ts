/**
 * SEO commands group
 * rws seo <subcommand>
 */

import { Command } from 'commander';
import { seoBacklinksCommand } from './seo-backlinks-analysis-command.js';
import { seoKeywordIdeasCommand } from './seo-keyword-ideas-command.js';
import { seoKeywordDifficultyCommand } from './seo-keyword-difficulty-command.js';
import { seoTrafficCommand } from './seo-traffic-analysis-command.js';

export const seoCommand = new Command('seo')
  .description('SEO insights and analysis')
  .addCommand(seoBacklinksCommand)
  .addCommand(seoKeywordIdeasCommand)
  .addCommand(seoKeywordDifficultyCommand)
  .addCommand(seoTrafficCommand);
