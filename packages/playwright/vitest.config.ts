import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['tests/**/*.spec.ts'],
    testTimeout: 60000,
    hookTimeout: 60000,
    reporters: ['default', ['junit', { outputFile: '.logs/results.xml' }]],
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
});
