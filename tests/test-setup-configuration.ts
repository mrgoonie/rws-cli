/**
 * Test setup configuration for vitest
 * Loads environment variables and configures global test settings
 */

import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Verify API key is available
if (!process.env.RWEB_API_KEY) {
  console.warn('Warning: RWEB_API_KEY not found in .env.test');
}
