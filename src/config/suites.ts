export const suites: Record<string, string[]> = {
  login:                  ['./src/specs/saucedemo/login.spec.ts'],
  inventory:              ['./src/specs/saucedemo/inventory.spec.ts'],
  cart:                   ['./src/specs/saucedemo/cart.spec.ts'],
  checkout:               ['./src/specs/saucedemo/checkout.spec.ts'],
  'checkout-validation':  ['./src/specs/saucedemo/checkout-validation.spec.ts'],
  'checkout-multi-item':  ['./src/specs/saucedemo/checkout-multi-item.spec.ts'],
  product:                ['./src/specs/saucedemo/product.spec.ts'],
  logout:                 ['./src/specs/saucedemo/logout.spec.ts'],
  sorting:                ['./src/specs/saucedemo/sorting.spec.ts'],
  'user-journey':         ['./src/specs/saucedemo/user-journey.spec.ts'],
};
