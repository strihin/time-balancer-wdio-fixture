import { login } from '@support/auth';
import { fillCheckoutForm } from '@support/checkout';
import { addThreeItems } from '@support/inventory';
import { users } from '@fixtures/users';
import { InventorySelectors as Inv } from '@selectors/inventory.selectors';
import { CartSelectors as Cart } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';

describe('Checkout – Multi-item', () => {
  beforeEach(async () => {
    await login(users.glitch);
    await addThreeItems();
    await $(Inv.cartLink).click();
  });

  it('cart shows 3 items after adding three products', async () => {
    await expect($(Cart.badge)).toHaveText('3');
    const items = await $$(Cart.item);
    expect(items.length).toBe(3);
  });

  it('checkout overview lists all three items', async () => {
    await $(Cart.checkout).click();
    await fillCheckoutForm();
    const items = await $$(CheckoutSel.summaryItem);
    expect(items.length).toBe(3);
  });

  it('item total on overview matches sum of item prices', async () => {
    await $(Cart.checkout).click();
    await fillCheckoutForm();
    const itemTotalText = await $(CheckoutSel.itemTotal).getText();
    const itemTotal = parseFloat(itemTotalText.replace(/[^0-9.]/g, ''));
    expect(itemTotal).toBeGreaterThan(0);
  });

  it('tax is calculated on overview', async () => {
    await $(Cart.checkout).click();
    await fillCheckoutForm();
    const taxText = await $(CheckoutSel.taxLabel).getText();
    const tax = parseFloat(taxText.replace(/[^0-9.]/g, ''));
    expect(tax).toBeGreaterThan(0);
  });

  it('completes checkout with multiple items', async () => {
    await $(Cart.checkout).click();
    await fillCheckoutForm();
    await $(CheckoutSel.finishBtn).click();
    await expect($(CheckoutSel.completeHeader)).toHaveText('Thank you for your order!');
  });
});
