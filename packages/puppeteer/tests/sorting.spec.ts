import { type Browser, type Page } from 'puppeteer';
import { launchBrowser, login } from '@support/auth';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { sortOptions } from '@fixtures/checkout';

describe('Sorting', () => {
  let browser: Browser;
  let page: Page;

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await browser.newPage();
    await login(page);
    await page.waitForSelector(InventorySel.sortContainer);
  });

  afterEach(async () => {
    await browser?.close();
  });

  it('default sort is Name (A to Z)', async () => {
    const names = await page.$$eval(InventorySel.itemName, els => els.map(el => el.textContent ?? ''));
    expect(names).toEqual([...names].sort());
  });

  it('sorts by Name (Z to A)', async () => {
    await page.select(InventorySel.sortContainer, sortOptions.nameZtoA.value);
    const names = await page.$$eval(InventorySel.itemName, els => els.map(el => el.textContent ?? ''));
    expect(names).toEqual([...names].sort().reverse());
  });

  it('sorts by Price (low to high)', async () => {
    await page.select(InventorySel.sortContainer, sortOptions.priceLowToHigh.value);
    const vals = await page.$$eval(InventorySel.itemPrice, els =>
      els.map(el => parseFloat((el.textContent ?? '').replace('$', '')))
    );
    expect(vals).toEqual([...vals].sort((a, b) => a - b));
  });

  it('sorts by Price (high to low)', async () => {
    await page.select(InventorySel.sortContainer, sortOptions.priceHighToLow.value);
    const vals = await page.$$eval(InventorySel.itemPrice, els =>
      els.map(el => parseFloat((el.textContent ?? '').replace('$', '')))
    );
    expect(vals).toEqual([...vals].sort((a, b) => b - a));
  });

  it('item count remains 6 after any sort', async () => {
    await page.select(InventorySel.sortContainer, sortOptions.priceHighToLow.value);
    const items = await page.$$(InventorySel.item);
    expect(items).toHaveLength(6);
  });
});
