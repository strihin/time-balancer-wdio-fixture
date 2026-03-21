import { type Page } from 'puppeteer';
import { CheckoutSelectors as Checkout } from '@selectors/checkout.selectors';
import { checkoutForms } from '@fixtures/checkout';

const { firstName, lastName, postalCode } = checkoutForms.valid;

export async function fillForm(page: Page) {
  await page.type(Checkout.firstName, firstName);
  await page.type(Checkout.lastName, lastName);
  await page.type(Checkout.postalCode, postalCode);
  await page.click(Checkout.continueBtn);
}
