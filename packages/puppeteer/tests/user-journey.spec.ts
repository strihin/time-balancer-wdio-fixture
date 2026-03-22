import { type Browser, type Page } from 'puppeteer';
import { launchBrowser, login } from '@support/auth';
import { users } from '@fixtures/users';
import { InventorySelectors as Inv } from '@selectors/inventory.selectors';
import { CartSelectors as Cart } from '@selectors/cart.selectors';
import { CheckoutSelectors as Checkout } from '@selectors/checkout.selectors';
import { ProductSelectors as Product } from '@selectors/product.selectors';
import { NavSelectors as Nav } from '@selectors/nav.selectors';
import { LoginSelectors as Login } from '@selectors/login.selectors';

import { fillForm } from '@support/fill-form';
import { clickMenuLink } from '@support/click-menu-link';


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
    await page.click(Inv.itemName);
    await page.waitForSelector(Product.detailName);
    await page.click(Product.addToCartBtn);
    await page.click(Inv.cartLink);
    await page.click(Cart.checkout);
    await page.waitForSelector(Checkout.infoContainer);
    await fillForm(page);
    await page.waitForSelector(Checkout.finishBtn);
    await page.click(Checkout.finishBtn);
    await page.waitForSelector(Checkout.completeHeader);
    const header = await page.$eval(Checkout.completeHeader, el => el.textContent);
    expect(header).toBe('Thank you for your order!');
  });

  it('add item, return to shopping, add second item, checkout both', async () => {
    await page.click(Inv.addBackpack);
    await page.click(Inv.cartLink);
    await page.click(Cart.continueShopping);
    await page.waitForSelector(Inv.addBikeLight);
    await page.click(Inv.addBikeLight);
    await page.waitForSelector(Inv.cartBadge);
    const badge = await page.$eval(Inv.cartBadge, el => el.textContent);
    expect(badge).toBe('2');
    await page.click(Inv.cartLink);
    const items = await page.$$(Cart.item);
    expect(items).toHaveLength(2);
    await page.click(Cart.checkout);
    await page.waitForSelector(Checkout.infoContainer);
    await fillForm(page);
    await page.waitForSelector(Checkout.finishBtn);
    await page.click(Checkout.finishBtn);
    const header = await page.waitForSelector(Checkout.completeHeader);
    expect(header).not.toBeNull();
  });

  it('remove one item mid-checkout then complete with remaining', async () => {
    await page.click(Inv.addBackpack);
    await page.click(Inv.addBikeLight);
    await page.click(Inv.cartLink);
    await page.click(Cart.removeBikeLight);
    const items = await page.$$(Cart.item);
    expect(items).toHaveLength(1);
    await page.click(Cart.checkout);
    await page.waitForSelector(Checkout.infoContainer);
    await fillForm(page);
    await page.waitForSelector(Checkout.finishBtn);
    await page.click(Checkout.finishBtn);
    await page.waitForSelector(Checkout.completeHeader);
    const header = await page.$eval(Checkout.completeHeader, el => el.textContent);
    expect(header).toBe('Thank you for your order!');
  });

  it('complete checkout and return to inventory via back-to-products', async () => {
    await page.click(Inv.addBackpack);
    await page.click(Inv.cartLink);
    await page.click(Cart.checkout);
    await page.waitForSelector(Checkout.infoContainer);
    await fillForm(page);
    await page.waitForSelector(Checkout.finishBtn);
    await page.click(Checkout.finishBtn);
    await page.waitForSelector(Checkout.backToProducts);
    await page.click(Checkout.backToProducts);
    await page.waitForSelector(Inv.list);
    const items = await page.$$(Inv.item);
    expect(items).toHaveLength(6);
  });

  it('full session: login → browse → checkout → logout', async () => {
    await page.click(Inv.addFleeceJacket);
    await page.click(Inv.cartLink);
    await page.click(Cart.checkout);
    await page.waitForSelector(Checkout.infoContainer);
    await fillForm(page);
    await page.waitForSelector(Checkout.finishBtn);
    await page.click(Checkout.finishBtn);
    await page.waitForSelector(Checkout.backToProducts);
    await page.click(Checkout.backToProducts);
    await page.click(Nav.burgerMenuBtn);
    await clickMenuLink(page, Nav.logoutLink);
    await page.waitForSelector(Login.loginButton);
    const btn = await page.$(Login.loginButton);
    expect(btn).not.toBeNull();
  });
});
