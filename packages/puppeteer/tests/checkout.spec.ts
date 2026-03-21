import { type Browser, type Page } from 'puppeteer';
import { launchBrowser, login } from '@support/auth';
import { users } from '@fixtures/users';
import { checkoutForms } from '@fixtures/checkout';
import { InventorySelectors as Inv } from '@selectors/inventory.selectors';
import { CartSelectors as Cart } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';

const { firstName, lastName, postalCode } = checkoutForms.valid;

async function fillCheckoutForm(page: Page) {
  await page.type(CheckoutSel.firstName, firstName);
  await page.type(CheckoutSel.lastName, lastName);
  await page.type(CheckoutSel.postalCode, postalCode);
  await page.click(CheckoutSel.continueBtn);
}

describe('Checkout', () => {
  let browser: Browser;
  let page: Page;

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await browser.newPage();
    await login(page, users.glitch);
    await page.click(Inv.addBackpack);
    await page.click(Cart.link);
  });

  afterEach(async () => {
    await browser.close();
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
    const total = await page.$(CheckoutSel.totalLabel);
    expect(total).not.toBeNull();
  });

  it('completes full checkout and shows confirmation', async () => {
    await page.click(Cart.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillCheckoutForm(page);
    await page.click(CheckoutSel.finishBtn);
    const header = await page.$eval(CheckoutSel.completeHeader, el => el.textContent);
    expect(header).toBe('Thank you for your order!');
  });

  it('can navigate back to home after checkout', async () => {
    await page.click(Cart.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillCheckoutForm(page);
    await page.click(CheckoutSel.finishBtn);
    await page.click(CheckoutSel.backToProducts);
    await page.waitForSelector(CheckoutSel.inventoryList);
    const list = await page.$(CheckoutSel.inventoryList);
    expect(list).not.toBeNull();
  });
});
