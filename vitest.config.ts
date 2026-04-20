import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    testTimeout: 60000, // 60 seconds for API calls
    hookTimeout: 30000,
    setupFiles: ['tests/test-setup-configuration.ts'],
  },
});
