import { InventorySelectors as InventorySel } from '@selectors/inventory.selectors';
import { parseCurrencyText } from '@utils/price';

/** Returns the text content of all item name elements on the inventory page. */
export async function getItemNames(): Promise<string[]> {
  return $$(InventorySel.itemName).map((el) => el.getText());
}

/** Returns the parsed numeric price of all item price elements on the inventory page. */
export async function getItemPrices(): Promise<number[]> {
  const texts: string[] = await $$(InventorySel.itemPrice).map((el) => el.getText());
  return texts.map((t) => parseCurrencyText(t));
}
