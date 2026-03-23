import type { Page } from '@playwright/test';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';

/**
 * Adds three items (Backpack, Bike Light, Fleece Jacket) to the cart
 * from the inventory page.
 */
export async function addThreeItems(page: Page): Promise<void> {
  await page.locator(InventorySel.addBackpack).click();
  await page.locator(InventorySel.addBikeLight).click();
  await page.locator(InventorySel.addFleeceJacket).click();
}
