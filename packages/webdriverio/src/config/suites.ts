export const suites: Record<string, string[]> = {
  login:                  ['./src/specs/login.spec.ts'],
  inventory:              ['./src/specs/inventory.spec.ts'],
  cart:                   ['./src/specs/cart.spec.ts'],
  checkout:               ['./src/specs/checkout.spec.ts'],
  'checkout-validation':  ['./src/specs/checkout-validation.spec.ts'],
  'checkout-multi-item':  ['./src/specs/checkout-multi-item.spec.ts'],
  product:                ['./src/specs/product.spec.ts'],
  logout:                 ['./src/specs/logout.spec.ts'],
  sorting:                ['./src/specs/sorting.spec.ts'],
  'user-journey':         ['./src/specs/user-journey.spec.ts'],
};
