import { BASE_URL } from '@constants/index';
import { expect } from '@playwright/test';
import { type Browser, type Page, chromium } from 'playwright';
import {
  type TestContext,
  afterAll,
  test as baseTest,
  beforeAll,
  describe,
  afterEach as vitestAfterEach,
  beforeEach as vitestBeforeEach,
} from 'vitest';

export { expect, describe, beforeAll, afterAll };

let browser: Browser | undefined;

// Define the fixture context type
export type ExtendedContext = TestContext & { page: Page };

// Extend the base vitest 'test' to inject the 'page' fixture
const extendedTest = baseTest.extend<{ page: Page }>({
  // biome-ignore lint/correctness/noEmptyPattern: Vitest requires destructuring for fixtures
  page: async ({}, use) => {
    if (!browser) {
      // Launch browser once per worker
      const headless = process.env.HEADLESS !== 'false';
      browser = await chromium.launch({
        headless,
        args: ['--no-sandbox', '--disable-dev-shm-usage'],
      });
    }

    // Create a new context and page for each test
    const context = await browser.newContext({ baseURL: BASE_URL });
    const page = await context.newPage();

    // Use the fixture in the test
    await use(page);

    // Clean up after the test completes
    await page.close();
    await context.close();
  },
});

export const test = extendedTest;
export const it = extendedTest;

// Re-export hooks with extended context type for IDE support
export const beforeEach = vitestBeforeEach as (
  fn: (context: ExtendedContext) => Promise<void> | void,
  timeout?: number,
) => void;

export const afterEach = vitestAfterEach as (
  fn: (context: ExtendedContext) => Promise<void> | void,
  timeout?: number,
) => void;

afterAll(async () => {
  if (browser) {
    await browser.close();
  }
});
