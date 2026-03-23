import { CartSelectors as CartSel } from '@selectors/cart.selectors';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { login } from '@support/auth';
import { beforeEach, describe, expect, test } from '@support/test';

describe('Cart', () => {
  beforeEach(async ({ page }) => {
    await login(page);
  });

  test('cart is empty on first login', async ({ page }) => {
    await expect(page.locator(CartSel.badge)).not.toBeVisible();
  });

  test('adds an item and cart badge shows 1', async ({ page }) => {
    await page.locator(InventorySel.addBackpack).click();
    await expect(page.locator(CartSel.badge)).toHaveText('1');
  });

  test('opens cart page and shows added item', async ({ page }) => {
    await page.locator(InventorySel.addBackpack).click();
    await page.locator(CartSel.link).click();
    await expect(page.locator(CartSel.item)).toBeVisible();
  });

  test('removes an item from the cart', async ({ page }) => {
    await page.locator(InventorySel.addBackpack).click();
    await page.locator(CartSel.link).click();
    await page.locator(CartSel.removeBackpack).click();
    await expect(page.locator(CartSel.item)).not.toBeVisible();
  });

  test('cart badge updates when adding multiple items', async ({ page }) => {
    await page.locator(InventorySel.addBackpack).click();
    await page.locator(InventorySel.addBikeLight).click();
    await expect(page.locator(CartSel.badge)).toHaveText('2');
  });
});
