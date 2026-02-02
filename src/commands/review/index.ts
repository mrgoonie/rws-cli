/**
 * Review commands group
 * rws review <subcommand>
 */

import { Command } from 'commander';
import { createReviewCommand } from './review-create-command.js';
import { getReviewCommand } from './review-get-by-id-command.js';
import { listReviewsCommand } from './review-list-all-command.js';
import { updateReviewCommand } from './review-update-by-id-command.js';
import { deleteReviewCommand } from './review-delete-by-id-command.js';

export const reviewCommand = new Command('review')
  .description('Manage website reviews')
  .addCommand(createReviewCommand)
  .addCommand(getReviewCommand)
  .addCommand(listReviewsCommand)
  .addCommand(updateReviewCommand)
  .addCommand(deleteReviewCommand);
