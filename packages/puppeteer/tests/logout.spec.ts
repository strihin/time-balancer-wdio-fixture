import { type Browser, type Page } from 'puppeteer';
import { launchBrowser, login } from '@support/auth';
import { NavSelectors as NavSel } from '@selectors/nav.selectors';
import { LoginSelectors as LoginSel } from '@selectors/login.selectors';
import { users } from '@fixtures/users';
import { BASE_URL } from '@constants/index';
import { clickMenuLink } from '@support/clickMenuLink';

describe('Logout', () => {
  let browser: Browser;
  let page: Page;

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await browser.newPage();
    await login(page);
  });

  afterEach(async () => {
    await browser?.close();
  });

  it('burger menu button is visible', async () => {
    const btn = await page.$(NavSel.burgerMenuBtn);
    expect(btn).not.toBeNull();
  });

  it('opens side menu on burger click', async () => {
    await page.click(NavSel.burgerMenuBtn);
    await page.waitForSelector(NavSel.logoutLink, { visible: true });
    const link = await page.$(NavSel.logoutLink);
    expect(link).not.toBeNull();
  });

  it('logout link redirects to login page', async () => {
    await page.click(NavSel.burgerMenuBtn);
    await clickMenuLink(page, NavSel.logoutLink);
    await page.waitForSelector(LoginSel.loginButton);
    const btn = await page.$(LoginSel.loginButton);
    expect(btn).not.toBeNull();
  });

  it('session is cleared after logout', async () => {
    await page.click(NavSel.burgerMenuBtn);
    await clickMenuLink(page, NavSel.logoutLink);
    await page.goto(`${BASE_URL}/inventory.html`);
    await page.waitForSelector(LoginSel.loginButton);
    const btn = await page.$(LoginSel.loginButton);
    expect(btn).not.toBeNull();
  });

  it('can re-login after logout', async () => {
    await page.click(NavSel.burgerMenuBtn);
    await clickMenuLink(page, NavSel.logoutLink);
    await page.waitForSelector(LoginSel.username);
    await page.type(LoginSel.username, users.standard.username);
    await page.type(LoginSel.password, users.standard.password);
    await page.click(LoginSel.loginButton);
    await page.waitForSelector(NavSel.inventoryList);
    const list = await page.$(NavSel.inventoryList);
    expect(list).not.toBeNull();
  });
});
