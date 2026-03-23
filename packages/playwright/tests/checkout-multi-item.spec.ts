import { CHECKOUT_SUCCESS_MSG } from '@constants/index';
import { users } from '@fixtures/users';
import { CartSelectors as CartSel } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { login } from '@support/auth';
import { fillCheckoutForm } from '@support/checkout';
import { addThreeItems } from '@support/inventory';
import { beforeEach, describe, expect, test } from '@support/test';
import { parseCurrencyText } from '@utils/price';

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
    await fillCheckoutForm(page);
    await expect(page.locator(CheckoutSel.summaryItem)).toHaveCount(3);
  });

  test('item total on overview matches sum of item prices', async ({ page }) => {
    await page.locator(CartSel.checkout).click();
    await fillCheckoutForm(page);
    const text = (await page.locator(CheckoutSel.itemTotal).textContent()) ?? '';
    const itemTotal = parseCurrencyText(text);
    expect(itemTotal).toBeGreaterThan(0);
  });

  test('tax is calculated on overview', async ({ page }) => {
    await page.locator(CartSel.checkout).click();
    await fillCheckoutForm(page);
    const text = (await page.locator(CheckoutSel.taxLabel).textContent()) ?? '';
    const tax = parseCurrencyText(text);
    expect(tax).toBeGreaterThan(0);
  });

  test('completes checkout with multiple items', async ({ page }) => {
    await page.locator(CartSel.checkout).click();
    await fillCheckoutForm(page);
    await page.locator(CheckoutSel.finishBtn).click();
    await expect(page.locator(CheckoutSel.completeHeader)).toHaveText(CHECKOUT_SUCCESS_MSG);
  });
});
