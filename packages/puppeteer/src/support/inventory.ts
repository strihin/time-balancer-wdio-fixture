import type { Page } from 'puppeteer';
import { InventorySelectors as Inv } from '@selectors/inventory.selectors';

/**
 * Adds three items (Backpack, Bike Light, Fleece Jacket) to the cart
 * from the inventory page.
 */
export async function addThreeItems(page: Page): Promise<void> {
  await page.click(Inv.addBackpack);
  await page.click(Inv.addBikeLight);
  await page.click(Inv.addFleeceJacket);
}
