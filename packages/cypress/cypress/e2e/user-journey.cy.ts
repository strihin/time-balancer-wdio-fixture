import { login } from '@support/auth';
import { users } from '@fixtures/users';
import { checkoutForms } from '@fixtures/checkout';
import { InventorySelectors as Inv } from '@selectors/inventory.selectors';
import { CartSelectors as Cart } from '@selectors/cart.selectors';
import { CheckoutSelectors as Checkout } from '@selectors/checkout.selectors';
import { ProductSelectors as Product } from '@selectors/product.selectors';
import { NavSelectors as Nav } from '@selectors/nav.selectors';
import { LoginSelectors as Login } from '@selectors/login.selectors';

const { firstName, lastName, postalCode } = checkoutForms.valid;

function fillForm() {
  cy.get(Checkout.firstName).type(firstName);
  cy.get(Checkout.lastName).type(lastName);
  cy.get(Checkout.postalCode).type(postalCode);
  cy.get(Checkout.continueBtn).click();
}

describe('User Journey', () => {
  beforeEach(() => {
    login(users.glitch);
  });

  it('browse product detail then add to cart and checkout', () => {
    cy.get(Inv.itemName).first().click();
    cy.get(Product.detailName).should('be.visible');
    cy.get(Product.addToCartBtn).click();
    cy.get(Inv.cartLink).click();
    cy.get(Cart.checkout).click();
    fillForm();
    cy.get(Checkout.finishBtn).click();
    cy.get(Checkout.completeHeader).should('have.text', 'Thank you for your order!');
  });

  it('add item, return to shopping, add second item, checkout both', () => {
    cy.get(Inv.addBackpack).click();
    cy.get(Inv.cartLink).click();
    cy.get(Cart.continueShopping).click();
    cy.get(Inv.addBikeLight).click();
    cy.get(Inv.cartBadge).should('have.text', '2');
    cy.get(Inv.cartLink).click();
    cy.get(Cart.item).should('have.length', 2);
    cy.get(Cart.checkout).click();
    fillForm();
    cy.get(Checkout.finishBtn).click();
    cy.get(Checkout.completeHeader).should('be.visible');
  });

  it('remove one item mid-checkout then complete with remaining', () => {
    cy.get(Inv.addBackpack).click();
    cy.get(Inv.addBikeLight).click();
    cy.get(Inv.cartLink).click();
    cy.get(Cart.removeBikeLight).click();
    cy.get(Cart.item).should('have.length', 1);
    cy.get(Cart.checkout).click();
    fillForm();
    cy.get(Checkout.finishBtn).click();
    cy.get(Checkout.completeHeader).should('have.text', 'Thank you for your order!');
  });

  it('complete checkout and return to inventory via back-to-products', () => {
    cy.get(Inv.addBackpack).click();
    cy.get(Inv.cartLink).click();
    cy.get(Cart.checkout).click();
    fillForm();
    cy.get(Checkout.finishBtn).click();
    cy.get(Checkout.backToProducts).click();
    cy.get(Inv.list).should('be.visible');
    cy.get(Inv.item).should('have.length', 6);
  });

  it('full session: login → browse → checkout → logout', () => {
    cy.get(Inv.addFleeceJacket).click();
    cy.get(Inv.cartLink).click();
    cy.get(Cart.checkout).click();
    fillForm();
    cy.get(Checkout.finishBtn).click();
    cy.get(Checkout.backToProducts).click();
    cy.get(Nav.burgerMenuBtn).click();
    cy.get(Nav.logoutLink).click();
    cy.get(Login.loginButton).should('be.visible');
  });
});
