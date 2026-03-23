import { CHECKOUT_SUCCESS_MSG } from '@constants/index';
import { users } from '@fixtures/users';
import { CartSelectors as CartSel } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { LoginSelectors as LoginSel } from '@selectors/login.selectors';
import { NavSelectors as NavSel } from '@selectors/nav.selectors';
import { ProductSelectors as ProductSel } from '@selectors/product.selectors';
import { login } from '@support/auth';
import { fillCheckoutForm } from '@support/checkout';

describe('User Journey', () => {
  beforeEach(async () => {
    await login(users.glitch);
  });

  it('browse product detail then add to cart and checkout', async () => {
    await $(InventorySel.itemName).click();
    await expect($(ProductSel.detailName)).toBeDisplayed();
    await $(ProductSel.addToCartBtn).click();
    await $(InventorySel.cartLink).click();
    await $(CartSel.checkout).click();
    await fillCheckoutForm();
    await $(CheckoutSel.finishBtn).click();
    await expect($(CheckoutSel.completeHeader)).toHaveText(CHECKOUT_SUCCESS_MSG);
  });

  it('add item, return to shopping, add second item, checkout both', async () => {
    await $(InventorySel.addBackpack).click();
    await $(InventorySel.cartLink).click();
    await $(CartSel.continueShopping).click();
    await $(InventorySel.addBikeLight).click();
    await expect($(InventorySel.cartBadge)).toHaveText('2');
    await $(InventorySel.cartLink).click();
    const items = await $$(CartSel.item);
    expect(items.length).toBe(2);
    await $(CartSel.checkout).click();
    await fillCheckoutForm();
    await $(CheckoutSel.finishBtn).click();
    await expect($(CheckoutSel.completeHeader)).toBeDisplayed();
  });

  it('remove one item mid-checkout then complete with remaining', async () => {
    await $(InventorySel.addBackpack).click();
    await $(InventorySel.addBikeLight).click();
    await $(InventorySel.cartLink).click();
    await $(CartSel.removeBikeLight).click();
    const items = await $$(CartSel.item);
    expect(items.length).toBe(1);
    await $(CartSel.checkout).click();
    await fillCheckoutForm();
    await $(CheckoutSel.finishBtn).click();
    await expect($(CheckoutSel.completeHeader)).toHaveText(CHECKOUT_SUCCESS_MSG);
  });

  it('complete checkout and return to inventory via back-to-products', async () => {
    await $(InventorySel.addBackpack).click();
    await $(InventorySel.cartLink).click();
    await $(CartSel.checkout).click();
    await fillCheckoutForm();
    await $(CheckoutSel.finishBtn).click();
    await $(CheckoutSel.backToProducts).click();
    await expect($(InventorySel.list)).toBeDisplayed();
    const items = await $$(InventorySel.item);
    expect(items.length).toBe(6);
  });

  it('full session: login → browse → checkout → logout', async () => {
    await $(InventorySel.addFleeceJacket).click();
    await $(InventorySel.cartLink).click();
    await $(CartSel.checkout).click();
    await fillCheckoutForm();
    await $(CheckoutSel.finishBtn).click();
    await $(CheckoutSel.backToProducts).click();
    await $(NavSel.burgerMenuBtn).click();
    await $(NavSel.logoutLink).click();
    await expect($(LoginSel.loginButton)).toBeDisplayed();
  });
});
