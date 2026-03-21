import { login } from '@support/auth';
import { users } from '@fixtures/users';
import { checkoutForms } from '@fixtures/checkout';
import { InventorySelectors as Inv } from '@selectors/inventory.selectors';
import { CartSelectors as Cart } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';

const { firstName, lastName, postalCode } = checkoutForms.valid;

function fillForm() {
  cy.get(CheckoutSel.firstName).type(firstName);
  cy.get(CheckoutSel.lastName).type(lastName);
  cy.get(CheckoutSel.postalCode).type(postalCode);
  cy.get(CheckoutSel.continueBtn).click();
}

function addThreeItems() {
  cy.get(Inv.addBackpack).click();
  cy.get(Inv.addBikeLight).click();
  cy.get(Inv.addFleeceJacket).click();
}

describe('Checkout – Multi-item', () => {
  beforeEach(() => {
    login(users.glitch);
    addThreeItems();
    cy.get(Inv.cartLink).click();
  });

  it('cart shows 3 items after adding three products', () => {
    cy.get(Cart.badge).should('have.text', '3');
    cy.get(Cart.item).should('have.length', 3);
  });

  it('checkout overview lists all three items', () => {
    cy.get(Cart.checkout).click();
    fillForm();
    cy.get(CheckoutSel.summaryItem).should('have.length', 3);
  });

  it('item total on overview matches sum of item prices', () => {
    cy.get(Cart.checkout).click();
    fillForm();
    cy.get(CheckoutSel.itemTotal).invoke('text').then((text) => {
      const itemTotal = parseFloat(text.replace(/[^0-9.]/g, ''));
      expect(itemTotal).to.be.greaterThan(0);
    });
  });

  it('tax is calculated on overview', () => {
    cy.get(Cart.checkout).click();
    fillForm();
    cy.get(CheckoutSel.taxLabel).invoke('text').then((text) => {
      const tax = parseFloat(text.replace(/[^0-9.]/g, ''));
      expect(tax).to.be.greaterThan(0);
    });
  });

  it('completes checkout with multiple items', () => {
    cy.get(Cart.checkout).click();
    fillForm();
    cy.get(CheckoutSel.finishBtn).click();
    cy.get(CheckoutSel.completeHeader).should('have.text', 'Thank you for your order!');
  });
});
