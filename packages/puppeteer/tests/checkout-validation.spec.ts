import { CartSelectors as CartSel } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { launchBrowser, login } from '@support/auth';
import { setInputValue } from '@support/checkout';
import type { Browser, Page } from 'puppeteer';

describe('Checkout – Form Validation', () => {
  let browser: Browser;
  let page: Page;

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await browser.newPage();
    await login(page);
    await page.click(InventorySel.addBackpack);
    await page.click(InventorySel.cartLink);
    await page.click(CartSel.checkout);
    await page.waitForSelector(CheckoutSel.firstName, { visible: true });
  });

  afterEach(async () => {
    await browser?.close();
  });

  it('shows error when first name is missing', async () => {
    await setInputValue(page, CheckoutSel.lastName, 'Doe');
    await setInputValue(page, CheckoutSel.postalCode, '10001');
    await page.click(CheckoutSel.continueBtn);
    const text = await page.$eval(CheckoutSel.error, (el) => el.textContent ?? '');
    expect(text).toContain('First Name');
  });

  it('shows error when last name is missing', async () => {
    await setInputValue(page, CheckoutSel.firstName, 'Jane');
    await setInputValue(page, CheckoutSel.postalCode, '10001');
    await page.click(CheckoutSel.continueBtn);
    const text = await page.$eval(CheckoutSel.error, (el) => el.textContent ?? '');
    expect(text).toContain('Last Name');
  });

  it('shows error when postal code is missing', async () => {
    await setInputValue(page, CheckoutSel.firstName, 'Jane');
    await setInputValue(page, CheckoutSel.lastName, 'Doe');
    await page.click(CheckoutSel.continueBtn);
    const text = await page.$eval(CheckoutSel.error, (el) => el.textContent ?? '');
    expect(text).toContain('Postal Code');
  });

  it('shows error when all fields are empty', async () => {
    await page.click(CheckoutSel.continueBtn);
    const error = await page.$(CheckoutSel.error);
    expect(error).not.toBeNull();
  });

  it('cancel button returns to cart page', async () => {
    await page.click(CheckoutSel.cancelBtn);
    await page.waitForSelector(CartSel.item);
    const item = await page.$(CartSel.item);
    expect(item).not.toBeNull();
  });
});
