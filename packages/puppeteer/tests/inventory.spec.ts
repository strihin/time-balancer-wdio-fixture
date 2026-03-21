import { type Browser, type Page } from 'puppeteer';
import { launchBrowser, login } from '@support/auth';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';

describe('Inventory', () => {
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

  it('shows the inventory list after login', async () => {
    const list = await page.$(InventorySel.list);
    expect(list).not.toBeNull();
  });

  it('shows 6 items in the inventory', async () => {
    const items = await page.$$(InventorySel.item);
    expect(items).toHaveLength(6);
  });

  it('each item has a name and price', async () => {
    const names = await page.$$(InventorySel.itemName);
    const prices = await page.$$(InventorySel.itemPrice);
    expect(names).toHaveLength(6);
    expect(prices).toHaveLength(6);
    for (const priceEl of prices) {
      const text = await priceEl.evaluate(el => el.textContent ?? '');
      expect(text).toMatch(/^\$\d+\.\d{2}$/);
    }
  });

  it('adds an item to cart from inventory page', async () => {
    await page.click(InventorySel.addBackpack);
    const badge = await page.$eval(InventorySel.cartBadge, el => el.textContent);
    expect(badge).toBe('1');
  });

  it('remove button replaces add button after adding item', async () => {
    await page.click(InventorySel.addBackpack);
    const removeBtn = await page.$(InventorySel.removeBackpack);
    const addBtn = await page.$(InventorySel.addBackpack);
    expect(removeBtn).not.toBeNull();
    expect(addBtn).toBeNull();
  });
});
