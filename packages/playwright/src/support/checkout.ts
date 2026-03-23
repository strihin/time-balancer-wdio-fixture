import { type Page } from '@playwright/test';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';
import { checkoutForms } from '@fixtures/checkout';

const { firstName, lastName, postalCode } = checkoutForms.valid;

/**
 * Fills the checkout step-1 form with valid fixture data and proceeds
 * to the overview page (step 2).
 */
export async function fillCheckoutForm(page: Page): Promise<void> {
  await page.locator(CheckoutSel.firstName).fill(firstName);
  await page.locator(CheckoutSel.lastName).fill(lastName);
  await page.locator(CheckoutSel.postalCode).fill(postalCode);
  await page.locator(CheckoutSel.continueBtn).click();
}
