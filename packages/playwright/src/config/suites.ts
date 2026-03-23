export const suites: Record<string, string[]> = {
  login: ['tests/login.spec.ts'],
  inventory: ['tests/inventory.spec.ts'],
  cart: ['tests/cart.spec.ts'],
  checkout: ['tests/checkout.spec.ts'],
  'checkout-validation': ['tests/checkout-validation.spec.ts'],
  'checkout-multi-item': ['tests/checkout-multi-item.spec.ts'],
  product: ['tests/product.spec.ts'],
  logout: ['tests/logout.spec.ts'],
  sorting: ['tests/sorting.spec.ts'],
  'user-journey': ['tests/user-journey.spec.ts'],
};
