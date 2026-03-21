import { test, expect } from '@playwright/test';
import { login } from '@support/auth';
import { users } from '@fixtures/users';
import { checkoutForms } from '@fixtures/checkout';
import { InventorySelectors as Inv } from '@selectors/inventory.selectors';
import { CartSelectors as Cart } from '@selectors/cart.selectors';
import { CheckoutSelectors as Checkout } from '@selectors/checkout.selectors';
import { ProductSelectors as Product } from '@selectors/product.selectors';
import { NavSelectors as Nav } from '@selectors/nav.selectors';
import { LoginSelectors as Login } from '@selectors/login.selectors';

const { firstName, lastName, postalCode } = checkoutForms.valid;

async function fillForm(page: import('@playwright/test').Page) {
  await page.locator(Checkout.firstName).fill(firstName);
  await page.locator(Checkout.lastName).fill(lastName);
  await page.locator(Checkout.postalCode).fill(postalCode);
  await page.locator(Checkout.continueBtn).click();
}

test.describe('User Journey', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, users.glitch);
  });

  test('browse product detail then add to cart and checkout', async ({ page }) => {
    await page.locator(Inv.itemName).first().click();
    await expect(page.locator(Product.detailName)).toBeVisible();
    await page.locator(Product.addToCartBtn).click();
    await page.locator(Inv.cartLink).click();
    await page.locator(Cart.checkout).click();
    await fillForm(page);
    await page.locator(Checkout.finishBtn).click();
    await expect(page.locator(Checkout.completeHeader)).toHaveText('Thank you for your order!');
  });

  test('add item, return to shopping, add second item, checkout both', async ({ page }) => {
    await page.locator(Inv.addBackpack).click();
    await page.locator(Inv.cartLink).click();
    await page.locator(Cart.continueShopping).click();
    await page.locator(Inv.addBikeLight).click();
    await expect(page.locator(Inv.cartBadge)).toHaveText('2');
    await page.locator(Inv.cartLink).click();
    await expect(page.locator(Cart.item)).toHaveCount(2);
    await page.locator(Cart.checkout).click();
    await fillForm(page);
    await page.locator(Checkout.finishBtn).click();
    await expect(page.locator(Checkout.completeHeader)).toBeVisible();
  });

  test('remove one item mid-checkout then complete with remaining', async ({ page }) => {
    await page.locator(Inv.addBackpack).click();
    await page.locator(Inv.addBikeLight).click();
    await page.locator(Inv.cartLink).click();
    await page.locator(Cart.removeBikeLight).click();
    await expect(page.locator(Cart.item)).toHaveCount(1);
    await page.locator(Cart.checkout).click();
    await fillForm(page);
    await page.locator(Checkout.finishBtn).click();
    await expect(page.locator(Checkout.completeHeader)).toHaveText('Thank you for your order!');
  });

  test('complete checkout and return to inventory via back-to-products', async ({ page }) => {
    await page.locator(Inv.addBackpack).click();
    await page.locator(Inv.cartLink).click();
    await page.locator(Cart.checkout).click();
    await fillForm(page);
    await page.locator(Checkout.finishBtn).click();
    await page.locator(Checkout.backToProducts).click();
    await expect(page.locator(Inv.list)).toBeVisible();
    await expect(page.locator(Inv.item)).toHaveCount(6);
  });

  test('full session: login → browse → checkout → logout', async ({ page }) => {
    await page.locator(Inv.addFleeceJacket).click();
    await page.locator(Inv.cartLink).click();
    await page.locator(Cart.checkout).click();
    await fillForm(page);
    await page.locator(Checkout.finishBtn).click();
    await page.locator(Checkout.backToProducts).click();
    await page.locator(Nav.burgerMenuBtn).click();
    await page.locator(Nav.logoutLink).click();
    await expect(page.locator(Login.loginButton)).toBeVisible();
  });
});
