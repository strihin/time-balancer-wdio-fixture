import { login } from '@support/auth.js';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors.js';
import { CartSelectors as CartSel } from '@selectors/cart.selectors.js';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors.js';

describe('Checkout – Form Validation', () => {
  beforeEach(async () => {
    await login();
    await $(InventorySel.addBackpack).click();
    await $(InventorySel.cartLink).click();
    await $(CartSel.checkout).click();
    await expect($(CheckoutSel.infoContainer)).toBeDisplayed();
  });

  it('shows error when first name is missing', async () => {
    await $(CheckoutSel.lastName).setValue('Doe');
    await $(CheckoutSel.postalCode).setValue('10001');
    await $(CheckoutSel.continueBtn).click();
    await expect($(CheckoutSel.error)).toHaveText(expect.stringContaining('First Name'));
  });

  it('shows error when last name is missing', async () => {
    await $(CheckoutSel.firstName).setValue('Jane');
    await $(CheckoutSel.postalCode).setValue('10001');
    await $(CheckoutSel.continueBtn).click();
    await expect($(CheckoutSel.error)).toHaveText(expect.stringContaining('Last Name'));
  });

  it('shows error when postal code is missing', async () => {
    await $(CheckoutSel.firstName).setValue('Jane');
    await $(CheckoutSel.lastName).setValue('Doe');
    await $(CheckoutSel.continueBtn).click();
    await expect($(CheckoutSel.error)).toHaveText(expect.stringContaining('Postal Code'));
  });

  it('shows error when all fields are empty', async () => {
    await $(CheckoutSel.continueBtn).click();
    await expect($(CheckoutSel.error)).toBeDisplayed();
  });

  it('cancel button returns to cart page', async () => {
    await $(CheckoutSel.cancelBtn).click();
    await expect($(CartSel.item)).toBeDisplayed();
  });
});
