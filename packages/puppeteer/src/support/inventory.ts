import type { Page } from 'puppeteer';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';

/**
 * Adds three items (Backpack, Bike Light, Fleece Jacket) to the cart
 * from the inventory page.
 */
export async function addThreeItems(page: Page): Promise<void> {
  await page.click(InventorySel.addBackpack);
  await page.click(InventorySel.addBikeLight);
  await page.click(InventorySel.addFleeceJacket);
}
