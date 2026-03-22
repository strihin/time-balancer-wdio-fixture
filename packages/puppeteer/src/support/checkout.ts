import type { Page } from 'puppeteer';
import { CheckoutSelectors as CheckoutSel } from '@selectors/checkout.selectors';
import { checkoutForms } from '@fixtures/checkout';

const { firstName, lastName, postalCode } = checkoutForms.valid;

/**
 * Sets a value on a React-controlled input element.
 * Uses the native HTMLInputElement value setter so that React's synthetic
 * event system detects the change and updates component state — plain
 * page.type() only fires keyboard events and can be silently ignored by
 * React in headless/Docker environments.
 */
export async function setInputValue(page: Page, selector: string, value: string): Promise<void> {
  await page.waitForSelector(selector, { visible: true });
  await page.click(selector, { clickCount: 3 }); // select-all to clear existing text
  await page.$eval(
    selector,
    (el, val) => {
      const input = el as HTMLInputElement;
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )!.set!;
      nativeInputValueSetter.call(input, val);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    value,
  );
}

/**
 * Fills the checkout step-1 form with valid fixture data and waits for
 * navigation to the overview page (step 2) before returning.
 */
export async function fillCheckoutForm(page: Page): Promise<void> {
  await setInputValue(page, CheckoutSel.firstName, firstName);
  await setInputValue(page, CheckoutSel.lastName, lastName);
  await setInputValue(page, CheckoutSel.postalCode, postalCode);
  await page.click(CheckoutSel.continueBtn);
  // Confirm navigation to overview before returning so callers don't race.
  await page.waitForSelector(CheckoutSel.summaryContainer);
}
