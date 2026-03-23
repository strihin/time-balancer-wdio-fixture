/**
 * Strips all non-numeric characters except the decimal point and returns
 * a floating-point number. Handles values like "$29.99", "Item total: $29.99",
 * "Tax: $2.40", etc.
 */
export function parseCurrencyText(text: string): number {
  return Number.parseFloat(text.replace(/[^0-9.]/g, ''));
}
