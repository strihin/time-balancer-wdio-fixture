import { login } from '@support/auth';
import { getItemNames, getItemPrices } from '@support/sorting';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { sortOptions } from '@fixtures/checkout';

describe('Sorting', () => {
  beforeEach(async () => {
    await login();
    await $(InventorySel.sortContainer).waitForDisplayed({ timeout: 5000 });
  });

  it('default sort is Name (A to Z)', async () => {
    const texts = await getItemNames();
    expect(texts).toEqual([...texts].sort());
  });

  it('sorts by Name (Z to A)', async () => {
    await $(InventorySel.sortContainer).selectByVisibleText(sortOptions.nameZtoA.label);
    const texts = await getItemNames();
    expect(texts).toEqual([...texts].sort().reverse());
  });

  it('sorts by Price (low to high)', async () => {
    await $(InventorySel.sortContainer).selectByVisibleText(sortOptions.priceLowToHigh.label);
    const vals = await getItemPrices();
    expect(vals).toEqual([...vals].sort((a, b) => a - b));
  });

  it('sorts by Price (high to low)', async () => {
    await $(InventorySel.sortContainer).selectByVisibleText(sortOptions.priceHighToLow.label);
    const vals = await getItemPrices();
    expect(vals).toEqual([...vals].sort((a, b) => b - a));
  });

  it('item count remains 6 after any sort', async () => {
    await $(InventorySel.sortContainer).selectByVisibleText(sortOptions.priceHighToLow.label);
    const items = await $$(InventorySel.item);
    expect(items.length).toBe(6);
  });
});
