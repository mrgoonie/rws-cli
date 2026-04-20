/**
 * Command: rws html-to-screenshot
 * Convert HTML content, HTML file, directory, or ZIP archive to a screenshot.
 *
 * --file auto-detects input type:
 *   - .zip         → uploaded directly
 *   - .html/.htm   → content read and rendered as raw HTML
 *   - directory    → zipped on-the-fly (entry defaults to index.html)
 */

import AdmZip from 'adm-zip';
import { Command } from 'commander';
import FormData from 'form-data';
import fs from 'fs';
import os from 'os';
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

type FileMode = 'zip' | 'html' | 'directory';

function detectFileMode(filePath: string): FileMode {
  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) return 'directory';
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.zip') return 'zip';
  if (ext === '.html' || ext === '.htm') return 'html';
  throw new Error(
    `Unsupported --file input: "${filePath}". Expected .html/.htm file, directory, or .zip archive.`
  );
}

function zipDirectoryToTmp(dirPath: string): string {
  const zip = new AdmZip();
  zip.addLocalFolder(dirPath);
  const tmpZip = path.join(os.tmpdir(), `rws-html-${Date.now()}-${process.pid}.zip`);
  zip.writeZip(tmpZip);
  return tmpZip;
}

export const htmlToScreenshotCommand = new Command('html-to-screenshot')
  .description('Render HTML (string, file, directory, or ZIP) to a screenshot image')
  .option('--html <html>', 'Raw HTML string to render')
  .option('--file <path>', 'Path to .html file, directory, or .zip archive (auto-detected)')
  .option('--output <type>', 'Output type: url (default) or buffer', 'url')
  .option('--output-file <path>', 'Save buffer output to file (requires --output buffer)')
  .option('--width <pixels>', 'Viewport width in pixels', '1400')
  .option('--height <pixels>', 'Viewport height in pixels', '800')
  .option('--full-page', 'Capture full page instead of viewport')
  .option('--type <format>', 'Image format: png (default) or jpeg', 'png')
  .option('--quality <number>', 'JPEG quality 1-100 (only for jpeg)')
  .option('--entry-file <filename>', 'Entry HTML file inside ZIP/directory', 'index.html')
  .option('--delay <ms>', 'Delay in ms after page load before screenshot', '0')
  .option('--api-key <key>', 'API key (overrides env/config)')
  .option('--format <format>', 'Output format: json, table, raw')
  .action(async (options: HtmlToScreenshotOptions) => {
    let tmpZipToCleanup: string | null = null;

    try {
      if (!options.html && !options.file) {
        console.error('Error: Either --html or --file is required');
        process.exit(1);
      }

      const apiKey = resolveApiKey({ apiKey: options.apiKey });
      createApiClient(apiKey);

      const viewport = {
        width: parseInt(options.width || '1400', 10),
        height: parseInt(options.height || '800', 10),
      };

      let result: HtmlToScreenshotResponse;

      if (options.file) {
        const filePath = path.resolve(options.file);
        if (!fs.existsSync(filePath)) {
          console.error(`Error: File not found: ${filePath}`);
          process.exit(1);
        }

        const mode = detectFileMode(filePath);

        if (mode === 'html') {
          const htmlContent = fs.readFileSync(filePath, 'utf8');
          const requestBody = {
            html: htmlContent,
            viewport,
            fullPage: options.fullPage || false,
            output: options.output || 'url',
            type: options.type || 'png',
            quality: options.quality ? parseInt(options.quality, 10) : undefined,
            delayAfterLoad: options.delay ? parseInt(options.delay, 10) : 0,
          };
          result = await withSpinner(
            `Rendering HTML file ${path.basename(filePath)}...`,
            () => apiPost<HtmlToScreenshotResponse>('/html-to-screenshot', requestBody),
            'Screenshot captured from HTML file'
          );
        } else {
          let zipPath = filePath;
          let spinnerLabel = `Rendering ZIP ${path.basename(filePath)}...`;
          let successLabel = 'Screenshot captured from ZIP';

          if (mode === 'directory') {
            zipPath = zipDirectoryToTmp(filePath);
            tmpZipToCleanup = zipPath;
            spinnerLabel = `Zipping and rendering directory ${path.basename(filePath)}...`;
            successLabel = 'Screenshot captured from directory';
          }

          const formData = new FormData();
          formData.append('file', fs.createReadStream(zipPath));
          formData.append('output', options.output || 'url');
          formData.append('viewport', JSON.stringify(viewport));
          if (options.fullPage) formData.append('fullPage', 'true');
          formData.append('type', options.type || 'png');
          if (options.quality) formData.append('quality', options.quality);
          formData.append('entryFile', options.entryFile || 'index.html');
          if (options.delay && options.delay !== '0') formData.append('delayAfterLoad', options.delay);

          result = await withSpinner(
            spinnerLabel,
            () => apiPostFormData<HtmlToScreenshotResponse>('/html-to-screenshot', formData),
            successLabel
          );
        }
      } else {
        const requestBody = {
          html: options.html,
          viewport,
          fullPage: options.fullPage || false,
          output: options.output || 'url',
          type: options.type || 'png',
          quality: options.quality ? parseInt(options.quality, 10) : undefined,
          delayAfterLoad: options.delay ? parseInt(options.delay, 10) : 0,
        };

        result = await withSpinner(
          'Rendering HTML to screenshot...',
          () => apiPost<HtmlToScreenshotResponse>('/html-to-screenshot', requestBody),
          'Screenshot captured from HTML'
        );
      }

      if (options.output === 'buffer' && options.outputFile) {
        printWarning('Buffer mode with CLI saves the image URL instead. Use the URL to download.');
      }

      printOutput(result, { format: options.format });

      if (result?.data?.imageUrl) {
        printSuccess(`Image URL: ${result.data.imageUrl}`);
      }
    } catch (error) {
      handleCliError(error);
    } finally {
      if (tmpZipToCleanup) {
        try {
          fs.unlinkSync(tmpZipToCleanup);
        } catch {
          /* ignore cleanup errors */
        }
      }
    }
  });
