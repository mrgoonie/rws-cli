/**
 * Command: rws html-to-screenshot
 * Convert HTML content or ZIP file to a screenshot image
 */

import { Command } from 'commander';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

import { apiPost, apiPostFormData, createApiClient } from '../lib/api-client-http-requests.js';
import { resolveApiKey } from '../lib/auth-api-key-resolver.js';
import { handleCliError } from '../lib/error-handling-utilities.js';
import { printOutput, printSuccess, printWarning, type OutputOptions } from '../lib/output-formatter-display.js';
import { withSpinner } from '../lib/spinner-progress-indicator.js';
import type { HtmlToScreenshotResponse } from '../types/api-response-types.js';

interface HtmlToScreenshotOptions extends OutputOptions {
  apiKey?: string;
  html?: string;
  file?: string;
  output?: string;
  outputFile?: string;
  width?: string;
  height?: string;
  fullPage?: boolean;
  type?: string;
  quality?: string;
  entryFile?: string;
  delay?: string;
}

export const htmlToScreenshotCommand = new Command('html-to-screenshot')
  .description('Convert HTML content or ZIP file to a screenshot image')
  .option('--html <html>', 'Raw HTML string to render')
  .option('--file <path>', 'Path to ZIP file containing HTML/CSS/JS/assets')
  .option('--output <type>', 'Output type: url (default) or buffer', 'url')
  .option('--output-file <path>', 'Save buffer output to file (requires --output buffer)')
  .option('--width <pixels>', 'Viewport width in pixels', '1400')
  .option('--height <pixels>', 'Viewport height in pixels', '800')
  .option('--full-page', 'Capture full page instead of viewport')
  .option('--type <format>', 'Image format: png (default) or jpeg', 'png')
  .option('--quality <number>', 'JPEG quality 1-100 (only for jpeg)')
  .option('--entry-file <filename>', 'Entry HTML file in ZIP (default: index.html)', 'index.html')
  .option('--delay <ms>', 'Delay in ms after page load before screenshot', '0')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: HtmlToScreenshotOptions) => {
    try {
      // Validate: must have --html or --file
      if (!options.html && !options.file) {
        console.error('Error: Either --html or --file is required');
        process.exit(1);
      }

      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      let result: HtmlToScreenshotResponse;

      if (options.file) {
        // --- ZIP FILE MODE ---
        const filePath = path.resolve(options.file);
        if (!fs.existsSync(filePath)) {
          console.error(`Error: File not found: ${filePath}`);
          process.exit(1);
        }

        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.append('output', options.output || 'url');
        formData.append('viewport', JSON.stringify({
          width: parseInt(options.width || '1400'),
          height: parseInt(options.height || '800'),
        }));
        if (options.fullPage) formData.append('fullPage', 'true');
        formData.append('type', options.type || 'png');
        if (options.quality) formData.append('quality', options.quality);
        formData.append('entryFile', options.entryFile || 'index.html');
        if (options.delay && options.delay !== '0') formData.append('delayAfterLoad', options.delay);

        result = await withSpinner(
          `Rendering ZIP file ${path.basename(filePath)}...`,
          () => apiPostFormData<HtmlToScreenshotResponse>('/html-to-screenshot', formData),
          'Screenshot captured from ZIP'
        );
      } else {
        // --- HTML STRING MODE ---
        const requestBody = {
          html: options.html,
          viewport: {
            width: parseInt(options.width || '1400'),
            height: parseInt(options.height || '800'),
          },
          fullPage: options.fullPage || false,
          output: options.output || 'url',
          type: options.type || 'png',
          quality: options.quality ? parseInt(options.quality) : undefined,
          delayAfterLoad: options.delay ? parseInt(options.delay) : 0,
        };

        result = await withSpinner(
          'Rendering HTML to screenshot...',
          () => apiPost<HtmlToScreenshotResponse>('/html-to-screenshot', requestBody),
          'Screenshot captured from HTML'
        );
      }

      // Warn about buffer mode limitation in CLI context
      if (options.output === 'buffer' && options.outputFile) {
        printWarning('Buffer mode with CLI saves the image URL instead. Use the URL to download.');
      }

      printOutput(result, { format: options.format });

      if (result?.data?.imageUrl) {
        printSuccess(`Image URL: ${result.data.imageUrl}`);
      }
    } catch (error) {
      handleCliError(error);
    }
  });
