import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { login } from '@support/auth';

describe('Inventory', () => {
  beforeEach(() => {
    login();
  });

  it('shows the inventory list after login', () => {
    cy.get(InventorySel.list).should('be.visible');
  });

  it('shows 6 items in the inventory', () => {
    cy.get(InventorySel.item).should('have.length', 6);
  });

  it('each item has a name and price', () => {
    cy.get(InventorySel.itemName).should('have.length', 6);
    cy.get(InventorySel.itemPrice).should('have.length', 6);
    cy.get(InventorySel.itemPrice).each(($price) => {
      const text = $price.text();
      expect(text).to.match(/^\$\d+\.\d{2}$/);
    });
  });

  it('adds an item to cart from inventory page', () => {
    cy.get(InventorySel.addBackpack).click();
    cy.get(InventorySel.cartBadge).should('have.text', '1');
  });

  it('remove button replaces add button after adding item', () => {
    cy.get(InventorySel.addBackpack).click();
    cy.get(InventorySel.removeBackpack).should('be.visible');
    cy.get(InventorySel.addBackpack).should('not.exist');
  });
});
