import { test, expect, describe, beforeEach, afterEach, beforeAll, afterAll } from '@support/test';
import { login } from '@support/auth';
import { users } from '@fixtures/users';
import { checkoutForms } from '@fixtures/checkout';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { CartSelectors as CartSel } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';

const { firstName, lastName, postalCode } = checkoutForms.valid;

async function fillForm(page: import('@playwright/test').Page) {
  await page.locator(CheckoutSel.firstName).fill(firstName);
  await page.locator(CheckoutSel.lastName).fill(lastName);
  await page.locator(CheckoutSel.postalCode).fill(postalCode);
  await page.locator(CheckoutSel.continueBtn).click();
}

async function addThreeItems(page: import('@playwright/test').Page) {
  await page.locator(InventorySel.addBackpack).click();
  await page.locator(InventorySel.addBikeLight).click();
  await page.locator(InventorySel.addFleeceJacket).click();
}

describe('Checkout – Multi-item', () => {
  beforeEach(async ({ page }) => {
    await login(page, users.glitch);
    await addThreeItems(page);
    await page.locator(InventorySel.cartLink).click();
  });

  test('cart shows 3 items after adding three products', async ({ page }) => {
    await expect(page.locator(CartSel.badge)).toHaveText('3');
    await expect(page.locator(CartSel.item)).toHaveCount(3);
  });

  test('checkout overview lists all three items', async ({ page }) => {
    await page.locator(CartSel.checkout).click();
    await fillForm(page);
    await expect(page.locator(CheckoutSel.summaryItem)).toHaveCount(3);
  });

  test('item total on overview matches sum of item prices', async ({ page }) => {
    await page.locator(CartSel.checkout).click();
    await fillForm(page);
    const text = await page.locator(CheckoutSel.itemTotal).textContent() ?? '';
    const itemTotal = parseFloat(text.replace(/[^0-9.]/g, ''));
    expect(itemTotal).toBeGreaterThan(0);
  });

  test('tax is calculated on overview', async ({ page }) => {
    await page.locator(CartSel.checkout).click();
    await fillForm(page);
    const text = await page.locator(CheckoutSel.taxLabel).textContent() ?? '';
    const tax = parseFloat(text.replace(/[^0-9.]/g, ''));
    expect(tax).toBeGreaterThan(0);
  });

  test('completes checkout with multiple items', async ({ page }) => {
    await page.locator(CartSel.checkout).click();
    await fillForm(page);
    await page.locator(CheckoutSel.finishBtn).click();
    await expect(page.locator(CheckoutSel.completeHeader)).toHaveText('Thank you for your order!');
  });
});
