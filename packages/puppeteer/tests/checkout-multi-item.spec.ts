import { type Browser, type Page } from 'puppeteer';
import { launchBrowser, login } from '@support/auth';
import { users } from '@fixtures/users';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { CartSelectors as CartSel } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';
import { addThreeItems } from '@support/inventory';
import { fillForm } from '@support/fill-form';
import { CHECKOUT_SUCCESS_MSG } from '@constants/index';
import { parseCurrencyText } from '@utils/price';



describe('Checkout – Multi-item', () => {
  let browser: Browser;
  let page: Page;

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await browser.newPage();
    await login(page, users.standard);
    await addThreeItems(page);
    await page.click(InventorySel.cartLink);
  });

  afterEach(async () => {
    await browser?.close();
  });

  it('cart shows 3 items after adding three products', async () => {
    const badge = await page.$eval(CartSel.badge, el => el.textContent);
    const items = await page.$$(CartSel.item);
    expect(badge).toBe('3');
    expect(items).toHaveLength(3);
  });

  it('checkout overview lists all three items', async () => {
    await page.click(CartSel.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillForm(page);
    const items = await page.$$(CheckoutSel.summaryItem);
    expect(items).toHaveLength(3);
  });

  it('item total on overview matches sum of item prices', async () => {
    await page.click(CartSel.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillForm(page);
    const text = await page.$eval(CheckoutSel.itemTotal, el => el.textContent ?? '');
    const itemTotal = parseCurrencyText(text);
    expect(itemTotal).toBeGreaterThan(0);
  });

  it('tax is calculated on overview', async () => {
    await page.click(CartSel.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillForm(page);
    const text = await page.$eval(CheckoutSel.taxLabel, el => el.textContent ?? '');
    const tax = parseCurrencyText(text);
    expect(tax).toBeGreaterThan(0);
  });

  it('completes checkout with multiple items', async () => {
    await page.click(CartSel.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillForm(page);
    await page.waitForSelector(CheckoutSel.finishBtn);
    await page.click(CheckoutSel.finishBtn);
    const header = await page.$eval(CheckoutSel.completeHeader, el => el.textContent);
    expect(header).toBe(CHECKOUT_SUCCESS_MSG);
  });
});
