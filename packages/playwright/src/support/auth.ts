import { type User, users } from '@fixtures/users';
import type { Page } from '@playwright/test';
import { LoginSelectors as LoginSel } from '@selectors/login.selectors';

export const SAUCE_USER = users.standard.username;
export const SAUCE_PASS = users.standard.password;
export const GLITCH_USER = users.glitch.username;

export async function login(page: Page, user: User = users.standard): Promise<void> {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.locator(LoginSel.username).fill(user.username);
  await page.locator(LoginSel.password).fill(user.password);
  await page.locator(LoginSel.loginButton).click();
  await page.locator(LoginSel.inventoryList).waitFor({ state: 'visible' });
}
