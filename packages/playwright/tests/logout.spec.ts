import { test, expect } from '@playwright/test';
import { login } from '@support/auth';
import { NavSelectors as NavSel } from '@selectors/nav.selectors';
import { LoginSelectors as LoginSel } from '@selectors/login.selectors';
import { users } from '@fixtures/users';

test.describe('Logout', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('burger menu button is visible', async ({ page }) => {
    await expect(page.locator(NavSel.burgerMenuBtn)).toBeVisible();
  });

  test('opens side menu on burger click', async ({ page }) => {
    await page.locator(NavSel.burgerMenuBtn).click();
    await expect(page.locator(NavSel.logoutLink)).toBeVisible();
  });

  test('logout link redirects to login page', async ({ page }) => {
    await page.locator(NavSel.burgerMenuBtn).click();
    await page.locator(NavSel.logoutLink).click();
    await expect(page.locator(LoginSel.loginButton)).toBeVisible();
  });

  test('session is cleared after logout', async ({ page }) => {
    await page.locator(NavSel.burgerMenuBtn).click();
    await page.locator(NavSel.logoutLink).click();
    await page.goto('/inventory.html');
    await expect(page.locator(LoginSel.loginButton)).toBeVisible();
  });

  test('can re-login after logout', async ({ page }) => {
    await page.locator(NavSel.burgerMenuBtn).click();
    await page.locator(NavSel.logoutLink).click();
    await page.locator(LoginSel.username).fill(users.standard.username);
    await page.locator(LoginSel.password).fill(users.standard.password);
    await page.locator(LoginSel.loginButton).click();
    await expect(page.locator(NavSel.inventoryList)).toBeVisible();
  });
});
