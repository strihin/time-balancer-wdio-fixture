import { sortOptions } from '@fixtures/checkout';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { login } from '@support/auth';
import { getItemNames, getItemPrices } from '@support/sorting';

describe('Sorting', () => {
  beforeEach(() => {
    login();
    cy.get(InventorySel.sortContainer).should('be.visible');
  });

  it('default sort is Name (A to Z)', () => {
    getItemNames().then((texts) => {
      expect(texts).to.deep.equal([...texts].sort());
    });
  });

  it('sorts by Name (Z to A)', () => {
    cy.get(InventorySel.sortContainer).select(sortOptions.nameZtoA.label);
    getItemNames().then((texts) => {
      expect(texts).to.deep.equal([...texts].sort().reverse());
    });
  });

  it('sorts by Price (low to high)', () => {
    cy.get(InventorySel.sortContainer).select(sortOptions.priceLowToHigh.label);
    getItemPrices().then((vals) => {
      expect(vals).to.deep.equal([...vals].sort((a, b) => a - b));
    });
  });

  it('sorts by Price (high to low)', () => {
    cy.get(InventorySel.sortContainer).select(sortOptions.priceHighToLow.label);
    getItemPrices().then((vals) => {
      expect(vals).to.deep.equal([...vals].sort((a, b) => b - a));
    });
  });

  it('item count remains 6 after any sort', () => {
    cy.get(InventorySel.sortContainer).select(sortOptions.priceHighToLow.label);
    cy.get(InventorySel.item).should('have.length', 6);
  });
});
