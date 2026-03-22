import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';

/**
 * Adds three items (Backpack, Bike Light, Fleece Jacket) to the cart
 * from the inventory page.
 */
export function addThreeItems(): void {
  cy.get(InventorySel.addBackpack).click();
  cy.get(InventorySel.addBikeLight).click();
  cy.get(InventorySel.addFleeceJacket).click();
}
