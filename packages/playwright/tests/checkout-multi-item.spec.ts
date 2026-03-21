import { test, expect } from '@playwright/test';
import { login } from '@support/auth';
import { users } from '@fixtures/users';
import { checkoutForms } from '@fixtures/checkout';
import { InventorySelectors as Inv } from '@selectors/inventory.selectors';
import { CartSelectors as Cart } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';

const { firstName, lastName, postalCode } = checkoutForms.valid;

async function fillForm(page: import('@playwright/test').Page) {
  await page.locator(CheckoutSel.firstName).fill(firstName);
  await page.locator(CheckoutSel.lastName).fill(lastName);
  await page.locator(CheckoutSel.postalCode).fill(postalCode);
  await page.locator(CheckoutSel.continueBtn).click();
}

async function addThreeItems(page: import('@playwright/test').Page) {
  await page.locator(Inv.addBackpack).click();
  await page.locator(Inv.addBikeLight).click();
  await page.locator(Inv.addFleeceJacket).click();
}

test.describe('Checkout – Multi-item', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, users.glitch);
    await addThreeItems(page);
    await page.locator(Inv.cartLink).click();
  });

  test('cart shows 3 items after adding three products', async ({ page }) => {
    await expect(page.locator(Cart.badge)).toHaveText('3');
    await expect(page.locator(Cart.item)).toHaveCount(3);
  });

  test('checkout overview lists all three items', async ({ page }) => {
    await page.locator(Cart.checkout).click();
    await fillForm(page);
    await expect(page.locator(CheckoutSel.summaryItem)).toHaveCount(3);
  });

  test('item total on overview matches sum of item prices', async ({ page }) => {
    await page.locator(Cart.checkout).click();
    await fillForm(page);
    const text = await page.locator(CheckoutSel.itemTotal).textContent() ?? '';
    const itemTotal = parseFloat(text.replace(/[^0-9.]/g, ''));
    expect(itemTotal).toBeGreaterThan(0);
  });

  test('tax is calculated on overview', async ({ page }) => {
    await page.locator(Cart.checkout).click();
    await fillForm(page);
    const text = await page.locator(CheckoutSel.taxLabel).textContent() ?? '';
    const tax = parseFloat(text.replace(/[^0-9.]/g, ''));
    expect(tax).toBeGreaterThan(0);
  });

  test('completes checkout with multiple items', async ({ page }) => {
    await page.locator(Cart.checkout).click();
    await fillForm(page);
    await page.locator(CheckoutSel.finishBtn).click();
    await expect(page.locator(CheckoutSel.completeHeader)).toHaveText('Thank you for your order!');
  });
});
