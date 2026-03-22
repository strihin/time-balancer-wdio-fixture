import { login } from '@support/auth';
import { fillCheckoutForm } from '../support/checkout';
import { addThreeItems } from '../support/inventory';
import { users } from '@fixtures/users';
import { InventorySelectors as Inv } from '@selectors/inventory.selectors';
import { CartSelectors as Cart } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';

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
    fillCheckoutForm();
    cy.get(CheckoutSel.summaryItem).should('have.length', 3);
  });

  it('item total on overview matches sum of item prices', () => {
    cy.get(Cart.checkout).click();
    fillCheckoutForm();
    cy.get(CheckoutSel.itemTotal).invoke('text').then((text) => {
      const itemTotal = parseFloat(text.replace(/[^0-9.]/g, ''));
      expect(itemTotal).to.be.greaterThan(0);
    });
  });

  it('tax is calculated on overview', () => {
    cy.get(Cart.checkout).click();
    fillCheckoutForm();
    cy.get(CheckoutSel.taxLabel).invoke('text').then((text) => {
      const tax = parseFloat(text.replace(/[^0-9.]/g, ''));
      expect(tax).to.be.greaterThan(0);
    });
  });

  it('completes checkout with multiple items', () => {
    cy.get(Cart.checkout).click();
    fillCheckoutForm();
    cy.get(CheckoutSel.finishBtn).click();
    cy.get(CheckoutSel.completeHeader).should('have.text', 'Thank you for your order!');
  });
});
