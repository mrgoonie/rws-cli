/**
 * Output formatter for CLI display
 * Supports JSON, table, and raw output formats
 */

import chalk from 'chalk';
import Table from 'cli-table3';
import { type OutputFormat, OUTPUT_FORMATS, DEFAULT_OUTPUT_FORMAT } from '../config/constants.js';
import { getConfigValue } from '../config/config-manager.js';

export interface OutputOptions {
  format?: OutputFormat;
}

/**
 * Get the output format from options or config
 */
export function getOutputFormat(options?: OutputOptions): OutputFormat {
  if (options?.format && OUTPUT_FORMATS.includes(options.format)) {
    return options.format;
  }
  return getConfigValue('defaultFormat') || DEFAULT_OUTPUT_FORMAT;
}

/**
 * Format and print output based on format type
 */
export function printOutput(data: unknown, options?: OutputOptions): void {
  const format = getOutputFormat(options);

  switch (format) {
    case 'json':
      printJson(data);
      break;
    case 'table':
      printTable(data);
      break;
    case 'raw':
      printRaw(data);
      break;
    default:
      printJson(data);
  }
}

/**
 * Print data as formatted JSON
 */
export function printJson(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

/**
 * Print data as a table
 */
export function printTable(data: unknown): void {
  if (Array.isArray(data)) {
    printArrayAsTable(data);
  } else if (typeof data === 'object' && data !== null) {
    printObjectAsTable(data as Record<string, unknown>);
  } else {
    console.log(String(data));
  }
}

/**
 * Print array of objects as table
 */
function printArrayAsTable(data: unknown[]): void {
  if (data.length === 0) {
    console.log(chalk.yellow('No data to display'));
    return;
  }

  const firstItem = data[0];
  if (typeof firstItem !== 'object' || firstItem === null) {
    data.forEach((item) => console.log(String(item)));
    return;
  }

  const keys = Object.keys(firstItem);
  const table = new Table({
    head: keys.map((k) => chalk.cyan(k)),
    style: { head: [], border: [] },
  });

  for (const item of data) {
    if (typeof item === 'object' && item !== null) {
      const row = keys.map((key) => formatCellValue((item as Record<string, unknown>)[key]));
      table.push(row);
    }
  }

  console.log(table.toString());
}

/**
 * Print single object as key-value table
 */
function printObjectAsTable(data: Record<string, unknown>): void {
  const table = new Table({
    style: { head: [], border: [] },
  });

  for (const [key, value] of Object.entries(data)) {
    table.push({ [chalk.cyan(key)]: formatCellValue(value) });
  }

  console.log(table.toString());
}

/**
 * Format a cell value for table display
 */
function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return chalk.dim('—');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  if (typeof value === 'boolean') {
    return value ? chalk.green('true') : chalk.red('false');
  }
  return String(value);
}

/**
 * Print raw output (minimal processing)
 */
export function printRaw(data: unknown): void {
  if (typeof data === 'string') {
    console.log(data);
  } else if (typeof data === 'object' && data !== null) {
    // For objects, check if there's a content/markdown/text field
    const obj = data as Record<string, unknown>;
    if (typeof obj.content === 'string') {
      console.log(obj.content);
    } else if (typeof obj.markdown === 'string') {
      console.log(obj.markdown);
    } else if (typeof obj.text === 'string') {
      console.log(obj.text);
    } else if (typeof obj.data === 'string') {
      console.log(obj.data);
    } else {
      console.log(JSON.stringify(data));
    }
  } else {
    console.log(String(data));
  }
}

/**
 * Print success message
 */
export function printSuccess(message: string): void {
  console.log(chalk.green('✓'), message);
}

/**
 * Print warning message
 */
export function printWarning(message: string): void {
  console.log(chalk.yellow('⚠'), message);
}

/**
 * Print info message
 */
export function printInfo(message: string): void {
  console.log(chalk.blue('ℹ'), message);
}
