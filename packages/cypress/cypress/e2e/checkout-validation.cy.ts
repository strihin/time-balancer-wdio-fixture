import { login } from '@support/auth';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { CartSelectors as CartSel } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';

describe('Checkout – Form Validation', () => {
  beforeEach(() => {
    login();
    cy.get(InventorySel.addBackpack).click();
    cy.get(InventorySel.cartLink).click();
    cy.get(CartSel.checkout).click();
    cy.get(CheckoutSel.infoContainer).should('be.visible');
  });

  it('shows error when first name is missing', () => {
    cy.get(CheckoutSel.lastName).type('Doe');
    cy.get(CheckoutSel.postalCode).type('10001');
    cy.get(CheckoutSel.continueBtn).click();
    cy.get(CheckoutSel.error).should('contain.text', 'First Name');
  });

  it('shows error when last name is missing', () => {
    cy.get(CheckoutSel.firstName).type('Jane');
    cy.get(CheckoutSel.postalCode).type('10001');
    cy.get(CheckoutSel.continueBtn).click();
    cy.get(CheckoutSel.error).should('contain.text', 'Last Name');
  });

  it('shows error when postal code is missing', () => {
    cy.get(CheckoutSel.firstName).type('Jane');
    cy.get(CheckoutSel.lastName).type('Doe');
    cy.get(CheckoutSel.continueBtn).click();
    cy.get(CheckoutSel.error).should('contain.text', 'Postal Code');
  });

  it('shows error when all fields are empty', () => {
    cy.get(CheckoutSel.continueBtn).click();
    cy.get(CheckoutSel.error).should('be.visible');
  });

  it('cancel button returns to cart page', () => {
    cy.get(CheckoutSel.cancelBtn).click();
    cy.get(CartSel.item).should('be.visible');
  });
});
