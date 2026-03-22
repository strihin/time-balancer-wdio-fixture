import { login } from '@support/auth';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { CartSelectors as CartSel } from '@selectors/cart.selectors';

describe('Cart', () => {
  beforeEach(() => {
    login();
  });

  it('cart is empty on first login', () => {
    cy.get(CartSel.badge).should('not.exist');
  });

  it('adds an item and cart badge shows 1', () => {
    cy.get(InventorySel.addBackpack).click();
    cy.get(CartSel.badge).should('have.text', '1');
  });

  it('opens cart page and shows added item', () => {
    cy.get(InventorySel.addBackpack).click();
    cy.get(CartSel.link).click();
    cy.get(CartSel.item).should('be.visible');
  });

  it('removes an item from the cart', () => {
    cy.get(InventorySel.addBackpack).click();
    cy.get(CartSel.link).click();
    cy.get(CartSel.removeBackpack).click();
    cy.get(CartSel.item).should('not.exist');
  });

  it('cart badge updates when adding multiple items', () => {
    cy.get(InventorySel.addBackpack).click();
    cy.get(InventorySel.addBikeLight).click();
    cy.get(CartSel.badge).should('have.text', '2');
  });
});
