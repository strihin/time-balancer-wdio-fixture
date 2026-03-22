import { type Browser, type Page } from 'puppeteer';
import { launchBrowser, login } from '@support/auth';
import { users } from '@fixtures/users';
import { checkoutForms } from '@fixtures/checkout';
import { InventorySelectors as Inv } from '@selectors/inventory.selectors';
import { CartSelectors as Cart } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';

const { firstName, lastName, postalCode } = checkoutForms.valid;

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

async function fillCheckoutForm(page: Page) {
  await setInputValue(page, CheckoutSel.firstName, firstName);
  await setInputValue(page, CheckoutSel.lastName, lastName);
  await setInputValue(page, CheckoutSel.postalCode, postalCode);
  await page.click(CheckoutSel.continueBtn);
  // Await navigation to the overview page before returning
  await page.waitForSelector(CheckoutSel.summaryContainer);
}

describe('Checkout', () => {
  let browser: Browser;
  let page: Page;

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await browser.newPage();
    await login(page, users.standard);
    await page.click(Inv.addBackpack);
    await page.click(Cart.link);
  });

  afterEach(async () => {
    await browser?.close();
  });

  it('proceeds to checkout from cart', async () => {
    await page.click(Cart.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    const container = await page.$(CheckoutSel.infoContainer);
    expect(container).not.toBeNull();
  });

  it('fills in customer info and continues to overview', async () => {
    await page.click(Cart.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillCheckoutForm(page);
    await page.waitForSelector(CheckoutSel.summaryContainer);
    const summary = await page.$(CheckoutSel.summaryContainer);
    expect(summary).not.toBeNull();
  });

  it('overview shows item total', async () => {
    await page.click(Cart.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillCheckoutForm(page);
    await page.waitForSelector(CheckoutSel.totalLabel);
    const total = await page.$(CheckoutSel.totalLabel);
    expect(total).not.toBeNull();
  });

  it('completes full checkout and shows confirmation', async () => {
    await page.click(Cart.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillCheckoutForm(page);
    await page.waitForSelector(CheckoutSel.finishBtn);
    await page.click(CheckoutSel.finishBtn);
    const header = await page.$eval(CheckoutSel.completeHeader, el => el.textContent);
    expect(header).toBe('Thank you for your order!');
  });

  it('can navigate back to home after checkout', async () => {
    await page.click(Cart.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillCheckoutForm(page);
    await page.waitForSelector(CheckoutSel.finishBtn);
    await page.click(CheckoutSel.finishBtn);
    await page.waitForSelector(CheckoutSel.backToProducts);
    await page.click(CheckoutSel.backToProducts);
    await page.waitForSelector(CheckoutSel.inventoryList);
    const list = await page.$(CheckoutSel.inventoryList);
    expect(list).not.toBeNull();
  });
});
