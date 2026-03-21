import { login } from '@support/auth';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';

describe('Inventory', () => {
  beforeEach(async () => {
    await login();
  });

  it('shows the inventory list after login', async () => {
    await expect($(InventorySel.list)).toBeDisplayed();
  });

  it('shows 6 items in the inventory', async () => {
    const items = await $$(InventorySel.item);
    expect(items.length).toBe(6);
  });

  it('each item has a name and price', async () => {
    const names = await $$(InventorySel.itemName);
    const prices = await $$(InventorySel.itemPrice);
    expect(names.length).toBe(6);
    expect(prices.length).toBe(6);
    for (const price of prices) {
      const text = await price.getText();
      expect(text).toMatch(/^\$\d+\.\d{2}$/);
    }
  });

  it('adds an item to cart from inventory page', async () => {
    await $(InventorySel.addBackpack).click();
    await expect($(InventorySel.cartBadge)).toHaveText('1');
  });

  it('remove button replaces add button after adding item', async () => {
    await $(InventorySel.addBackpack).click();
    await expect($(InventorySel.removeBackpack)).toBeDisplayed();
    await expect($(InventorySel.addBackpack)).not.toBeDisplayed();
  });
});
