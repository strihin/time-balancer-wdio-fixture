export const InventorySelectors = {
  list: '.inventory_list',
  item: '.inventory_item',
  itemName: '.inventory_item_name',
  itemPrice: '.inventory_item_price',
  sortContainer: '.product_sort_container',
  addBackpack: '[data-test="add-to-cart-sauce-labs-backpack"]',
  addBikeLight: '[data-test="add-to-cart-sauce-labs-bike-light"]',
  addFleeceJacket: '[data-test="add-to-cart-sauce-labs-fleece-jacket"]',
  removeBackpack: '[data-test="remove-sauce-labs-backpack"]',
  cartBadge: '.shopping_cart_badge',
  cartLink: '.shopping_cart_link',
} as const;
