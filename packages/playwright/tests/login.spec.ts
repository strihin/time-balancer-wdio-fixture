import { LOCKED_OUT_MSG } from '@constants/index';
import { users } from '@fixtures/users';
import { LoginSelectors as LoginSel } from '@selectors/login.selectors';
import { beforeEach, describe, expect, test } from '@support/test';

describe('Login', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('logs in with valid credentials', async ({ page }) => {
    await page.locator(LoginSel.username).fill(users.standard.username);
    await page.locator(LoginSel.password).fill(users.standard.password);
    await page.locator(LoginSel.loginButton).click();
    await expect(page.locator(LoginSel.inventoryList)).toBeVisible();
  });

  test('shows error for locked-out user', async ({ page }) => {
    await page.locator(LoginSel.username).fill(users.locked.username);
    await page.locator(LoginSel.password).fill(users.locked.password);
    await page.locator(LoginSel.loginButton).click();
    await expect(page.locator(LoginSel.error)).toContainText(LOCKED_OUT_MSG);
  });

  test('shows error for wrong password', async ({ page }) => {
    await page.locator(LoginSel.username).fill(users.wrongPassword.username);
    await page.locator(LoginSel.password).fill(users.wrongPassword.password);
    await page.locator(LoginSel.loginButton).click();
    await expect(page.locator(LoginSel.error)).toBeVisible();
  });

  test('shows error when both fields are empty', async ({ page }) => {
    await page.locator(LoginSel.loginButton).click();
    await expect(page.locator(LoginSel.error)).toBeVisible();
  });

  test('redirects to /inventory.html after login', async ({ page }) => {
    await page.locator(LoginSel.username).fill(users.standard.username);
    await page.locator(LoginSel.password).fill(users.standard.password);
    await page.locator(LoginSel.loginButton).click();
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
