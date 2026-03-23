import { CartSelectors as CartSel } from '@selectors/cart.selectors';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { login } from '@support/auth';

describe('Cart', () => {
  beforeEach(async () => {
    await login();
  });

  it('cart is empty on first login', async () => {
    await expect($(CartSel.badge)).not.toBeDisplayed();
  });

  it('adds an item and cart badge shows 1', async () => {
    await $(InventorySel.addBackpack).click();
    await expect($(CartSel.badge)).toHaveText('1');
  });

  it('opens cart page and shows added item', async () => {
    await $(InventorySel.addBackpack).click();
    await $(CartSel.link).click();
    await expect($(CartSel.item)).toBeDisplayed();
  });

  it('removes an item from the cart', async () => {
    await $(InventorySel.addBackpack).click();
    await $(CartSel.link).click();
    await $(CartSel.removeBackpack).click();
    const items = await $$(CartSel.item);
    expect(items.length).toBe(0);
  });

  it('cart badge updates when adding multiple items', async () => {
    await $(InventorySel.addBackpack).click();
    await $(InventorySel.addBikeLight).click();
    await expect($(CartSel.badge)).toHaveText('2');
  });
});
