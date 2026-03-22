import { type Browser, type Page } from 'puppeteer';
import { launchBrowser, login } from '@support/auth';
import { InventorySelectors as Inv } from '@selectors/inventory.selectors';
import { CartSelectors as Cart } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';

async function setInputValue(page: Page, selector: string, value: string): Promise<void> {
  await page.waitForSelector(selector, { visible: true });
  await page.click(selector, { clickCount: 3 });
  await page.$eval(
    selector,
    (el, val) => {
      const input = el as HTMLInputElement;
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )!.set!;
      nativeInputValueSetter.call(input, val);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    value,
  );
}

describe('Checkout – Form Validation', () => {
  let browser: Browser;
  let page: Page;

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await browser.newPage();
    await login(page);
    await page.click(Inv.addBackpack);
    await page.click(Inv.cartLink);
    await page.click(Cart.checkout);
    await page.waitForSelector(CheckoutSel.firstName, { visible: true });
  });

  afterEach(async () => {
    await browser?.close();
  });

  it('shows error when first name is missing', async () => {
    await setInputValue(page, CheckoutSel.lastName, 'Doe');
    await setInputValue(page, CheckoutSel.postalCode, '10001');
    await page.click(CheckoutSel.continueBtn);
    const text = await page.$eval(CheckoutSel.error, el => el.textContent ?? '');
    expect(text).toContain('First Name');
  });

  it('shows error when last name is missing', async () => {
    await setInputValue(page, CheckoutSel.firstName, 'Jane');
    await setInputValue(page, CheckoutSel.postalCode, '10001');
    await page.click(CheckoutSel.continueBtn);
    const text = await page.$eval(CheckoutSel.error, el => el.textContent ?? '');
    expect(text).toContain('Last Name');
  });

  it('shows error when postal code is missing', async () => {
    await setInputValue(page, CheckoutSel.firstName, 'Jane');
    await setInputValue(page, CheckoutSel.lastName, 'Doe');
    await page.click(CheckoutSel.continueBtn);
    const text = await page.$eval(CheckoutSel.error, el => el.textContent ?? '');
    expect(text).toContain('Postal Code');
  });

  it('shows error when all fields are empty', async () => {
    await page.click(CheckoutSel.continueBtn);
    const error = await page.$(CheckoutSel.error);
    expect(error).not.toBeNull();
  });

  it('cancel button returns to cart page', async () => {
    await page.click(CheckoutSel.cancelBtn);
    await page.waitForSelector(Cart.item);
    const item = await page.$(Cart.item);
    expect(item).not.toBeNull();
  });
});
