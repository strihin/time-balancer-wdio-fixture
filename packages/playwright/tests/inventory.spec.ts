import { test, expect, describe, beforeEach, afterEach, beforeAll, afterAll } from '@support/test';
import { login } from '@support/auth';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';

describe('Inventory', () => {
  beforeEach(async ({ page }) => {
    await login(page);
  });

  test('shows the inventory list after login', async ({ page }) => {
    await expect(page.locator(InventorySel.list)).toBeVisible();
  });

  test('shows 6 items in the inventory', async ({ page }) => {
    await expect(page.locator(InventorySel.item)).toHaveCount(6);
  });

  test('each item has a name and price', async ({ page }) => {
    await expect(page.locator(InventorySel.itemName)).toHaveCount(6);
    await expect(page.locator(InventorySel.itemPrice)).toHaveCount(6);
    const prices = await page.locator(InventorySel.itemPrice).allTextContents();
    for (const price of prices) {
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
    }
  });

  test('adds an item to cart from inventory page', async ({ page }) => {
    await page.locator(InventorySel.addBackpack).click();
    await expect(page.locator(InventorySel.cartBadge)).toHaveText('1');
  });

  test('remove button replaces add button after adding item', async ({ page }) => {
    await page.locator(InventorySel.addBackpack).click();
    await expect(page.locator(InventorySel.removeBackpack)).toBeVisible();
    await expect(page.locator(InventorySel.addBackpack)).not.toBeVisible();
  });
});
