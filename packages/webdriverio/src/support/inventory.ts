import { InventorySelectors as Inv } from '@selectors/inventory.selectors';

/**
 * Adds three items (Backpack, Bike Light, Fleece Jacket) to the cart
 * from the inventory page.
 */
export async function addThreeItems(): Promise<void> {
  await $(Inv.addBackpack).click();
  await $(Inv.addBikeLight).click();
  await $(Inv.addFleeceJacket).click();
}
