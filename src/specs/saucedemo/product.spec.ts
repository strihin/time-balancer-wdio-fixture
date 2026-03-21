import { login } from '@support/auth';
import { ProductSelectors as ProductSel } from '@selectors/product.selectors';

describe('Product Detail', () => {
  beforeEach(async () => {
    await login();
  });

  it('opens product detail page on item click', async () => {
    await $(ProductSel.itemName).click();
    await expect($(ProductSel.detailName)).toBeDisplayed();
  });

  it('product detail shows correct name', async () => {
    const name = await $(ProductSel.itemName).getText();
    await $(ProductSel.itemName).click();
    const detailName = await $(ProductSel.detailName).getText();
    expect(detailName).toBe(name);
  });

  it('back button returns to inventory', async () => {
    await $(ProductSel.itemName).click();
    await $(ProductSel.backToProducts).click();
    await expect($(ProductSel.inventoryList)).toBeDisplayed();
  });

  it('product image is visible on detail page', async () => {
    await $(ProductSel.itemName).click();
    await expect($(ProductSel.detailImage)).toBeDisplayed();
  });

  it('adds item to cart from detail page', async () => {
    await $(ProductSel.itemName).click();
    await $(ProductSel.addToCartBtn).click();
    await expect($(ProductSel.cartBadge)).toHaveText('1');
  });
});
