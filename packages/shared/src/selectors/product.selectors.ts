export const ProductSelectors = {
  itemName: '.inventory_item_name',
  detailName: '[data-test="inventory-item-name"]',
  detailImage: '.inventory_details_img',
  addToCartBtn: '[class*="btn_inventory"]',
  backToProducts: '[data-test="back-to-products"]',
  cartBadge: '.shopping_cart_badge',
  inventoryList: '.inventory_list',
} as const;
