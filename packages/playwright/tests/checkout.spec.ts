import { test, expect, describe, beforeEach, afterEach, beforeAll, afterAll } from '@support/test';
import { login } from '@support/auth';
import { fillCheckoutForm } from '@support/checkout';
import { users } from '@fixtures/users';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { CartSelectors as CartSel } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';
import { CHECKOUT_SUCCESS_MSG } from '@constants/index';

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
    await expect(page.locator(CheckoutSel.completeHeader)).toHaveText(CHECKOUT_SUCCESS_MSG);
  });

  test('can navigate back to home after checkout', async ({ page }) => {
    await page.locator(CartSel.checkout).click();
    await fillCheckoutForm(page);
    await page.locator(CheckoutSel.finishBtn).click();
    await page.locator(CheckoutSel.backToProducts).click();
    await expect(page.locator(CheckoutSel.inventoryList)).toBeVisible();
  });
});
