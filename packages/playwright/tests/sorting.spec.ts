import { test, expect } from '@playwright/test';
import { login } from '@support/auth';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { sortOptions } from '@fixtures/checkout';

test.describe('Sorting', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await expect(page.locator(InventorySel.sortContainer)).toBeVisible();
  });

  test('default sort is Name (A to Z)', async ({ page }) => {
    const texts = await page.locator(InventorySel.itemName).allTextContents();
    expect(texts).toEqual([...texts].sort());
  });

  test('sorts by Name (Z to A)', async ({ page }) => {
    await page.locator(InventorySel.sortContainer).selectOption(sortOptions.nameZtoA.label);
    const texts = await page.locator(InventorySel.itemName).allTextContents();
    expect(texts).toEqual([...texts].sort().reverse());
  });

  test('sorts by Price (low to high)', async ({ page }) => {
    await page.locator(InventorySel.sortContainer).selectOption(sortOptions.priceLowToHigh.label);
    const priceTexts = await page.locator(InventorySel.itemPrice).allTextContents();
    const vals = priceTexts.map(t => parseFloat(t.replace('$', '')));
    expect(vals).toEqual([...vals].sort((a, b) => a - b));
  });

  test('sorts by Price (high to low)', async ({ page }) => {
    await page.locator(InventorySel.sortContainer).selectOption(sortOptions.priceHighToLow.label);
    const priceTexts = await page.locator(InventorySel.itemPrice).allTextContents();
    const vals = priceTexts.map(t => parseFloat(t.replace('$', '')));
    expect(vals).toEqual([...vals].sort((a, b) => b - a));
  });

  test('item count remains 6 after any sort', async ({ page }) => {
    await page.locator(InventorySel.sortContainer).selectOption(sortOptions.priceHighToLow.label);
    await expect(page.locator(InventorySel.item)).toHaveCount(6);
  });
});
