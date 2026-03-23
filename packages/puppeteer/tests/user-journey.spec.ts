import { type Browser, type Page } from 'puppeteer';
import { launchBrowser, login } from '@support/auth';
import { users } from '@fixtures/users';
import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { CartSelectors as CartSel } from '@selectors/cart.selectors';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';
import { ProductSelectors as ProductSel } from '@selectors/product.selectors';
import { NavSelectors as NavSel } from '@selectors/nav.selectors';
import { LoginSelectors as LoginSel } from '@selectors/login.selectors';

import { fillForm } from '@support/fill-form';
import { clickMenuLink } from '@support/click-menu-link';
import { CHECKOUT_SUCCESS_MSG } from '@constants/index';


describe('User Journey', () => {
  let browser: Browser;
  let page: Page;

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await browser.newPage();
    await login(page, users.standard);
  });

  afterEach(async () => {
    await browser?.close();
  });

  it('browse product detail then add to cart and checkout', async () => {
    await page.click(InventorySel.itemName);
    await page.waitForSelector(ProductSel.detailName);
    await page.click(ProductSel.addToCartBtn);
    await page.click(InventorySel.cartLink);
    await page.click(CartSel.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillForm(page);
    await page.waitForSelector(CheckoutSel.finishBtn);
    await page.click(CheckoutSel.finishBtn);
    await page.waitForSelector(CheckoutSel.completeHeader);
    const header = await page.$eval(CheckoutSel.completeHeader, el => el.textContent);
    expect(header).toBe(CHECKOUT_SUCCESS_MSG);
  });

  it('add item, return to shopping, add second item, checkout both', async () => {
    await page.click(InventorySel.addBackpack);
    await page.click(InventorySel.cartLink);
    await page.click(CartSel.continueShopping);
    await page.waitForSelector(InventorySel.addBikeLight);
    await page.click(InventorySel.addBikeLight);
    await page.waitForSelector(InventorySel.cartBadge);
    const badge = await page.$eval(InventorySel.cartBadge, el => el.textContent);
    expect(badge).toBe('2');
    await page.click(InventorySel.cartLink);
    const items = await page.$$(CartSel.item);
    expect(items).toHaveLength(2);
    await page.click(CartSel.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillForm(page);
    await page.waitForSelector(CheckoutSel.finishBtn);
    await page.click(CheckoutSel.finishBtn);
    const header = await page.waitForSelector(CheckoutSel.completeHeader);
    expect(header).not.toBeNull();
  });

  it('remove one item mid-checkout then complete with remaining', async () => {
    await page.click(InventorySel.addBackpack);
    await page.click(InventorySel.addBikeLight);
    await page.click(InventorySel.cartLink);
    await page.click(CartSel.removeBikeLight);
    const items = await page.$$(CartSel.item);
    expect(items).toHaveLength(1);
    await page.click(CartSel.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillForm(page);
    await page.waitForSelector(CheckoutSel.finishBtn);
    await page.click(CheckoutSel.finishBtn);
    await page.waitForSelector(CheckoutSel.completeHeader);
    const header = await page.$eval(CheckoutSel.completeHeader, el => el.textContent);
    expect(header).toBe(CHECKOUT_SUCCESS_MSG);
  });

  it('complete checkout and return to inventory via back-to-products', async () => {
    await page.click(InventorySel.addBackpack);
    await page.click(InventorySel.cartLink);
    await page.click(CartSel.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillForm(page);
    await page.waitForSelector(CheckoutSel.finishBtn);
    await page.click(CheckoutSel.finishBtn);
    await page.waitForSelector(CheckoutSel.backToProducts);
    await page.click(CheckoutSel.backToProducts);
    await page.waitForSelector(InventorySel.list);
    const items = await page.$$(InventorySel.item);
    expect(items).toHaveLength(6);
  });

  it('full session: login → browse → checkout → logout', async () => {
    await page.click(InventorySel.addFleeceJacket);
    await page.click(InventorySel.cartLink);
    await page.click(CartSel.checkout);
    await page.waitForSelector(CheckoutSel.infoContainer);
    await fillForm(page);
    await page.waitForSelector(CheckoutSel.finishBtn);
    await page.click(CheckoutSel.finishBtn);
    await page.waitForSelector(CheckoutSel.backToProducts);
    await page.click(CheckoutSel.backToProducts);
    await page.click(NavSel.burgerMenuBtn);
    await clickMenuLink(page, NavSel.logoutLink);
    await page.waitForSelector(LoginSel.loginButton);
    const btn = await page.$(LoginSel.loginButton);
    expect(btn).not.toBeNull();
  });
});
