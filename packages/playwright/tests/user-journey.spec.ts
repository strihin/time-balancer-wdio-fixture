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
import { beforeEach, describe, expect, test } from '@support/test';

describe('User Journey', () => {
  beforeEach(async ({ page }) => {
    await login(page, users.glitch);
  });

  test('browse product detail then add to cart and checkout', async ({ page }) => {
    await page.locator(InventorySel.itemName).first().click();
    await expect(page.locator(ProductSel.detailName)).toBeVisible();
    await page.locator(ProductSel.addToCartBtn).click();
    await page.locator(InventorySel.cartLink).click();
    await page.locator(CartSel.checkout).click();
    await fillCheckoutForm(page);
    await page.locator(CheckoutSel.finishBtn).click();
    await expect(page.locator(CheckoutSel.completeHeader)).toHaveText(CHECKOUT_SUCCESS_MSG);
  });

  test('add item, return to shopping, add second item, checkout both', async ({ page }) => {
    await page.locator(InventorySel.addBackpack).click();
    await page.locator(InventorySel.cartLink).click();
    await page.locator(CartSel.continueShopping).click();
    await page.locator(InventorySel.addBikeLight).click();
    await expect(page.locator(InventorySel.cartBadge)).toHaveText('2');
    await page.locator(InventorySel.cartLink).click();
    await expect(page.locator(CartSel.item)).toHaveCount(2);
    await page.locator(CartSel.checkout).click();
    await fillCheckoutForm(page);
    await page.locator(CheckoutSel.finishBtn).click();
    await expect(page.locator(CheckoutSel.completeHeader)).toBeVisible();
  });

  test('remove one item mid-checkout then complete with remaining', async ({ page }) => {
    await page.locator(InventorySel.addBackpack).click();
    await page.locator(InventorySel.addBikeLight).click();
    await page.locator(InventorySel.cartLink).click();
    await page.locator(CartSel.removeBikeLight).click();
    await expect(page.locator(CartSel.item)).toHaveCount(1);
    await page.locator(CartSel.checkout).click();
    await fillCheckoutForm(page);
    await page.locator(CheckoutSel.finishBtn).click();
    await expect(page.locator(CheckoutSel.completeHeader)).toHaveText(CHECKOUT_SUCCESS_MSG);
  });

  test('complete checkout and return to inventory via back-to-products', async ({ page }) => {
    await page.locator(InventorySel.addBackpack).click();
    await page.locator(InventorySel.cartLink).click();
    await page.locator(CartSel.checkout).click();
    await fillCheckoutForm(page);
    await page.locator(CheckoutSel.finishBtn).click();
    await page.locator(CheckoutSel.backToProducts).click();
    await expect(page.locator(InventorySel.list)).toBeVisible();
    await expect(page.locator(InventorySel.item)).toHaveCount(6);
  });

  test('full session: login → browse → checkout → logout', async ({ page }) => {
    await page.locator(InventorySel.addFleeceJacket).click();
    await page.locator(InventorySel.cartLink).click();
    await page.locator(CartSel.checkout).click();
    await fillCheckoutForm(page);
    await page.locator(CheckoutSel.finishBtn).click();
    await page.locator(CheckoutSel.backToProducts).click();
    await page.locator(NavSel.burgerMenuBtn).click();
    await page.locator(NavSel.logoutLink).click();
    await expect(page.locator(LoginSel.loginButton)).toBeVisible();
  });
});
