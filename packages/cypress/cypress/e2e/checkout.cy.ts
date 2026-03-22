import { login } from '@support/auth';
import { fillCheckoutForm } from '../support/checkout';
import { users } from '@fixtures/users';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { CartSelectors as CartSel } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';

describe('Checkout', () => {
  beforeEach(() => {
    login(users.glitch);
    cy.get(InventorySel.addBackpack).click();
    cy.get(CartSel.link).click();
  });

  it('proceeds to checkout from cart', () => {
    cy.get(CartSel.checkout).click();
    cy.get(CheckoutSel.infoContainer).should('be.visible');
  });

  it('fills in customer info and continues to overview', () => {
    cy.get(CartSel.checkout).click();
    fillCheckoutForm();
    cy.get(CheckoutSel.summaryContainer).should('be.visible');
  });

  it('overview shows item total', () => {
    cy.get(CartSel.checkout).click();
    fillCheckoutForm();
    cy.get(CheckoutSel.totalLabel).should('be.visible');
  });

  it('completes full checkout and shows confirmation', () => {
    cy.get(CartSel.checkout).click();
    fillCheckoutForm();
    cy.get(CheckoutSel.finishBtn).click();
    cy.get(CheckoutSel.completeHeader).should('have.text', 'Thank you for your order!');
  });

  it('can navigate back to home after checkout', () => {
    cy.get(CartSel.checkout).click();
    fillCheckoutForm();
    cy.get(CheckoutSel.finishBtn).click();
    cy.get(CheckoutSel.backToProducts).click();
    cy.get(CheckoutSel.inventoryList).should('be.visible');
  });
});
