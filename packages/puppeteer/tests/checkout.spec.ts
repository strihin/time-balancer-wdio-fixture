import { type Browser, type Page } from 'puppeteer';
import { launchBrowser, login } from '@support/auth';
import { users } from '@fixtures/users';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { CartSelectors as CartSel } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';
import { fillForm } from '@support/fill-form';
import { CHECKOUT_SUCCESS_MSG } from '@constants/index';


describe('Checkout', () => {
  let browser: Browser;
  let page: Page;

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await browser.newPage();
    await login(page, users.standard);
    await page.click(InventorySel.addBackpack);
    await page.click(CartSel.link);
  });

  afterEach(async () => {
    await browser?.close();
  });

  it('proceeds to checkout from cart', async () => {
    await page.click(CartSel.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    const container = await page.$(CheckoutSel.infoContainer);
    expect(container).not.toBeNull();
  });

  it('fills in customer info and continues to overview', async () => {
    await page.click(CartSel.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillForm(page);
    await page.waitForSelector(CheckoutSel.summaryContainer);
    const summary = await page.$(CheckoutSel.summaryContainer);
    expect(summary).not.toBeNull();
  });

  it('overview shows item total', async () => {
    await page.click(CartSel.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillForm(page);
    await page.waitForSelector(CheckoutSel.totalLabel);
    const total = await page.$(CheckoutSel.totalLabel);
    expect(total).not.toBeNull();
  });

  it('completes full checkout and shows confirmation', async () => {
    await page.click(CartSel.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillForm(page);
    await page.waitForSelector(CheckoutSel.finishBtn);
    await page.click(CheckoutSel.finishBtn);
    const header = await page.$eval(CheckoutSel.completeHeader, el => el.textContent);
    expect(header).toBe(CHECKOUT_SUCCESS_MSG);
  });

  it('can navigate back to home after checkout', async () => {
    await page.click(CartSel.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillForm(page);
    await page.waitForSelector(CheckoutSel.finishBtn);
    await page.click(CheckoutSel.finishBtn);
    await page.waitForSelector(CheckoutSel.backToProducts);
    await page.click(CheckoutSel.backToProducts);
    await page.waitForSelector(CheckoutSel.inventoryList);
    const list = await page.$(CheckoutSel.inventoryList);
    expect(list).not.toBeNull();
  });
});
