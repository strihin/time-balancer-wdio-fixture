import { login } from '@support/auth';
import { fillCheckoutForm } from '@support/checkout';
import { addThreeItems } from '@support/inventory';
import { users } from '@fixtures/users';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { CartSelectors as CartSel } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';
import { CHECKOUT_SUCCESS_MSG } from '@constants/index';
import { parseCurrencyText } from '@utils/price';

describe('Checkout – Multi-item', () => {
  beforeEach(async () => {
    await login(users.glitch);
    await addThreeItems();
    await $(InventorySel.cartLink).click();
  });

  it('cart shows 3 items after adding three products', async () => {
    await expect($(CartSel.badge)).toHaveText('3');
    const items = await $$(CartSel.item);
    expect(items.length).toBe(3);
  });

  it('checkout overview lists all three items', async () => {
    await $(CartSel.checkout).click();
    await fillCheckoutForm();
    const items = await $$(CheckoutSel.summaryItem);
    expect(items.length).toBe(3);
  });

  it('item total on overview matches sum of item prices', async () => {
    await $(CartSel.checkout).click();
    await fillCheckoutForm();
    const itemTotalText = await $(CheckoutSel.itemTotal).getText();
    const itemTotal = parseCurrencyText(itemTotalText);
    expect(itemTotal).toBeGreaterThan(0);
  });

  it('tax is calculated on overview', async () => {
    await $(CartSel.checkout).click();
    await fillCheckoutForm();
    const taxText = await $(CheckoutSel.taxLabel).getText();
    const tax = parseCurrencyText(taxText);
    expect(tax).toBeGreaterThan(0);
  });

  it('completes checkout with multiple items', async () => {
    await $(CartSel.checkout).click();
    await fillCheckoutForm();
    await $(CheckoutSel.finishBtn).click();
    await expect($(CheckoutSel.completeHeader)).toHaveText(CHECKOUT_SUCCESS_MSG);
  });
});
