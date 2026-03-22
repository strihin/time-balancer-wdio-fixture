import { type Page } from 'puppeteer';

/**
 * Clicks a navigation menu link by bypassing Puppeteer's clickable-point check.
 * Needed because the SauceDemo side menu slides in with animation, causing
 * `page.click()` to fail with "Node is either not clickable or not an Element".
 */
export async function clickMenuLink(page: Page, selector: string): Promise<void> {
  await page.waitForSelector(selector, { visible: true });
  await page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (el) el.click();
  }, selector);
}
