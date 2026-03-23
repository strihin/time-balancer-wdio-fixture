import { checkoutForms } from '@fixtures/checkout';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';

const { firstName, lastName, postalCode } = checkoutForms.valid;

/**
 * Fills the checkout step-1 form with valid fixture data and proceeds
 * to the overview page (step 2).
 */
export function fillCheckoutForm(): void {
  cy.get(CheckoutSel.firstName).type(firstName);
  cy.get(CheckoutSel.lastName).type(lastName);
  cy.get(CheckoutSel.postalCode).type(postalCode);
  cy.get(CheckoutSel.continueBtn).click();
}
