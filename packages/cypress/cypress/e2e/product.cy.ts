import { ProductSelectors as ProductSel } from '@selectors/product.selectors';
import { login } from '@support/auth';

describe('Product Detail', () => {
  beforeEach(() => {
    login();
  });

  it('opens product detail page on item click', () => {
    cy.get(ProductSel.itemName).first().click();
    cy.get(ProductSel.detailName).should('be.visible');
  });

  it('product detail shows correct name', () => {
    cy.get(ProductSel.itemName)
      .first()
      .invoke('text')
      .then((name) => {
        cy.get(ProductSel.itemName).first().click();
        cy.get(ProductSel.detailName).should('have.text', name);
      });
  });

  it('back button returns to inventory', () => {
    cy.get(ProductSel.itemName).first().click();
    cy.get(ProductSel.backToProducts).click();
    cy.get(ProductSel.inventoryList).should('be.visible');
  });

  it('product image is visible on detail page', () => {
    cy.get(ProductSel.itemName).first().click();
    cy.get(ProductSel.detailImage).should('be.visible');
  });

  it('adds item to cart from detail page', () => {
    cy.get(ProductSel.itemName).first().click();
    cy.get(ProductSel.addToCartBtn).click();
    cy.get(ProductSel.cartBadge).should('have.text', '1');
  });
});
