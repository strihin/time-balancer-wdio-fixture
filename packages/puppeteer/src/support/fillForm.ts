import { type Page } from 'puppeteer';
import { CheckoutSelectors as Checkout } from '@selectors/checkout.selectors';
import { checkoutForms } from '@fixtures/checkout';
import { InventorySelectors as Inv } from '@selectors/inventory.selectors';

const { firstName, lastName, postalCode } = checkoutForms.valid;

/**
 * Sets a value on a React-controlled input element.
 * Uses the native HTMLInputElement value setter so that React's synthetic
 * event system detects the change and updates component state — plain
 * page.type() only fires keyboard events and can be silently ignored by
 * React in headless/Docker environments.
 */
async function setInputValue(page: Page, selector: string, value: string): Promise<void> {
  await page.waitForSelector(selector, { visible: true });
  await page.click(selector, { clickCount: 3 }); // select-all to clear any existing text
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

export async function fillForm(page: Page): Promise<void> {
  await setInputValue(page, Checkout.firstName, firstName);
  await setInputValue(page, Checkout.lastName, lastName);
  await setInputValue(page, Checkout.postalCode, postalCode);
  await page.click(Checkout.continueBtn);
  // Wait for navigation to the checkout overview (step 2) before returning,
  // so callers can immediately query elements on that page without racing.
  await page.waitForSelector(Checkout.summaryContainer);
}
export async function addThreeItems(page: Page) {
  await page.click(Inv.addBackpack);
  await page.click(Inv.addBikeLight);
  await page.click(Inv.addFleeceJacket);
}

