import puppeteer, { type Browser, type Page } from 'puppeteer';
import { users, type User } from '@fixtures/users';
import { LoginSelectors as LoginSel } from '@selectors/login.selectors';

import { BASE_URL } from '@constants/index';

export const SAUCE_USER = users.standard.username;
export const SAUCE_PASS = users.standard.password;
export const GLITCH_USER = users.glitch.username;

export async function launchBrowser(): Promise<Browser> {
  return puppeteer.launch({
    headless: process.env.HEADLESS !== 'false',
    executablePath: process.env.CHROME_BIN || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });
}

export async function login(page: Page, user: User = users.standard, waitForInventory = true): Promise<void> {
  await page.goto(BASE_URL);
  await page.evaluate(() => localStorage.clear());
  await page.goto(BASE_URL);
  await page.type(LoginSel.username, user.username);
  await page.type(LoginSel.password, user.password);
  await page.click(LoginSel.loginButton);
  if (waitForInventory) {
    await page.waitForSelector(LoginSel.inventoryList);
  }
}
