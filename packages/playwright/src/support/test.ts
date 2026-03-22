import { test as baseTest, afterAll, describe, beforeEach, afterEach, beforeAll } from 'vitest';
import { expect } from '@playwright/test';
export { expect, describe, beforeEach, afterEach, beforeAll, afterAll };
import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { BASE_URL } from '@constants/index';

let browser: Browser;

// Extend the base vitest 'test' to inject the 'page' fixture
export const test = baseTest.extend<{ page: Page }>({
  page: async ({ }, use: (r: Page) => Promise<void>) => {
    if (!browser) {
      // Launch browser once per worker
      const headless = process.env.HEADLESS !== 'false';
      browser = await chromium.launch({ 
        headless,
        args: ['--no-sandbox', '--disable-dev-shm-usage']
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
  }
});

afterAll(async () => {
  if (browser) {
    await browser.close();
  }
});

