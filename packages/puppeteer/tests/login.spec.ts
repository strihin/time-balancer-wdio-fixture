import puppeteer, { type Browser, type Page } from 'puppeteer';
import { launchBrowser, login } from '@support/auth';
import { LoginSelectors as LoginSel } from '@selectors/login.selectors';
import { users } from '@fixtures/users';
import { BASE_URL } from '@constants/index';

describe('Login', () => {
  let browser: Browser;
  let page: Page;

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await browser.newPage();
    await page.goto(BASE_URL);
  });

  afterEach(async () => {
    await browser?.close();
  });

  it('logs in with valid credentials', async () => {
    await login(page);
    const list = await page.$(LoginSel.inventoryList);
    expect(list).not.toBeNull();
  });

  it('shows error for locked-out user', async () => {
    await login(page, users.locked, false);
    await page.waitForSelector(LoginSel.error);
    const text = await page.$eval(LoginSel.error, el => el.textContent ?? '');
    expect(text).toContain('locked out');
  });

  it('shows error for wrong password', async () => {
    await login(page, users.wrongPassword, false);
    await page.waitForSelector(LoginSel.error);
    const error = await page.$(LoginSel.error);
    expect(error).not.toBeNull();
  });

  it('shows error when both fields are empty', async () => {
    await page.click(LoginSel.loginButton);
    await page.waitForSelector(LoginSel.error);
    const error = await page.$(LoginSel.error);
    expect(error).not.toBeNull();
  });

  it('redirects to /inventory.html after login', async () => {
    await login(page);
    expect(page.url()).toContain('/inventory.html');
  });
});
