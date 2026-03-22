import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['tests/**/*.spec.ts'],
    testTimeout: 60000,
    hookTimeout: 60000,
    reporters: [
      'default',
      ['junit', { outputFile: '.logs/results.xml' }]
    ],
    poolOptions: {
      threads: {
        singleThread: true,
      }
    }
  }
});
