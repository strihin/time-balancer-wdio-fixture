import { checkoutForms } from '@fixtures/checkout';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';

const { firstName, lastName, postalCode } = checkoutForms.valid;

/**
 * Fills the checkout step-1 form with valid fixture data and proceeds
 * to the overview page (step 2).
 */
export async function fillCheckoutForm(): Promise<void> {
  await $(CheckoutSel.firstName).setValue(firstName);
  await $(CheckoutSel.lastName).setValue(lastName);
  await $(CheckoutSel.postalCode).setValue(postalCode);
  await $(CheckoutSel.continueBtn).click();
}
