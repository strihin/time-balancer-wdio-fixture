import { login } from '@support/auth';
import { fillCheckoutForm } from '@support/checkout';
import { users } from '@fixtures/users';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { CartSelectors as CartSel } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';

// performance_glitch_user adds artificial delays per page load → ~10 s per step
describe('Checkout', () => {
  beforeEach(async () => {
    // Slow user: each page load takes ~5–10 s, full flow lands at ~45–60 s total
    await login(users.glitch);
    await $(InventorySel.addBackpack).click();
    await $(CartSel.link).click();
  });

  it('proceeds to checkout from cart', async () => {
    await $(CartSel.checkout).click();
    await expect($(CheckoutSel.infoContainer)).toBeDisplayed();
  });

  it('fills in customer info and continues to overview', async () => {
    await $(CartSel.checkout).click();
    await fillCheckoutForm();
    await expect($(CheckoutSel.summaryContainer)).toBeDisplayed();
  });

  it('overview shows item total', async () => {
    await $(CartSel.checkout).click();
    await fillCheckoutForm();
    await expect($(CheckoutSel.totalLabel)).toBeDisplayed();
  });

  // Retry candidate: glitch user occasionally pauses mid-flow
  it('completes full checkout and shows confirmation', async () => {
    await $(CartSel.checkout).click();
    await fillCheckoutForm();
    await $(CheckoutSel.finishBtn).click();
    await expect($(CheckoutSel.completeHeader)).toHaveText('Thank you for your order!');
  });

  it('can navigate back to home after checkout', async () => {
    await $(CartSel.checkout).click();
    await fillCheckoutForm();
    await $(CheckoutSel.finishBtn).click();
    await $(CheckoutSel.backToProducts).click();
    await expect($(CheckoutSel.inventoryList)).toBeDisplayed();
  });
});
