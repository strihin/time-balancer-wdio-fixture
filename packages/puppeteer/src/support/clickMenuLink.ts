import type { Page } from 'puppeteer';

export async function clickMenuLink(page: Page, selector: string): Promise<void> {
    // Wait for element to be visible AND not obscured by the slide-in animation
    await page.waitForSelector(selector, { visible: true });
    await page.evaluate((sel) => {
        const el = document.querySelector(sel) as HTMLElement | null;
        if (el) el.click();
    }, selector);
}
