export const CartSelectors = {
  badge: '.shopping_cart_badge',
  link: '.shopping_cart_link',
  item: '[data-test="inventory-item"]',
  itemName: '.inventory_item_name',
  itemPrice: '.inventory_item_price',
  itemQty: '.cart_quantity',
  removeBackpack: '[data-test="remove-sauce-labs-backpack"]',
  removeBikeLight: '[data-test="remove-sauce-labs-bike-light"]',
  removeFleeceJacket: '[data-test="remove-sauce-labs-fleece-jacket"]',
  checkout: '[data-test="checkout"]',
  continueShopping: '[data-test="continue-shopping"]',
} as const;
