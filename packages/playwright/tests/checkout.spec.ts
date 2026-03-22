import { test, expect, describe, beforeEach, afterEach, beforeAll, afterAll } from '@support/test';
import { login } from '@support/auth';
import { users } from '@fixtures/users';
import { checkoutForms } from '@fixtures/checkout';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { CartSelectors as CartSel } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';

const { firstName, lastName, postalCode } = checkoutForms.valid;

async function fillCheckoutForm(page: import('@playwright/test').Page) {
  await page.locator(CheckoutSel.firstName).fill(firstName);
  await page.locator(CheckoutSel.lastName).fill(lastName);
  await page.locator(CheckoutSel.postalCode).fill(postalCode);
  await page.locator(CheckoutSel.continueBtn).click();
}

describe('Checkout', () => {
  beforeEach(async ({ page }) => {
    await login(page, users.glitch);
    await page.locator(InventorySel.addBackpack).click();
    await page.locator(CartSel.link).click();
  });

  test('proceeds to checkout from cart', async ({ page }) => {
    await page.locator(CartSel.checkout).click();
    await expect(page.locator(CheckoutSel.infoContainer)).toBeVisible();
  });

  test('fills in customer info and continues to overview', async ({ page }) => {
    await page.locator(CartSel.checkout).click();
    await fillCheckoutForm(page);
    await expect(page.locator(CheckoutSel.summaryContainer)).toBeVisible();
  });

  test('overview shows item total', async ({ page }) => {
    await page.locator(CartSel.checkout).click();
    await fillCheckoutForm(page);
    await expect(page.locator(CheckoutSel.totalLabel)).toBeVisible();
  });

  test('completes full checkout and shows confirmation', async ({ page }) => {
    await page.locator(CartSel.checkout).click();
    await fillCheckoutForm(page);
    await page.locator(CheckoutSel.finishBtn).click();
    await expect(page.locator(CheckoutSel.completeHeader)).toHaveText('Thank you for your order!');
  });

  test('can navigate back to home after checkout', async ({ page }) => {
    await page.locator(CartSel.checkout).click();
    await fillCheckoutForm(page);
    await page.locator(CheckoutSel.finishBtn).click();
    await page.locator(CheckoutSel.backToProducts).click();
    await expect(page.locator(CheckoutSel.inventoryList)).toBeVisible();
  });
});
