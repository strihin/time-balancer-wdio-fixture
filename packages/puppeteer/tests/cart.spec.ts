import { type Browser, type Page } from 'puppeteer';
import { launchBrowser, login } from '@support/auth';
import { InventorySelectors as Inv } from '@selectors/inventory.selectors';
import { CartSelectors as CartSel } from '@selectors/cart.selectors';

describe('Cart', () => {
  let browser: Browser;
  let page: Page;

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await browser.newPage();
    await login(page);
  });

  afterEach(async () => {
    await browser.close();
  });

  it('cart is empty on first login', async () => {
    const badge = await page.$(CartSel.badge);
    expect(badge).toBeNull();
  });

  it('adds an item and cart badge shows 1', async () => {
    await page.click(Inv.addBackpack);
    const badge = await page.$eval(CartSel.badge, el => el.textContent);
    expect(badge).toBe('1');
  });

  it('opens cart page and shows added item', async () => {
    await page.click(Inv.addBackpack);
    await page.click(CartSel.link);
    const item = await page.$(CartSel.item);
    expect(item).not.toBeNull();
  });

  it('removes an item from the cart', async () => {
    await page.click(Inv.addBackpack);
    await page.click(CartSel.link);
    await page.click(CartSel.removeBackpack);
    const item = await page.$(CartSel.item);
    expect(item).toBeNull();
  });

  it('cart badge updates when adding multiple items', async () => {
    await page.click(Inv.addBackpack);
    await page.click(Inv.addBikeLight);
    const badge = await page.$eval(CartSel.badge, el => el.textContent);
    expect(badge).toBe('2');
  });
});
