import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { parseCurrencyText } from '@utils/price';

/** Returns the text content of all item name elements on the inventory page. */
export function getItemNames(): Cypress.Chainable<string[]> {
  return cy.get(InventorySel.itemName).then(($elements) => {
    return Cypress.$.makeArray($elements).map(el => (el as HTMLElement).innerText);
  });
}

/** Returns the parsed numeric price of all item price elements on the inventory page. */
export function getItemPrices(): Cypress.Chainable<number[]> {
  return cy.get(InventorySel.itemPrice).then(($elements) => {
    return Cypress.$.makeArray($elements).map(el => parseCurrencyText((el as HTMLElement).innerText));
  });
}
