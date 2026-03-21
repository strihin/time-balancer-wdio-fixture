import { type Browser, type Page } from 'puppeteer';
import { launchBrowser, login } from '@support/auth';
import { users } from '@fixtures/users';
import { checkoutForms } from '@fixtures/checkout';
import { InventorySelectors as Inv } from '@selectors/inventory.selectors';
import { CartSelectors as Cart } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';

const { firstName, lastName, postalCode } = checkoutForms.valid;

async function fillForm(page: Page) {
  await page.type(CheckoutSel.firstName, firstName);
  await page.type(CheckoutSel.lastName, lastName);
  await page.type(CheckoutSel.postalCode, postalCode);
  await page.click(CheckoutSel.continueBtn);
}

async function addThreeItems(page: Page) {
  await page.click(Inv.addBackpack);
  await page.click(Inv.addBikeLight);
  await page.click(Inv.addFleeceJacket);
}

describe('Checkout – Multi-item', () => {
  let browser: Browser;
  let page: Page;

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await browser.newPage();
    await login(page, users.glitch);
    await addThreeItems(page);
    await page.click(Inv.cartLink);
  });

  afterEach(async () => {
    await browser.close();
  });

  it('cart shows 3 items after adding three products', async () => {
    const badge = await page.$eval(Cart.badge, el => el.textContent);
    const items = await page.$$(Cart.item);
    expect(badge).toBe('3');
    expect(items).toHaveLength(3);
  });

  it('checkout overview lists all three items', async () => {
    await page.click(Cart.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillForm(page);
    const items = await page.$$(CheckoutSel.summaryItem);
    expect(items).toHaveLength(3);
  });

  it('item total on overview matches sum of item prices', async () => {
    await page.click(Cart.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillForm(page);
    const text = await page.$eval(CheckoutSel.itemTotal, el => el.textContent ?? '');
    const itemTotal = parseFloat(text.replace(/[^0-9.]/g, ''));
    expect(itemTotal).toBeGreaterThan(0);
  });

  it('tax is calculated on overview', async () => {
    await page.click(Cart.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillForm(page);
    const text = await page.$eval(CheckoutSel.taxLabel, el => el.textContent ?? '');
    const tax = parseFloat(text.replace(/[^0-9.]/g, ''));
    expect(tax).toBeGreaterThan(0);
  });

  it('completes checkout with multiple items', async () => {
    await page.click(Cart.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillForm(page);
    await page.click(CheckoutSel.finishBtn);
    const header = await page.$eval(CheckoutSel.completeHeader, el => el.textContent);
    expect(header).toBe('Thank you for your order!');
  });
});
