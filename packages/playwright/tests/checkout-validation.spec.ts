import { CartSelectors as CartSel } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { login } from '@support/auth';
import { beforeEach, describe, expect, test } from '@support/test';

describe('Checkout – Form Validation', () => {
  beforeEach(async ({ page }) => {
    await login(page);
    await page.locator(InventorySel.addBackpack).click();
    await page.locator(InventorySel.cartLink).click();
    await page.locator(CartSel.checkout).click();
    await expect(page.locator(CheckoutSel.infoContainer)).toBeVisible();
  });

  test('shows error when first name is missing', async ({ page }) => {
    await page.locator(CheckoutSel.lastName).fill('Doe');
    await page.locator(CheckoutSel.postalCode).fill('10001');
    await page.locator(CheckoutSel.continueBtn).click();
    await expect(page.locator(CheckoutSel.error)).toContainText('First Name');
  });

  test('shows error when last name is missing', async ({ page }) => {
    await page.locator(CheckoutSel.firstName).fill('Jane');
    await page.locator(CheckoutSel.postalCode).fill('10001');
    await page.locator(CheckoutSel.continueBtn).click();
    await expect(page.locator(CheckoutSel.error)).toContainText('Last Name');
  });

  test('shows error when postal code is missing', async ({ page }) => {
    await page.locator(CheckoutSel.firstName).fill('Jane');
    await page.locator(CheckoutSel.lastName).fill('Doe');
    await page.locator(CheckoutSel.continueBtn).click();
    await expect(page.locator(CheckoutSel.error)).toContainText('Postal Code');
  });

  test('shows error when all fields are empty', async ({ page }) => {
    await page.locator(CheckoutSel.continueBtn).click();
    await expect(page.locator(CheckoutSel.error)).toBeVisible();
  });

  test('cancel button returns to cart page', async ({ page }) => {
    await page.locator(CheckoutSel.cancelBtn).click();
    await expect(page.locator(CartSel.item)).toBeVisible();
  });
});
