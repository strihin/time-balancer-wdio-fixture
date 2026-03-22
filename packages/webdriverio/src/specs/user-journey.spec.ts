import { login } from '@support/auth';
import { fillCheckoutForm } from '@support/checkout';
import { users } from '@fixtures/users';
import { InventorySelectors as Inv } from '@selectors/inventory.selectors';
import { CartSelectors as Cart } from '@selectors/cart.selectors';
import { CheckoutSelectors as Checkout } from '@selectors/checkout.selectors';
import { ProductSelectors as Product } from '@selectors/product.selectors';
import { NavSelectors as Nav } from '@selectors/nav.selectors';
import { LoginSelectors as Login } from '@selectors/login.selectors';

describe('User Journey', () => {
  beforeEach(async () => {
    await login(users.glitch);
  });

  it('browse product detail then add to cart and checkout', async () => {
    await $(Inv.itemName).click();
    await expect($(Product.detailName)).toBeDisplayed();
    await $(Product.addToCartBtn).click();
    await $(Inv.cartLink).click();
    await $(Cart.checkout).click();
    await fillCheckoutForm();
    await $(Checkout.finishBtn).click();
    await expect($(Checkout.completeHeader)).toHaveText('Thank you for your order!');
  });

  it('add item, return to shopping, add second item, checkout both', async () => {
    await $(Inv.addBackpack).click();
    await $(Inv.cartLink).click();
    await $(Cart.continueShopping).click();
    await $(Inv.addBikeLight).click();
    await expect($(Inv.cartBadge)).toHaveText('2');
    await $(Inv.cartLink).click();
    const items = await $$(Cart.item);
    expect(items.length).toBe(2);
    await $(Cart.checkout).click();
    await fillCheckoutForm();
    await $(Checkout.finishBtn).click();
    await expect($(Checkout.completeHeader)).toBeDisplayed();
  });

  it('remove one item mid-checkout then complete with remaining', async () => {
    await $(Inv.addBackpack).click();
    await $(Inv.addBikeLight).click();
    await $(Inv.cartLink).click();
    await $(Cart.removeBikeLight).click();
    const items = await $$(Cart.item);
    expect(items.length).toBe(1);
    await $(Cart.checkout).click();
    await fillCheckoutForm();
    await $(Checkout.finishBtn).click();
    await expect($(Checkout.completeHeader)).toHaveText('Thank you for your order!');
  });

  it('complete checkout and return to inventory via back-to-products', async () => {
    await $(Inv.addBackpack).click();
    await $(Inv.cartLink).click();
    await $(Cart.checkout).click();
    await fillCheckoutForm();
    await $(Checkout.finishBtn).click();
    await $(Checkout.backToProducts).click();
    await expect($(Inv.list)).toBeDisplayed();
    const items = await $$(Inv.item);
    expect(items.length).toBe(6);
  });

  it('full session: login → browse → checkout → logout', async () => {
    await $(Inv.addFleeceJacket).click();
    await $(Inv.cartLink).click();
    await $(Cart.checkout).click();
    await fillCheckoutForm();
    await $(Checkout.finishBtn).click();
    await $(Checkout.backToProducts).click();
    await $(Nav.burgerMenuBtn).click();
    await $(Nav.logoutLink).click();
    await expect($(Login.loginButton)).toBeDisplayed();
  });
});
