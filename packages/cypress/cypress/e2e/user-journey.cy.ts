import { login } from '@support/auth';
import { fillCheckoutForm } from '../support/checkout';
import { users } from '@fixtures/users';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { CartSelectors as CartSel } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';
import { ProductSelectors as ProductSel } from '@selectors/product.selectors';
import { NavSelectors as NavSel } from '@selectors/nav.selectors';
import { LoginSelectors as LoginSel } from '@selectors/login.selectors';

describe('User Journey', () => {
  beforeEach(() => {
    login(users.glitch);
  });

  it('browse product detail then add to cart and checkout', () => {
    cy.get(InventorySel.itemName).first().click();
    cy.get(ProductSel.detailName).should('be.visible');
    cy.get(ProductSel.addToCartBtn).click();
    cy.get(InventorySel.cartLink).click();
    cy.get(CartSel.checkout).click();
    fillCheckoutForm();
    cy.get(CheckoutSel.finishBtn).click();
    cy.get(CheckoutSel.completeHeader).should('have.text', 'Thank you for your order!');
  });

  it('add item, return to shopping, add second item, checkout both', () => {
    cy.get(InventorySel.addBackpack).click();
    cy.get(InventorySel.cartLink).click();
    cy.get(CartSel.continueShopping).click();
    cy.get(InventorySel.addBikeLight).click();
    cy.get(InventorySel.cartBadge).should('have.text', '2');
    cy.get(InventorySel.cartLink).click();
    cy.get(CartSel.item).should('have.length', 2);
    cy.get(CartSel.checkout).click();
    fillCheckoutForm();
    cy.get(CheckoutSel.finishBtn).click();
    cy.get(CheckoutSel.completeHeader).should('be.visible');
  });

  it('remove one item mid-checkout then complete with remaining', () => {
    cy.get(InventorySel.addBackpack).click();
    cy.get(InventorySel.addBikeLight).click();
    cy.get(InventorySel.cartLink).click();
    cy.get(CartSel.removeBikeLight).click();
    cy.get(CartSel.item).should('have.length', 1);
    cy.get(CartSel.checkout).click();
    fillCheckoutForm();
    cy.get(CheckoutSel.finishBtn).click();
    cy.get(CheckoutSel.completeHeader).should('have.text', 'Thank you for your order!');
  });

  it('complete checkout and return to inventory via back-to-products', () => {
    cy.get(InventorySel.addBackpack).click();
    cy.get(InventorySel.cartLink).click();
    cy.get(CartSel.checkout).click();
    fillCheckoutForm();
    cy.get(CheckoutSel.finishBtn).click();
    cy.get(CheckoutSel.backToProducts).click();
    cy.get(InventorySel.list).should('be.visible');
    cy.get(InventorySel.item).should('have.length', 6);
  });

  it('full session: login → browse → checkout → logout', () => {
    cy.get(InventorySel.addFleeceJacket).click();
    cy.get(InventorySel.cartLink).click();
    cy.get(CartSel.checkout).click();
    fillCheckoutForm();
    cy.get(CheckoutSel.finishBtn).click();
    cy.get(CheckoutSel.backToProducts).click();
    cy.get(NavSel.burgerMenuBtn).click();
    cy.get(NavSel.logoutLink).click();
    cy.get(LoginSel.loginButton).should('be.visible');
  });
});
