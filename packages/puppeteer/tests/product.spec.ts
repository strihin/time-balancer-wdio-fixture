import { type Browser, type Page } from 'puppeteer';
import { launchBrowser, login } from '@support/auth';
import { ProductSelectors as ProductSel } from '@selectors/product.selectors';

describe('Product Detail', () => {
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

  it('opens product detail page on item click', async () => {
    await page.click(ProductSel.itemName);
    await page.waitForSelector(ProductSel.detailName);
    const detail = await page.$(ProductSel.detailName);
    expect(detail).not.toBeNull();
  });

  it('product detail shows correct name', async () => {
    const name = await page.$eval(ProductSel.itemName, el => el.textContent ?? '');
    await page.click(ProductSel.itemName);
    await page.waitForSelector(ProductSel.detailName);
    const detailName = await page.$eval(ProductSel.detailName, el => el.textContent ?? '');
    expect(detailName).toBe(name);
  });

  it('back button returns to inventory', async () => {
    await page.click(ProductSel.itemName);
    await page.waitForSelector(ProductSel.backToProducts);
    await page.click(ProductSel.backToProducts);
    await page.waitForSelector(ProductSel.inventoryList);
    const list = await page.$(ProductSel.inventoryList);
    expect(list).not.toBeNull();
  });

  it('product image is visible on detail page', async () => {
    await page.click(ProductSel.itemName);
    await page.waitForSelector(ProductSel.detailImage);
    const img = await page.$(ProductSel.detailImage);
    expect(img).not.toBeNull();
  });

  it('adds item to cart from detail page', async () => {
    await page.click(ProductSel.itemName);
    await page.waitForSelector(ProductSel.addToCartBtn);
    await page.click(ProductSel.addToCartBtn);
    const badge = await page.$eval(ProductSel.cartBadge, el => el.textContent);
    expect(badge).toBe('1');
  });
});
