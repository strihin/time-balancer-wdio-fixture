import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';

/**
 * Adds three items (Backpack, Bike Light, Fleece Jacket) to the cart
 * from the inventory page.
 */
export async function addThreeItems(): Promise<void> {
  await $(InventorySel.addBackpack).click();
  await $(InventorySel.addBikeLight).click();
  await $(InventorySel.addFleeceJacket).click();
}
