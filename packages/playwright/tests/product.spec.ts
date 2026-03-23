import { ProductSelectors as ProductSel } from '@selectors/product.selectors';
import { login } from '@support/auth';
import { beforeEach, describe, expect, test } from '@support/test';

describe('Product Detail', () => {
  beforeEach(async ({ page }) => {
    await login(page);
  });

  test('opens product detail page on item click', async ({ page }) => {
    await page.locator(ProductSel.itemName).first().click();
    await expect(page.locator(ProductSel.detailName)).toBeVisible();
  });

  test('product detail shows correct name', async ({ page }) => {
    const name = await page.locator(ProductSel.itemName).first().textContent();
    await page.locator(ProductSel.itemName).first().click();
    await expect(page.locator(ProductSel.detailName)).toHaveText(name ?? '');
  });

  test('back button returns to inventory', async ({ page }) => {
    await page.locator(ProductSel.itemName).first().click();
    await page.locator(ProductSel.backToProducts).click();
    await expect(page.locator(ProductSel.inventoryList)).toBeVisible();
  });

  test('product image is visible on detail page', async ({ page }) => {
    await page.locator(ProductSel.itemName).first().click();
    await expect(page.locator(ProductSel.detailImage)).toBeVisible();
  });

  test('adds item to cart from detail page', async ({ page }) => {
    await page.locator(ProductSel.itemName).first().click();
    await page.locator(ProductSel.addToCartBtn).click();
    await expect(page.locator(ProductSel.cartBadge)).toHaveText('1');
  });
});
