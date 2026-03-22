import { InventorySelectors as Inv } from '@selectors/inventory.selectors';

/**
 * Adds three items (Backpack, Bike Light, Fleece Jacket) to the cart
 * from the inventory page.
 */
export function addThreeItems(): void {
  cy.get(Inv.addBackpack).click();
  cy.get(Inv.addBikeLight).click();
  cy.get(Inv.addFleeceJacket).click();
}
